import { OpenAIEmbeddings } from "@langchain/openai";
import { Tool } from "@mastra/core/tool";
import * as fs from "fs";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import path from "path";
import { z } from "zod";

const loadDocuments = async () => {
  const pdfDir = path.resolve(__dirname, "../dataset");
  const files = fs.readdirSync(pdfDir).filter(file => file.endsWith(".pdf"));

  const allDocs = [];

  for (const file of files) {
    const loader = new PDFLoader(path.join(pdfDir, file));
    const docs = await loader.load();
    allDocs.push(...docs);
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const splitDocs = await splitter.splitDocuments(allDocs);

  const embeddings = new OpenAIEmbeddings(); // uses OPENAI_API_KEY from .env
  const store = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);

  return store;
};

const storePromise = loadDocuments();

export const berkshireRAGTool = new Tool({
  name: "berkshireRAG",
  description: "Retrieves relevant info from Berkshire PDFs and answers user queries",
  inputSchema: z.object({
    query: z.string().describe("The question related to Berkshire Hathaway"),
  }),
  execute: async ({ query }) => {
    const store = await storePromise;
    const results = await store.similaritySearch(query, 4);
    return {
      result: results.map((r) => r.pageContent).join("\n\n"),
    };
  },
});
