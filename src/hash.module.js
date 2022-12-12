import * as crypto from "crypto";
import * as fs from "node:fs";
import { handleError } from "./index.js";

import { normalizePath } from "./support.js";

export function hash(args) {
  if (args.length !== 1) throw new Error("Invalid input");

  const filePath = normalizePath(args[0]);
  const hash = crypto.createHash("sha256");
  const readStream = fs
    .createReadStream(filePath)
    .on("data", () => {
      const data = readStream.read();
      if (data) hash.update(data);
      else console.log(`${args[0]} has a sha256 hash: ${hash.digest("hex")} `);
    })
    .on("error", () => {
      handleError("stream error");
    });
}
