# GitHub リポジトリ設定 (Terraform)

このモジュールは GitHub リポジトリ設定を自動化します。

## できること

- main ブランチ保護
- コラボレーターの招待（権限指定）
- GitHub Actions の Secrets/Variables 設定
- 脆弱性アラートの有効化
- Actions 実行許可（全アクション）
- ラベルの作成・同期（`github_issue_label`）

## 使い方

```hcl
module "repo" {
  source      = "./infra/github"
  owner       = "your-org-or-user"
  repository  = "your-repo"
  collaborators = {
    your-collaborator = "push"
  }
  secrets = {
    DATABASE_URL = "postgresql://..."
  }
  variables = {
    NODE_ENV = "production"
  }

  labels = {
    "area:docs"     = { color = "#0366d6", description = "Documentation changes" }
    "area:ci"       = { color = "#d73a4a", description = "CI/CD and workflows" }
    # 省略可: 必要なラベルを追加
  }
}
```

環境変数 `GITHUB_TOKEN` に管理権限トークンを設定して実行してください。
