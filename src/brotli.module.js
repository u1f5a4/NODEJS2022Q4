import * as fs from "node:fs";
import * as path from "node:path";
import * as zlib from "zlib";

import { normalizePath } from "./support.js";
import { handleError } from "./index.js";

export async function compress(args) {
  if (args.length !== 2) throw new Error("Invalid input");

  const [path_to_file, path_to_destination] = [
    normalizePath(args[0]),
    normalizePath(args[1]),
  ];

  const destFile = path.join(
    path_to_destination,
    path.basename(path_to_file) + ".br"
  );

  const brotli = zlib.createBrotliCompress();
  const read = fs
    .createReadStream(path_to_file)
    .on("error", () => handleError("stream error"));
  const write = fs
    .createWriteStream(destFile)
    .on("error", () => handleError("stream error"));

  read.pipe(brotli).pipe(write);
}

export async function decompress(args) {
  if (args.length !== 2) throw new Error("Invalid input");

  const [path_to_file, path_to_destination] = [
    normalizePath(args[0]),
    normalizePath(args[1]),
  ];

  const destFile = path.join(
    path_to_destination,
    path.basename(path_to_file).slice(0, -3)
  );

  const brotli = zlib.createBrotliDecompress();
  const read = fs
    .createReadStream(path_to_file)
    .on("error", () => handleError("stream error"));
  const write = fs
    .createWriteStream(destFile)
    .on("error", () => handleError("stream error"));

  read.pipe(brotli).pipe(write);
}
