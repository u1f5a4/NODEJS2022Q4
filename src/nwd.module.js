import * as os from "node:os";
import * as path from "node:path";
import * as fs from "node:fs/promises";

import { state } from "./state.js";
import { normalizePath, isExists } from "./support.js";

export async function up(args) {
  if (args.length !== 0) throw new Error("Invalid input");

  await cd([".."]);
}

export async function cd(args) {
  if (args.length !== 1) throw new Error("Invalid input");

  const newPath = normalizePath(args[0]);
  const isMatchRoot =
    path.parse(newPath).root === path.parse(os.homedir()).root;
  const isExistsPath = await isExists(newPath);

  if (isExistsPath && isMatchRoot) {
    await state.changeCurrentDir(newPath);
  } else throw new Error("Operation failed");
}

export async function ls(args) {
  if (args.length !== 0) throw new Error("Invalid input");
  const dirContent = await fs.readdir(state.currentDir);

  const getType = async (name) => {
    const fullPath = path.join(state.currentDir, name);
    const type = await isExists(fullPath);
    return type === "file" ? "file" : "directory";
  };

  const lsWithType = await Promise.all(
    dirContent.map(async (name) => ({
      name,
      type: await getType(name),
    }))
  );

  const directoryItems = lsWithType
    .filter((elem) => elem.type === "directory")
    .sort((a, b) => a.name - b.name);
  const fileItems = lsWithType
    .filter((elem) => elem.type === "file")
    .sort((a, b) => a.name - b.name);

  console.table([...directoryItems, ...fileItems]);
}
