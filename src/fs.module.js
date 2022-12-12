import * as fs from "node:fs";
import * as path from "node:path";
import { writeFile, rename, rm as remove } from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";

import { state } from "./state.js";
import { handleError } from "./index.js";
import { normalizePath, isExists } from "./support.js";

export async function cat(args) {
  if (args.length !== 1) throw new Error("Invalid input");

  const path_to_file = args[0];
  fs.createReadStream(normalizePath(path_to_file))
    .on("data", (chunk) => {
      console.log(chunk.toString());
    })
    .on("error", () => {
      handleError("stream error");
    });
}

export async function add(args) {
  if (args.length !== 1) throw new Error("Invalid input");

  const new_file_name = args[0];
  const fullPath = path.join(state.currentDir, new_file_name);
  const isExistsFile = await isExists(fullPath);
  if (isExistsFile) throw new Error("file exists");
  return writeFile(fullPath, "");
}

export async function rn(args) {
  if (args.length !== 2) throw new Error("Invalid input");

  const [path_to_file, new_filename] = [args[0], args[1]];
  const oldPath = normalizePath(path_to_file);
  const newPath = normalizePath(new_filename);

  if ((await isExists(oldPath)) && !(await isExists(newPath)))
    return rename(oldPath, newPath);
  else throw new Error("operation failed");
}

export async function cp(args) {
  if (args.length !== 2) throw new Error("Invalid input");

  const [path_to_file, path_to_new_directory] = [
    normalizePath(args[0]),
    normalizePath(args[1]),
  ];

  const file = await isExists(path_to_file);
  const dir = await isExists(path_to_new_directory);
  const distFile = path.join(
    path_to_new_directory,
    path.parse(path_to_file).base
  );
  if (file !== "file" || dir !== "dir") throw new Error("Invalid input");

  createReadStream(path_to_file)
    .pipe(createWriteStream(distFile))
    .on("error", () => handleError("stream error"));
}

export async function mv(args) {
  if (args.length !== 2) throw new Error("Invalid input");

  const path_to_file = normalizePath(args[0]);
  await cp(args);
  await rm([path_to_file]);
}

export async function rm(args) {
  if (args.length !== 1) throw new Error("Invalid input");

  const path_to_file = normalizePath(args[0]);
  return remove(path_to_file);
}
