FROM mcr.microsoft.com/devcontainers/base:ubuntu

SHELL ["/bin/bash", "-lc"]

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       curl ca-certificates git unzip gnupg \
    && rm -rf /var/lib/apt/lists/*

# Install Bun and make it available system-wide
RUN curl -fsSL https://bun.sh/install | bash \
    && install -m 0755 -o root -g root /root/.bun/bin/bun /usr/local/bin/bun

# Install Node.js (via apt for simplicity)
RUN apt-get update \
    && apt-get install -y --no-install-recommends nodejs npm \
    && rm -rf /var/lib/apt/lists/* \
    && corepack enable || true

WORKDIR /workspaces

