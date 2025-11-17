import mockData from "@/mockData.json";

export async function getAllProducts() {
  return Array.isArray(mockData) ? mockData : [];
}