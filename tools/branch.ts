#!/usr/bin/env bun
// bun tools/branch.ts <type> <slug> [ticket]
import { spawnSync } from "node:child_process";

function main(): void {
  const [, , typeArg, slugArg, ticketArg] = process.argv;
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
    console.error(`[branch] type は ${Array.from(allowed).join(",")} から指定`);
    process.exit(1);
  }

  if (!slugArg) {
    console.error("[branch] slug を指定 (kebab-case)");
    process.exit(1);
  }

  const sanitize = (s: string) => s.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  const slug = sanitize(slugArg).replace(/^-+|-+$/g, "");
  const branch = ticketArg ? `${typeArg}/${ticketArg}--${slug}` : `${typeArg}/${slug}`;

  const res = spawnSync("git", ["checkout", "-b", branch], { stdio: "inherit" });
  process.exit(res.status ?? 0);
}

main();
