#!/usr/bin/env bun
import { spawnSync } from "node:child_process";

type Command = [string, string[]];

function runStep(title: string, command: Command): number {
  console.log(`[fix] ${title}`);
  const [cmd, args] = command;
  const res = spawnSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32" });
  if (res.status !== 0) {
    console.error(`[fix] ❌ 失敗: ${title}`);
    return res.status ?? 1;
  }
  console.log(`[fix] ✅ 成功: ${title}`);
  return 0;
}

function main() {
  const steps: Array<[string, Command]> = [
    ["Biome 自動修正", ["bun", ["x", "@biomejs/biome", "check", "--write", "."]]],
    [
      "Markdownlint 自動修正",
      ["bun", ["x", "markdownlint", ".", "--ignore", "node_modules", "--fix"]],
    ],
    ["Type Check", ["bun", ["run", "typecheck"]]],
    ["Unit Test", ["bun", ["run", "test"]]],
  ];

  let failed = false;
  for (const [title, command] of steps) {
    const code = runStep(title, command);
    if (code !== 0) {
      failed = true;
      break;
    }
  }

  if (failed) process.exit(1);
  console.log("[fix] 🎉 すべてのチェックと自動修正が完了しました");
}

main();
