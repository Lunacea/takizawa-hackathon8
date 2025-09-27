#!/usr/bin/env bun
// bun tools/quick-commit.ts <type> [scope] <message>
import { spawnSync } from "node:child_process";

function main(): void {
  const [, , typeArg, maybeScopeOrMsg, maybeMsg] = process.argv;
  const allowed = new Set([
    "feat",
    "fix",
    "docs",
    "style",
    "refactor",
    "perf",
    "test",
    "build",
    "ci",
    "chore",
    "revert",
  ]);

  if (!typeArg || !allowed.has(typeArg)) {
    console.error(
      "[commit] type を指定 (feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)",
    );
    process.exit(1);
  }

  let scope = "";
  let msg = "";
  if (maybeMsg) {
    scope = maybeScopeOrMsg ?? "";
    msg = maybeMsg ?? "";
  } else {
    msg = maybeScopeOrMsg ?? "";
  }

  if (!msg) {
    console.error("[commit] message を指定");
    process.exit(1);
  }

  const subject = scope ? `${typeArg}(${scope}): ${msg}` : `${typeArg}: ${msg}`;
  spawnSync("git", ["add", "-A"], { stdio: "inherit" });
  const res = spawnSync("git", ["commit", "-m", subject], { stdio: "inherit" });
  process.exit(res.status ?? 0);
}

main();
