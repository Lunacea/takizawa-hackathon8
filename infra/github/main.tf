terraform {
  required_version = ">= 1.5.0"
  required_providers {
    github = {
      source  = "integrations/github"
      version = ">= 6.2.0"
    }
  }
}

provider "github" {
  # 環境変数 GITHUB_TOKEN を使用（repo 管理権限が必要）
  owner = var.owner
}

data "github_repository" "repo" {
  full_name = "${var.owner}/${var.repository}"
}

resource "github_branch_protection" "main" {
  repository_id  = data.github_repository.repo.node_id
  pattern        = "main"
  enforce_admins = true

  required_pull_request_reviews {
    dismiss_stale_reviews           = true
    required_approving_review_count = 1
    require_code_owner_reviews      = false
  }

  dynamic "required_status_checks" {
    for_each = length(var.required_status_checks_contexts) > 0 ? [1] : []
    content {
      strict   = var.required_status_checks_strict
      contexts = var.required_status_checks_contexts
    }
  }
}

resource "github_repository_collaborator" "collab" {
  for_each   = var.collaborators
  repository = data.github_repository.repo.name
  username   = each.key
  permission = each.value # pull|triage|push|maintain|admin
}

resource "github_actions_secret" "secrets" {
  for_each        = var.secrets
  repository      = data.github_repository.repo.name
  secret_name     = upper(each.key)
  plaintext_value = each.value
}

resource "github_actions_variable" "variables" {
  for_each      = var.variables
  repository    = data.github_repository.repo.name
  variable_name = upper(each.key)
  value         = each.value
}

resource "github_actions_repository_permissions" "permissions" {
  count           = var.manage_actions_permissions ? 1 : 0
  repository      = data.github_repository.repo.name
  enabled         = true
  allowed_actions = "all"
}

resource "github_issue_label" "labels" {
  for_each    = var.labels
  repository  = data.github_repository.repo.name
  name        = each.key
  color       = replace(each.value.color, "#", "")
  description = try(each.value.description, null)
}

