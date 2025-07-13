// middlewares/upload_context.middleware.js

// This middleware will handle file uploads for context management.
// It uses memory storage to temporarily hold the file in memory before further processing,
import multer from "multer";

// Store uploaded file into memory before processing to store in S3
const contextStorage = multer.memoryStorage();
const contextUpload = multer({ storage: contextStorage });

export default contextUpload;
