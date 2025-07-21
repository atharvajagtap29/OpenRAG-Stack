import path from "path";
import {
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { GenerateUniqueId } from "../utils/utility.js";
import asyncHandler from "../utils/asyncHandler.js";
import { s3Client } from "../utils/AWS/clients.js";
import { Context } from "../models/context.model.js";
import { weaviateClient } from "../utils/GenAI/weaviateClient.js";

// ✅ Upload Context Document to S3 and database
export const uploadContextDocument = asyncHandler(async (req, res) => {
  try {
    const { context_name, context_type } = req.body;
    const file = req.file;

    if (!context_name || !context_type || !file) {
      return res.status(400).json({
        success: false,
        message: "context_name, context_type, and context_file are required",
      });
    }

    const allowedExtensions = [".pdf", ".docx", ".txt"];
    const extension = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      return res.status(400).json({
        success: false,
        message: "Only PDF, DOCX, and TXT files are allowed",
      });
    }

    const context_id = GenerateUniqueId();
    const s3Folder = `context/${context_id}__${context_type}__${context_name}`;
    const s3Key = `${s3Folder}/${file.originalname.trim()}`;

    const uploadParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    await s3Client.send(new PutObjectCommand(uploadParams));

    await Context.create({
      context_id,
      context_name,
      context_type,
      s3_key: s3Key,
    });

    return res.status(201).json({
      success: true,
      message: "File uploaded to S3 and metadata saved in DB successfully",
      data: {
        context_id,
        context_name,
        context_type,
        s3_key: s3Key,
      },
    });
  } catch (error) {
    console.error("Error uploading context document:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload context document.",
      error: error.message,
    });
  }
});

// ✅ Get All Contexts
export const getAllContexts = asyncHandler(async (req, res) => {
  try {
    const searchQuery = req.query.searchQuery || "";
    const type = req.query.type;

    const whereClause = {
      ...(searchQuery && {
        [Op.or]: [
          { context_name: { [Op.iLike]: `%${searchQuery}%` } },
          { context_type: { [Op.iLike]: `%${searchQuery}%` } },
        ],
      }),
      ...(type && { context_type: type }),
    };

    const totalItems = await Context.count({ where: whereClause });

    let limit = parseInt(req.query.limit) || totalItems || 10;
    let page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const contexts = await Context.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const totalPages = limit ? Math.ceil(totalItems / limit) : 1;

    return res.status(200).json({
      success: true,
      message: contexts.length
        ? "Contexts fetched successfully"
        : "No contexts found",
      data: contexts,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        page_size: limit,
        total_items: totalItems,
      },
    });
  } catch (error) {
    console.error("Error fetching contexts:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch contexts.",
      error: error.message,
    });
  }
});

// ✅ Delete Context Document and Embeddings
// DELETE /api/v1/context/:context_id
export const deleteContextDocument = asyncHandler(async (req, res) => {
  const { context_ids } = req.body;

  if (!Array.isArray(context_ids) || context_ids.length === 0) {
    return res.status(400).json({
      success: false,
      message: "context_ids must be a non-empty array",
    });
  }

  const results = [];

  for (const context_id of context_ids) {
    try {
      const s3Prefix = `context/${context_id}`;

      // 1. Delete from S3
      const listedObjects = await s3Client.send(
        new ListObjectsV2Command({
          Bucket: process.env.BUCKET_NAME,
          Prefix: s3Prefix,
        })
      );

      if (listedObjects.Contents?.length > 0) {
        await s3Client.send(
          new DeleteObjectsCommand({
            Bucket: process.env.BUCKET_NAME,
            Delete: {
              Objects: listedObjects.Contents.map((obj) => ({ Key: obj.Key })),
              Quiet: true,
            },
          })
        );
      }

      // 2. Delete from Weaviate
      await weaviateClient.batch
        .objectsBatchDeleter()
        .withClassName("DocumentChunk")
        .withWhere({
          path: ["context_id"],
          operator: "Equal",
          valueString: context_id,
        })
        .do();

      // 3. Delete from DB
      await Context.destroy({ where: { context_id } });

      results.push({ context_id, status: "deleted" });
    } catch (err) {
      console.error(`Failed to delete ${context_id}:`, err.message);
      results.push({ context_id, status: "error", error: err.message });
    }
  }

  return res.status(200).json({
    success: true,
    message: "Bulk delete operation completed.",
    results,
  });
});

// ✅ Delete ALL DocumentChunk Embeddings (using doc_id LIKE '*')
export const deleteAllContextEmbeddings = asyncHandler(async (req, res) => {
  try {
    const deleteResult = await weaviateClient.batch
      .objectsBatchDeleter()
      .withClassName("DocumentChunk")
      .withWhere({
        path: ["context_id"],
        operator: "Like",
        valueString: "*", // Match all context_id values
      })
      .do();

    return res.status(200).json({
      success: true,
      message: "All DocumentChunk embeddings deleted from Weaviate.",
      result: deleteResult,
    });
  } catch (error) {
    console.error("Error deleting all DocumentChunk embeddings:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete all DocumentChunk embeddings.",
      error: error.message,
    });
  }
});
