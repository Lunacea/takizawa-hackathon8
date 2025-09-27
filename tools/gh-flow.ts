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

function ask(q: string, def = ""): string {
  process.stdout.write(`${q}${def ? ` [${def}]` : ""}: `);
  const buf = Buffer.alloc(1024);
  const bytes = fs.readSync(0, buf, 0, 1024, null);
  const s = buf.toString("utf8", 0, bytes ?? 0).trim();
  return s || def;
}

function run(cmd: string, args: string[]) {
  return spawnSync(cmd, args, { stdio: "inherit", shell: false });
}

function main() {
  const flags = parseFlags(process.argv.slice(2)) as Partial<{
    type: string;
    slug: string;
    issueTitle: string;
    issueBody: string;
    auto: string;
  }>;

  const type =
    flags.type ?? ask("タイプ (feat/fix/docs/chore/ci/build/refactor/perf/test)", "feat");
  const slug = flags.slug ?? ask("ブランスラグ (kebab-case)");
  const issue = (flags.auto ?? ask("Issue を先に作成しますか? (y/N)", "N")).toLowerCase() === "y";

  let issueNum = "";
  if (issue) {
    const title = flags.issueTitle ?? ask("Issue タイトル", `${type}: ${slug}`);
    const body = flags.issueBody ?? ask("Issue 本文", "");
    run("gh", ["issue", "create", "--title", title, ...(body ? ["--body", body] : [])]);
    const res = spawnSync(
      "gh",
      ["issue", "list", "--limit", "1", "--json", "number", "--jq", ".[0].number"],
      { encoding: "utf8", shell: process.platform === "win32" },
    );
    issueNum = res.stdout.trim();
  }

  const branchArgs = ["tools/branch.ts", type, slug, issueNum].filter(Boolean) as string[];
  const created = spawnSync("bun", branchArgs, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if ((created.status ?? 1) !== 0) process.exit(created.status ?? 1);

  console.log("作業をコミット後、PR を作成します");
  const pr = ask("今すぐ PR を作成しますか? (y/N)", "N").toLowerCase() === "y";
  if (pr) {
    const summary = ask("PR タイトル要約", slug.replace(/-/g, " "));
    const title = `${type}: ${summary}`;
    const body = issueNum ? `Closes #${issueNum}` : ask("PR 本文", "");
    run("gh", ["pr", "create", "--base", "main", "--title", title, "--body", body]);
  }
}

main();
