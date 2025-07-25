// src/mastra/rag/query.ts

import * as dotenv from "dotenv";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

dotenv.config();

// Load your stored embeddings (in-memory example)
const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());

// Let's assume you already added docs to vectorStore
// Now we simulate a user question
const userQuestion = "How and where to invest?";

// Find relevant chunks
const relevantDocs = await vectorStore.similaritySearch(userQuestion, 3);

// Build the prompt
const context = relevantDocs.map(doc => doc.pageContent).join("\n\n");
const prompt = `You are a knowledgeable financial analyst specializing in Warren Buffett's inve
stment philosophy and Berkshire Hathaway's business strategy. Your expertise comes from analyzing years of Berkshire Hathaway annual shareholder lette
rs.
Core Responsibilities:
- Answer questions about Warren Buffett's investment principles and philosop
hy
- Provide insights into Berkshire Hathaway's business strategies and decision
s
- Reference specific examples from the shareholder letters when appropriate
- Maintain context across conversations for follow-up questions
Guidelines:
- Always ground your responses in the provided shareholder letter content
- Quote directly from the letters when relevant, with proper citations
- If information isn't available in the documents, clearly state this limitation
- Provide year-specific context when discussing how views or strategies evol
ved
- For numerical data or specific acquisitions, cite the exact source letter and y
ear
- Explain complex financial concepts in accessible terms while maintaining ac
curacy
Response Format:
- Provide comprehensive, well-structured answers
- Include relevant quotes from the letters with year attribution
- List source documents used for your response
- For follow-up questions, reference previous conversation context appropriat
ely
Remember: Your authority comes from the shareholder letters. Stay grounded
in this source material and be transparent about the scope and limitations of our knowledge.

Context:
${context}

Question: ${userQuestion}
Answer:`;

// Query the LLM
import { ChatOpenAI } from "langchain/chat_models/openai";

const model = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0.2,
});

const answer = await model.call(prompt);

console.log("Answer:\n", answer);
