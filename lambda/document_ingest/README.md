# 🧾 Document Ingestion Lambda

This AWS Lambda function is triggered when a document is uploaded to the S3 `context/` folder. It extracts text, chunks it, generates embeddings using Amazon Bedrock (Titan), and stores them in Weaviate with relevant metadata.

---

## 🧠 Functionality

1. ✅ **Extracts text** from PDF, DOCX, or TXT using `PyPDF2`, `docx`, or plain read.
2. ✂️ **Chunks** long text with overlap for better semantic preservation.
3. 🔍 **Generates vector embeddings** using Amazon Titan (via Bedrock).
4. 🧠 **Stores embeddings** in Weaviate with metadata fields: `context_id`, `context_type`, `context_name`.

---

## 🪣 Trigger

This function is invoked via **S3 PUT** event on:

---

## ⚙️ Environment Variables

```env
WEAVIATE_URL=https://your-weaviate-endpoint
BEDROCK_REGION=<bedrock-infra-region>
EMBEDDING_MODEL=<your-preferrable-model>
```
