// /routes/agent.route.js
import express from "express";
import { askAgent } from "../controllers/agent.controller.js";

const router = express.Router();
router.post("/ask", askAgent);

export default router;
