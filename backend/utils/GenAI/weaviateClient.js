import "../../config/config.js";
import weaviate from "weaviate-ts-client";

const rawUrl = process.env.WEAVIATE_URL;
if (!rawUrl) throw new Error("❌ WEAVIATE_URL missing");

const parsed = new URL(rawUrl);

export const weaviateClient = weaviate.client({
  scheme: parsed.protocol.replace(":", ""),
  host: `${parsed.hostname}:${parsed.port}`,
  skipInitChecks: true,
});
