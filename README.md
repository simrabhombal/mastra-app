# 📈 Berkshire Hathaway RAG Application — Powered by Mastra 🚀

This project is a **Retrieval-Augmented Generation (RAG)** application built using the **Mastra framework** to analyze and answer questions based on **Berkshire Hathaway Shareholder Letters**. It leverages **RAG Pipeline** for document ingestion, embedding, and intelligent response generation.

---

## 🧩 Project Structure

dataset/ #has all the pdf files for context info of the llm

src/
└── mastra/
    └── rag/
        ├── extract.ts       # Parses PDF documents and extracts text content
        ├── chunk.ts         # Splits extracted content into overlapping chunks
        ├── embed.ts         # Generates vector embeddings and stores them in pgvector
        └── query.ts         # Performs similarity search and retrieves relevant chunks
    └── index.ts             # Performs similarity search and retrieves relevant chunks

### 🔁 Step-by-Step Pipeline

1. **📥 Document Ingestion**
   - PDF files of Berkshire Hathaway shareholder letters are downloaded and parsed.
   - Implemented in: `extract.ts`
   - Tool used: pdf-parser

2. **✂️ Chunking**
   - Extracted text is split into manageable chunks with controlled overlap to preserve context.
   - Financial-specific chunking strategy is applied for better retrieval.
   - Implemented in: `chunk.ts`
   - Chunk size and overlap can be tuned using Mastra config.

3. **🔢 Embedding Generation**
   - Chunks are embedded into dense vector representations using **OpenAI Embedding API** (e.g., `text-embedding-3-small`).
   - Each chunk is associated with metadata like source document, year, and page.
   - Implemented in: `embed.ts`
   - Stored in: FAISS for efficient similarity search.

4. **📦 Vector Storage**
   - Embeddings and metadata are stored using Mastra’s unified vector interface.
   - Automatically creates indexes for fast similarity lookup.

5. **🔍 Query & Retrieval**
   - User queries are embedded and matched with the closest document chunks using vector similarity.
   - Retrieved documents are passed to the LLM for grounding the final response, along with long prompt response given for better response.
   - Implemented in: `query.ts`

6. **🤖 RAG Agent Response (via GPT-4o)**
   - The system prompt guides the agent to behave like a financial analyst.
   - Agent uses retrieved context to generate well-cited, document-grounded answers.

