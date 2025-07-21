export function buildContextualPrompt(contextChunks, question) {
  const contextText = contextChunks
    .map((c, i) => `Chunk ${i + 1}:\n${c.text}`)
    .join("\n\n");

  return `You are a precise and concise AI assistant. Answer based strictly on the context provided.

Context:
${contextText}

Question: ${question}

Instructions:
- Only use the information from the context above.
- If the answer is not in the context, respond exactly with: "I don't know based on the provided context."
- Do NOT repeat or explain why.
- Do NOT use external knowledge.

Answer:`;
}
