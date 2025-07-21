import express from "express";
import contextUpload from "../middlewares/upload_context.middleware.js";
import {
  uploadContextDocument,
  getAllContexts,
  deleteContextDocument,
  deleteAllContextEmbeddings,
} from "../controllers/context.controller.js";

const router = express.Router();

router.post("/", contextUpload.single("context_file"), uploadContextDocument);

router.get("/", getAllContexts);

router.delete("/", deleteContextDocument);

router.delete("/all", deleteAllContextEmbeddings);

export default router;
