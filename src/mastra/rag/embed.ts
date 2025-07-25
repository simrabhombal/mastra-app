import { OpenAIEmbeddings } from "@langchain/embeddings/openai";
import { FaissStore } from "@langchain/vectorstores/faiss";
import * as dotenv from "dotenv";

dotenv.config();
export async function embedAndStore(docs: any[]) {
  try {
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const vectorStore = await FaissStore.fromDocuments(docs, embeddings);
    await vectorStore.save("./faiss_index");

    console.log("✅ Embeddings created and stored in ./faiss_index");
  } catch (err) {
    console.error("❌ Error creating embeddings:", err);
  }
}
