import "../config/config.js";
import { bedrockClient } from "../utils/AWS/clients.js";
import { queryRelevantChunks } from "../utils/GenAI/vectorSearch.js";
import { buildContextualPrompt } from "../utils/GenAI/prompts.js";

import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

export const askAgent = async (req, res) => {
  try {
    const { query, context_id } = req.body;

    if (!query || !context_id) {
      return res.status(400).json({
        success: false,
        message: "Both 'query' and 'context_id' are required",
      });
    }

    // Step 1: Embed query
    const embeddingCommand = new InvokeModelCommand({
      modelId: process.env.EMBEDDING_MODEL_ID,
      contentType: "application/json",
      body: JSON.stringify({ inputText: query }),
    });

    const embedRes = await bedrockClient.send(embeddingCommand);
    const { embedding } = JSON.parse(Buffer.from(embedRes.body).toString());

    // Step 2: Vector Search in Weaviate
    const contextChunks = await queryRelevantChunks(embedding, context_id, 5);
    if (!contextChunks.length) {
      return res.status(404).json({
        success: false,
        message: "No relevant chunks found for the provided context_id",
      });
    }

    // Step 3: Build Prompt
    const finalPrompt = buildContextualPrompt(contextChunks, query);
    console.log("🧠 Final Prompt:\n", finalPrompt);

    // Step 4: Generate with LLaMA model
    const generateCommand = new InvokeModelCommand({
      modelId: process.env.LLM_MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        prompt: finalPrompt,
        // max_gen_len: 512,
        temperature: 0.7,
        top_p: 0.9,
      }),
    });

    const genRes = await bedrockClient.send(generateCommand);
    const rawGenOutput = JSON.parse(Buffer.from(genRes.body).toString());
    console.log("📝 LLM Output:\n", rawGenOutput);

    const outputText = rawGenOutput?.generation;
    if (!outputText) {
      return res.status(500).json({
        success: false,
        message: "Model response did not include 'generation'",
        rawResponse: rawGenOutput,
      });
    }

    return res.status(200).json({
      success: true,
      response: outputText.trim(),
    });
  } catch (error) {
    console.error("❌ Agent error:", error);
    return res.status(500).json({
      success: false,
      message: "Agent failed to generate a response",
    });
  }
};
