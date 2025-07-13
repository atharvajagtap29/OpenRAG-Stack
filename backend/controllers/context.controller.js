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

// ✅ Upload Context Document
// POST /api/v1/context
// export const uploadContextDocument = asyncHandler(async (req, res) => {
//   const { context_name, context_type } = req.body;
//   const file = req.file;

//   if (!context_name || !context_type || !file) {
//     return res.status(400).json({
//       success: false,
//       message: "context_name, context_type, and context_file are required",
//     });
//   }

//   const allowedExtensions = [".pdf", ".docx", ".txt"];
//   const extension = path.extname(file.originalname).toLowerCase();
//   if (!allowedExtensions.includes(extension)) {
//     return res.status(400).json({
//       success: false,
//       message: "Only PDF, DOCX, and TXT files are allowed",
//     });
//   }

//   const context_id = GenerateUniqueId();
//   const s3Folder = `context/${context_id}__${context_type}__${context_name}`;
//   const s3Key = `${s3Folder}/${file.originalname.trim()}`;

//   const uploadParams = {
//     Bucket: process.env.BUCKET_NAME,
//     Key: s3Key,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//   };

//   // Step 1: Upload to S3
//   await s3Client.send(new PutObjectCommand(uploadParams));

//   // Step 2: Store metadata in DB
//   await Context.create({
//     context_id,
//     context_name,
//     context_type,
//     s3_key: s3Key,
//   });

//   return res.status(201).json({
//     success: true,
//     message: "File uploaded to S3 and metadata saved in DB successfully",
//     data: {
//       context_id,
//       context_name,
//       context_type,
//       s3_key: s3Key,
//     },
//   });
// });

// ✅ Upload Context Document
// POST /api/v1/context
export const uploadContextDocument = asyncHandler(async (req, res) => {
  const { context_name, context_type } = req.body;
  const file = req.file;

  // Validate inputs
  if (!context_name || !context_type || !file) {
    return res.status(400).json({
      success: false,
      message: "context_name, context_type, and context_file are required",
    });
  }

  // Validate extension
  const allowedExtensions = [".pdf", ".docx", ".txt"];
  const extension = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    return res.status(400).json({
      success: false,
      message: "Only PDF, DOCX, and TXT files are allowed",
    });
  }

  // Generate unique context ID
  const context_id = GenerateUniqueId();

  // S3 key structure
  const s3Folder = `context/${context_id}__${context_type}__${context_name}`;
  const s3Key = `${s3Folder}/${file.originalname.trim()}`;

  // Step 1: Upload file to S3
  const uploadParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: s3Key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  await s3Client.send(new PutObjectCommand(uploadParams));

  // Step 2: Store metadata in DB
  await Context.create({
    context_id,
    context_name,
    context_type,
    s3_key: s3Key,
  });

  // Success response
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
});

// ✅ Delete Context Document and Embeddings
// DELETE /api/v1/context/:context_id
// export const deleteContextDocument = asyncHandler(async (req, res) => {
//   const { context_id } = req.query;

//   if (!context_id) {
//     return res.status(400).json({
//       success: false,
//       message: "context_id is required",
//     });
//   }

//   // Step 1: Delete from S3
//   const s3Prefix = `context/${context_id}`;

//   const listParams = {
//     Bucket: process.env.BUCKET_NAME,
//     Prefix: s3Prefix,
//   };

//   const listedObjects = await s3Client.send(
//     new ListObjectsV2Command(listParams)
//   );

//   if (listedObjects.Contents && listedObjects.Contents.length > 0) {
//     const deleteParams = {
//       Bucket: process.env.BUCKET_NAME,
//       Delete: {
//         Objects: listedObjects.Contents.map((obj) => ({ Key: obj.Key })),
//         Quiet: true,
//       },
//     };
//     await s3Client.send(new DeleteObjectsCommand(deleteParams));
//   }

//   // Step 2: Delete vectors from Weaviate using wildcard match
//   const docIdPrefix = `${context_id}__`;

//   await weaviateClient.batch
//     .objectsBatchDeleter()
//     .withClassName("DocumentChunk")
//     .withWhere({
//       path: ["doc_id"],
//       operator: "Like",
//       valueString: `${docIdPrefix}*`,
//     })
//     .do();

//   // Step 3: Delete metadata from DB
//   await Context.destroy({ where: { context_id } });

//   return res.status(200).json({
//     success: true,
//     message: `Deleted context '${context_id}' from S3, Weaviate, and DB`,
//   });
// });

// // DELETE ALL THE EMBEDDINGS
// export const deleteAllContextEmbeddings = asyncHandler(async (req, res) => {
//   try {
//     const deleteResult = await weaviateClient.batch
//       .objectsBatchDeleter()
//       .withClassName("DocumentChunk")
//       .withWhere({
//         path: ["doc_id"],
//         operator: "Like",
//         valueString: "*",
//       })
//       .do();

//     return res.status(200).json({
//       success: true,
//       message: "All DocumentChunk embeddings deleted from Weaviate.",
//       result: deleteResult,
//     });
//   } catch (error) {
//     console.error("Error deleting all context embeddings:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete all DocumentChunk embeddings.",
//       error: error.message,
//     });
//   }
// });

// ✅ Delete Context Document and Embeddings
// DELETE /api/v1/context/:context_id
export const deleteContextDocument = asyncHandler(async (req, res) => {
  const { context_id } = req.query;

  if (!context_id) {
    return res.status(400).json({
      success: false,
      message: "context_id is required",
    });
  }

  // Step 1: Delete all objects from S3 folder
  const s3Prefix = `context/${context_id}`;

  const listParams = {
    Bucket: process.env.BUCKET_NAME,
    Prefix: s3Prefix,
  };

  const listedObjects = await s3Client.send(
    new ListObjectsV2Command(listParams)
  );

  if (listedObjects.Contents && listedObjects.Contents.length > 0) {
    const deleteParams = {
      Bucket: process.env.BUCKET_NAME,
      Delete: {
        Objects: listedObjects.Contents.map((obj) => ({ Key: obj.Key })),
        Quiet: true,
      },
    };
    await s3Client.send(new DeleteObjectsCommand(deleteParams));
  }

  // Step 2: Delete vectors from Weaviate by context_id
  await weaviateClient.batch
    .objectsBatchDeleter()
    .withClassName("DocumentChunk")
    .withWhere({
      path: ["context_id"],
      operator: "Equal",
      valueString: context_id,
    })
    .do();

  // Step 3: Delete metadata from DB
  await Context.destroy({ where: { context_id } });

  return res.status(200).json({
    success: true,
    message: `Deleted context '${context_id}' from S3, Weaviate, and DB.`,
  });
});

// ✅ Delete ALL DocumentChunk Embeddings (using doc_id LIKE '*')
// DELETE /api/v1/context/embeddings/all
export const deleteAllContextEmbeddings = asyncHandler(async (req, res) => {
  try {
    const deleteResult = await weaviateClient.batch
      .objectsBatchDeleter()
      .withClassName("DocumentChunk")
      .withWhere({
        path: ["doc_id"],
        operator: "Like",
        valueString: "*", // matches all doc_id values
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
