import * as operationSystem from "node:os";

export function os(args) {
  if (args.length !== 1) throw new Error("Invalid input");
  const flag = args[0];

  const commands = {
    "--EOL": () => operationSystem.EOL,
    "--cpus": () =>
      operationSystem
        .cpus()
        .map(
          (cpu, i, array) =>
            (i === 0 ? `The pc has ${array.length} cores.\n` : "") +
            `${i + 1}. ${cpu.model} ${cpu.speed / 1000}GHz`
        )
        .join("\n"),
    "--homedir": () => operationSystem.homedir(),
    "--username": () => operationSystem.userInfo().username,
    "--architecture": () => operationSystem.arch(),
  };

  if (flag in commands) console.log(commands[flag]());
  else throw new Error("Invalid input");
}
