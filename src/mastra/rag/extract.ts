import fs from "fs";
import path from "path";
const pdf = require("pdf-parse");

export async function extractTextFromPDFs(folderPath: string): Promise<string[]> {
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".pdf"));
  const texts: string[] = [];

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);
    texts.push(pdfData.text);
  }

  return texts;
}
