# 依存関係のインストール
FROM oven/bun:1.1.20 AS deps
WORKDIR /app

# ルートの依存関係をインストール
COPY package.json bun.lock ./
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

# フロントエンドの依存関係をインストール
WORKDIR /app/src/frontend
COPY src/frontend/package.json src/frontend/bun.lock ./
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

# フロントエンドビルド
FROM oven/bun:1.1.20 AS frontend-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/bun.lock ./bun.lock
COPY package.json ./

# フロントエンドの依存関係とソースをコピー
COPY --from=deps /app/src/frontend/node_modules ./src/frontend/node_modules
COPY src/frontend/ ./
WORKDIR /app/src/frontend
RUN bun run build

# 本番用イメージ
FROM oven/bun:1.1.20 AS runner
WORKDIR /app
ENV NODE_ENV=production

# ルートの依存関係をコピー
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/bun.lock ./bun.lock
COPY package.json ./

# バックエンドのソースをコピー
COPY src/backend/ ./src/backend/
COPY src/lib/ ./src/lib/
COPY prisma/ ./prisma/

# フロントエンドのビルド済みファイルをコピー
COPY --from=frontend-builder /app/.next ./src/frontend/.next
COPY --from=frontend-builder /app/public ./src/frontend/public
COPY --from=frontend-builder /app/package.json ./src/frontend/package.json
COPY --from=frontend-builder /app/node_modules ./src/frontend/node_modules

# Prismaクライアントを生成
RUN bun x prisma generate

EXPOSE 3000
CMD ["bun", "run", "start"]

