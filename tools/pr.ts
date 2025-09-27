#!/usr/bin/env bun
import { spawnSync } from "node:child_process";
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

function promptSync(q: string): string {
  process.stdout.write(q);
  const buf = Buffer.alloc(1024);
  const bytes = fs.readSync(0, buf, 0, 1024, null);
  return buf.toString("utf8", 0, bytes ?? 0).trim();
}

function prompt(question: string, defaultValue = ""): string {
  const res = promptSync(`${question}${defaultValue ? ` [${defaultValue}]` : ""}: `);
  return res.trim() || defaultValue;
}

async function main() {
  const flags = parseFlags(process.argv.slice(2)) as Partial<{
    type: string;
    summary: string;
    issue: string;
    body: string;
    draft: string;
  }>;

  const defaultTitleType = "feat";
  const type =
    flags.type ??
    prompt("タイプ (feat/fix/docs/chore/ci/build/refactor/perf/test)", defaultTitleType);
  let summary = flags.summary ?? prompt("タイトル要約", "");
  const issue = flags.issue ?? prompt("関連Issue番号 (#なし)", "");
  const bodyInput = flags.body ?? (issue ? `Closes #${issue}` : prompt("本文 (省略可)", ""));

  const currentBranch = spawnSync("git", ["branch", "--show-current"], {
    encoding: "utf8",
  }).stdout.trim();
  if (!summary) {
    const slug =
      currentBranch
        .split("/")
        .slice(1)
        .join("/")
        .replace(/^[^a-z0-9-]*|[^a-z0-9-]*$/gi, "")
        .split("--")
        .pop() || currentBranch;
    summary = slug.replace(/-/g, " ");
  }

  const title = `${type}: ${summary}`;
  const args = ["pr", "create", "--base", "main", "--head", currentBranch, "--title", title];
  if (typeof bodyInput === "string" && bodyInput.length > 0) {
    const bodyPath = ".git/PR_BODY.txt";
    await Bun.write(bodyPath, bodyInput.replace(/_/g, " "));
    args.push("--body-file", bodyPath);
  }
  if (flags.draft === "true") args.push("--draft");

  const res = spawnSync("gh", args, { stdio: "inherit", shell: false });
  process.exit(res.status ?? 0);
}

main();
