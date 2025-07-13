export function buildContextualPrompt(contextChunks, question) {
  const contextText = contextChunks
    .map((c, i) => `Chunk ${i + 1}:\n${c.text}`)
    .join("\n\n");

  return `You are a helpful AI assistant.

Answer the following question **only** using the information provided in the context below. Do not use any external knowledge. If the answer is not present in the context, respond with "I don't know based on the provided context."

Context:
${contextText}

Question:
${question}

Answer:`;
}
