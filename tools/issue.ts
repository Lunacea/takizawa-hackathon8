#!/usr/bin/env bun
import { spawnSync } from "node:child_process";

function prompt(question: string, defaultValue = ""): string {
  const res = promptSync(`${question}${defaultValue ? ` [${defaultValue}]` : ""}: `);
  return res.trim() || defaultValue;
}

function promptSync(q: string): string {
  process.stdout.write(q);
  const buf = Buffer.alloc(1024);
  const bytes = fs.readSync(0, buf, 0, 1024, null);
  return buf.toString("utf8", 0, bytes ?? 0).trim();
}

import fs from "node:fs";

function parseFlags(argv: string[]): Record<string, string | boolean> {
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const eq = a.indexOf("=");
    if (eq > -1) {
      flags[a.slice(2, eq)] = a.slice(eq + 1);
    } else if (i + 1 < argv.length && !argv[i + 1].startsWith("--")) {
      flags[a.slice(2)] = argv[i + 1];
      i++;
    } else {
      flags[a.slice(2)] = true;
    }
  }
  return flags;
}

function main() {
  const fromFlags = parseFlags(process.argv.slice(2)) as Partial<{
    type: string;
    title: string;
    body: string;
    label: string;
  }>;

  const type =
    fromFlags.type ?? prompt("タイプ (feat/fix/docs/chore/ci/build/refactor/perf/test)", "feat");
  const title = fromFlags.title ?? prompt("タイトル (短く) ");
  const body = fromFlags.body ?? prompt("本文 (省略可)", "");
  const label = type === "feat" ? "enhancement" : type === "fix" ? "bug" : undefined;

  const args = ["issue", "create", "--title", `${type}: ${title}`];
  if (body) args.push("--body", body);
  if (label) args.push("--label", label);

  const res = spawnSync("gh", args, { stdio: "inherit", shell: false });
  process.exit(res.status ?? 0);
}

main();
