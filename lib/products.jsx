import mockData from "@/mockData.json";
import fs from "fs";
import path from "path";

export async function getAllProducts() {
  const filePath = getMockFilePath();
  const content = fs.readFileSync(filePath, "utf8");
  return JSON.parse(content);
}

export async function getProductById(id) {
  //const filePath = path.join(process.cwd(), "mockdata.json");
  const filePath = getMockFilePath();
  const fileContent = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileContent);

  return data.find((p) => p.id === id) || null;
}


//test filepath
export function getMockFilePath() {
  //const isTest = process.env.NODE_ENV === "test";
  const isTest = process.env.TEST_ENV === "true";

  return path.join(
    process.cwd(),
    isTest ? "mockdata.test.json" : "mockdata.json"
  );
}