# VS Code Dev Container用Dockerfile
FROM oven/bun:1.1.20

# システムパッケージの更新と必要なツールをインストール
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    vim \
    nano \
    htop \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Node.jsのバージョン管理ツール（必要に応じて）
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# 作業ディレクトリを設定
WORKDIR /app

# ユーザー権限の設定（セキュリティ向上）
RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /app
USER appuser

# 環境変数の設定
ENV NODE_ENV=development
ENV DATABASE_URL=postgresql://postgres:postgres@db:5432/app

# ポートの公開
EXPOSE 3000 3001

# デフォルトコマンド
CMD ["bun", "run", "dev"]