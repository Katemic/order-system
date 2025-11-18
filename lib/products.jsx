import mockData from "@/mockData.json";
import fs from "fs";
import path from "path";

export async function getAllProducts() {
  return Array.isArray(mockData) ? mockData : [];
}

export async function getProductById(id) {
  const filePath = path.join(process.cwd(), "mockdata.json");
  const fileContent = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileContent);

  return data.find((p) => p.id === id) || null;
}