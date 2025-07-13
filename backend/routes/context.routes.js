import express from "express";
import contextUpload from "../middlewares/upload_context.middleware.js";
import {
  uploadContextDocument,
  deleteContextDocument,
  deleteAllContextEmbeddings,
} from "../controllers/context.controller.js";

const router = express.Router();

router.post("/", contextUpload.single("context_file"), uploadContextDocument);

router.delete("/", deleteContextDocument);

router.delete("/all", deleteAllContextEmbeddings);

export default router;
