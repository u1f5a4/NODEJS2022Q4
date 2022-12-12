import * as readline from "node:readline/promises";
import * as operationSystem from "node:os";

import { state } from "./state.js";
import { up, ls, cd } from "./nwd.module.js";
import { cat, add, rn, cp, mv, rm } from "./fs.module.js";
import { os } from "./os.module.js";
import { hash } from "./hash.module.js";
import { compress, decompress } from "./brotli.module.js";

start();
async function start() {
  await getUsername();
  console.log(`Welcome to the File Manager, ${state.username}!`);

  readlineStart();

  process.on("exit", () => {
    console.log(
      `Thank you for using File Manager, ${state.username}, goodbye!`
    );
  });
}

function readlineStart() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  state.changeCurrentDir(operationSystem.homedir());
  console.log("You are currently in " + state.currentDir);

  rl.on("line", async (input) => {
    try {
      const commands = {
        ".exit": process.exit,
        up: (args) => (args ? up(args) : up()),
        ls: (args) => (args ? ls(args) : ls()),
        cd: (args) => (args ? cd(args) : cd()),

        cat: (args) => (args ? cat(args) : cat()),
        add: (args) => (args ? add(args) : add()),
        rn: (args) => (args ? rn(args) : rn()),
        cp: (args) => (args ? cp(args) : cp()),
        mv: (args) => (args ? mv(args) : mv()),
        rm: (args) => (args ? rm(args) : rm()),

        os: (args) => (args ? os(args) : os()),

        hash: (args) => (args ? hash(args) : hash()),

        compress: (args) => (args ? compress(args) : compress()),
        decompress: (args) => (args ? decompress(args) : decompress()),
      };

      const userInput = input.trim().split(" ");
      const [command, args] = [userInput[0], userInput.slice(1)];

      if (command in commands) await commands[command](args);
      else throw new Error("Invalid input");
    } catch (error) {
      handleError(error);
    } finally {
      console.log("You are currently in " + state.currentDir);
    }
  });

  rl.on("close", process.exit);
}

export function handleError(error) {
  // console.log("error:", error);
  if (error.message === "Invalid input")
    console.log(`[ERROR] ${error.message}`);
  else console.log(`[ERROR] Operation failed`);
}

async function getUsername() {
  const args = process.argv.slice(2);
  args.forEach((element) => {
    if (element.startsWith("--username="))
      state.username = element.split("=")[1];
  });
}
