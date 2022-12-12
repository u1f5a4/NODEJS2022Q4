import * as path from "node:path";
import * as fs from "node:fs/promises";

import { state } from "./state.js";

export function normalizePath(inputPath) {
  let newPath = path.normalize(inputPath);
  if (!path.isAbsolute(newPath)) return path.join(state.currentDir, newPath);
  else return newPath;
}

export async function isExists(inputPath) {
  try {
    const result = await fs.stat(
      inputPath,
      fs.constants.R_OK | fs.constants.W_OK
    );

    if (result.isDirectory()) return "dir";
    if (result.isFile()) return "file";
  } catch {
    return false;
  }
}
