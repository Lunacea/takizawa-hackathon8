FROM oven/bun:1.1.20 AS deps
WORKDIR /app
# 依存関係のみを先にコピーしてインストール（ビルドキャッシュを最大化）
COPY package.json bun.lock ./
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

FROM oven/bun:1.1.20 AS runner
WORKDIR /app
ENV NODE_ENV=production

# 依存物をコピー
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/bun.lock ./bun.lock
COPY package.json ./package.json

# アプリのソース
COPY . .

EXPOSE 3000
CMD ["bun", "run", "start"]

