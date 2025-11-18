import fs from "fs";
import path from "path";

export function resetMockData() {
  const testFile = path.join(process.cwd(), "mockdata.test.json");
  fs.writeFileSync(testFile, "[]", "utf8");
}