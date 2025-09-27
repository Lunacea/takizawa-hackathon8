# Design

本プロジェクトの Architecture、Development workflow、CI/CD、Repository automation の設計方針を示します。

## Architecture (overview)

```mermaid
flowchart TB
  subgraph DevEnv["Dev environment"]
    DEV["Developer (VS Code)"] -- "Reopen in Container" --> DC["Dev Container (Bun/TS)"]
  end
  HOST["Host OS (Docker daemon)"]
  COMPOSE["docker compose (app + db)"]
  APP["App container (Bun server)"]
  DB[("PostgreSQL")]

  DC -- "edit / lint / type / test" --> DEV
  DC -- "uses Docker CLI" --> HOST
  HOST -- "compose up -d" --> COMPOSE
  COMPOSE --> APP
  COMPOSE --> DB
  APP -- "PORT 3000" --> DEV
  APP -- "DATABASE_URL" --> DB
```

- Dev Containers を前提に統一した開発環境（Bun/TypeScript/Tooling）。
- Docker daemon 操作は Host 側で実行し、docker compose で app/db を起動。
- App: `http://localhost:3000`（health check: `/healthz`）。
- DB 接続は `DATABASE_URL` を使用。

## Repository automation

```mermaid
flowchart TB
  subgraph Hooks
    PRE["pre-commit: Biome & Markdownlint"]
    MSG["commit-msg: commitlint"]
  end

  subgraph CI
    LINT["Biome"]
    MDL["Markdownlint"]
    TSC["Type Check (tsc)"]
    TEST["Unit Test (bun test)"]
    BUILD["Build"]
    TRIVY["Trivy"]
    CODEQL["CodeQL"]
    SECSCAN["Secret Scan (gitleaks)"]
    CMTL["Commitlint"]
  end

  subgraph CD
    GHCR["GHCR build & push"]
    SIGN["cosign sign (OIDC keyless)"]
    SBOM["SBOM (Syft/SPDX)"]
    TFA["Terraform apply"]
    PRISMA["Prisma migrate (optional)"]
    REL["semantic-release"]
  end

  Renovate["Renovate"]
  Dependabot["Dependabot"]

  Hooks --> CI
  CI --> CD
  GHCR --> SIGN --> SBOM
  Renovate --> CI
  Dependabot --> CI
```

- Commit convention: Conventional Commits（commitlint）
- Release: semantic-release（GitHub Release と `CHANGELOG.md` を自動更新）
- Dependency updates: Renovate / Dependabot が PR を作成し CI をトリガー
- Security: CodeQL（codeql.yml）、gitleaks（secret-scan.yml）

## Development workflow (sequence)

```mermaid
sequenceDiagram
  participant Dev as Developer
  participant GH as GitHub
  participant CI as "CI (PR)"
  participant CD as "CD (main)"

  Dev->>Dev: Issue (optional): bun run issue:new
  Dev->>Dev: Branch: bun run branch:new (type/<issue#>--<slug>)
  Dev->>Dev: or one-shot: bun run gh:flow
  Dev->>Dev: Work: bun run fix / typecheck / test
  Dev->>GH: PR: bun run pr:new (or gh pr create)
  GH->>CI: Run CI (Biome/Markdownlint/tsc/test/build/Trivy/Commitlint)
  CI-->>GH: Status
  Dev->>GH: Review & merge to main
  GH->>CD: Run CD (GHCR build&push / Terraform / Prisma optional / release)
  CD-->>GH: Release & CHANGELOG
```

## Container / Build design

```mermaid
flowchart LR
  subgraph Dockerfile
    deps["deps: bun install (cacheable)"]
    runner["runner: minimal runtime"]
  end
  cache["BuildKit cache"] -. reuse .-> deps
  deps --> runner
```

- Goals: small image, fast rebuilds, deterministic output
- Layers: `deps` (bun install) → `runner`（必要ファイルのみコピー）
- Caching: BuildKit cache と bun の cache mount を活用
- Lockfile: Bun 1.2+ は `bun.lock` を利用
- Local dev: docker compose は DB 用のみに使用（app は Bun サーバをローカル起動）
- CI build & push: `.github/workflows/cd.yml` で BuildKit + `docker/build-push-action@v6`
  - GHCR tag は Actions で `github.repository` を lowercase 化して付与（Docker 命名規則準拠）

## Infrastructure / IaC (GitHub settings)

```mermaid
flowchart TD
  subgraph IaC
    subgraph terraform-github["infra/github"]
      TF_GH["Terraform (GitHub provider)"] --|apply|--> GHS["GitHub repository settings"]
    end
    subgraph terraform-envs["infra/environments"]
      TF_STG["Terraform (stg)"] --|plan (PR comment)/apply|--> CLOUD_STG["Cloud (stg)"]
      TF_PRD["Terraform (prd)"] --|plan (PR comment)/apply|--> CLOUD_PRD["Cloud (prd)"]
    end
  end
```

- `infra/github` でブランチ保護/コラボレーター/Secrets/Variables 等を自動化。
- 実行には `GITHUB_TOKEN` (repo 管理権限) が必要。

## Directory overview

```text
web-template/
├── .devcontainer/          Dev Containers config
├── .github/
│   ├── workflows/          CI/CD workflows (ci.yml, cd.yml)
│   ├── dependabot.yml      Dependency updates
│   └── renovate.json
├── docker/
│   └── Dockerfile          Production image
├── infra/
│   ├── environments/       Cloud IaC per env (stg, prd)
│   │   ├── stg/main.tf
│   │   └── prd/main.tf
│   └── github/             Repo settings IaC (branch protection, secrets)
├── prisma/
│   └── schema.prisma       DB schema
├── tools/                  CLI tools for workflow
│   ├── branch.ts           Create branch (type/<issue#>--<slug>)
│   ├── issue.ts            Create issue (gh)
│   ├── pr.ts               Create PR (gh)
│   ├── gh-flow.ts          Issue→Branch→PR helper (gh)
│   ├── quick-commit.ts     Quick Conventional Commit
│   └── fix.ts              Lint/type/test auto-fix run
├── src/
│   ├── backend/server.ts   Bun server (port 3000, /healthz)
│   ├── frontend/app/page.tsx
│   └── lib/                Sample lib & tests
├── docker-compose.yml      Local DB (dev)
├── package.json            Scripts & deps
├── README.md               Overview & workflow
├── PREREQUISITE.md         Setup guide
└── DESIGN.md               Design & architecture
```

## Non-functional & operations

- Code style: Biome (formatter/linter)
- Commit convention: Conventional Commits (commitlint)
- Dependencies: Renovate / Dependabot
- Release: semantic-release (GitHub Release + CHANGELOG.md)

## Stack definition

### Core stack (fixed)

#### Runtime & language

- **Bun**: JavaScript/TypeScript runtime
- **TypeScript**: Static type system
- **Node.js**: Use with Bun if needed

#### Tooling

- **Dev Containers**: Unified dev environment
- **VS Code**: Recommended editor
- **Git**: Version control
- **GitHub**: Repo & CI/CD platform

#### Quality & conventions

- **Biome**: Formatter/Linter
- **Husky**: Git hooks
- **commitlint**: Conventional Commits
- **semantic-release**: Automated release/versioning

#### Infrastructure & CI/CD

- **Docker**: Containerization
- **Terraform**: IaC (including GitHub settings)
- **GitHub Actions**: CI/CD pipeline
- **Dependabot/Renovate**: Dependency updates

### Optional stack

#### Front-end framework

- **React** (default), **Vue**, **Svelte**, others

#### Database / ORM

- **PostgreSQL** (default)
- **Prisma** (default ORM)
- Others: MySQL, SQLite, MongoDB, etc.
- Alternative ORM: TypeORM, Drizzle, etc.

#### Styling

- **Tailwind CSS** (default), CSS Modules, Styled Components, Emotion, etc.

#### Test framework

- **bun test** (Vitest-compatible), Jest, Vitest

### TBD / Out of scope

#### Front-end (TBD)

- UI library, State management, Routing, SSR/SSG

#### Back-end (TBD)

- API framework, Auth, Validation

#### Infrastructure / Deploy (TBD)

- Cloud provider, Orchestration, CDN, Observability

#### Others (out of scope)

- Mobile app (React Native, Flutter), Desktop app (Electron, Tauri),
  AI/ML (TensorFlow, PyTorch), Blockchain (Web3, Ethereum)

### Selection policy

1. **Core**: 固定（プロジェクトの基盤）
2. **Optional**: チーム要件に応じて選択
3. **TBD**: プロジェクト開始時に決定
4. **Out of scope**: テンプレート対象外

この設計により、基盤は統一しつつ、フロントエンド・バックエンドの技術選択に柔軟性を持たせています。

### Notes (dev environment)

- Dev Containers を前提とし、`docker compose` などのデーモン操作はホストで実行します。
- Production image build は GitHub Actions 上で行い、ローカルは DB 起動用途に限定します。
