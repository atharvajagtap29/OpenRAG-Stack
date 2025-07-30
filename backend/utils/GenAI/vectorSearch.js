import { weaviateClient } from "./weaviateClient.js";

export async function queryRelevantChunks(
  vector,
  context_id,
  topK,
  vectorCertainity
) {
  try {
    const res = await weaviateClient.graphql
      .get()
      .withClassName("DocumentChunk")
      .withNearVector({ vector, certainty: vectorCertainity })
      .withWhere({
        path: ["context_id"],
        operator: "Equal",
        valueText: context_id,
      })
      .withLimit(topK)
      .withFields("text context_id metadata")
      .do();

    return res?.data?.Get?.DocumentChunk || [];
  } catch (err) {
    console.error("❌ Vector search error:", err.message);
    return [];
  }
}
