variable "owner" {
  description = "GitHub organization or user name"
  type        = string
}

variable "repository" {
  description = "Repository name"
  type        = string
}

variable "collaborators" {
  description = "Map of username => permission (pull|triage|push|maintain|admin)"
  type        = map(string)
  default     = {}
}

variable "secrets" {
  description = "Map of Actions secret name => value"
  type        = map(string)
  default     = {}
}

variable "variables" {
  description = "Map of Actions variable name => value"
  type        = map(string)
  default     = {}
}

variable "manage_actions_permissions" {
  description = "Whether to manage Actions repository permissions (requires admin token)"
  type        = bool
  default     = false
}

variable "labels" {
  description = "Map of label name => { color = hex, description = optional }"
  type = map(object({
    color       = string
    description = optional(string)
  }))
  default = {
    "area:docs"         = { color = "#0366d6", description = "Documentation changes" }
    "area:ci"           = { color = "#d73a4a", description = "CI/CD and workflows" }
    "area:infra"        = { color = "#0e8a16", description = "Infrastructure / Terraform" }
    "area:frontend"     = { color = "#5319e7", description = "Frontend source changes" }
    "area:backend"      = { color = "#0052cc", description = "Backend (server, API)" }
    "area:shared"       = { color = "#6a737d", description = "Shared libraries/components" }
    "area:deps"         = { color = "#fbca04", description = "Dependencies updates" }
    "area:docker"       = { color = "#1d76db", description = "Docker / Compose" }
    "area:devcontainer" = { color = "#0e8a16", description = "Dev Containers" }
    "area:prisma"       = { color = "#c2e0c6", description = "Prisma / DB schema" }
  }
}

variable "required_status_checks_contexts" {
  description = "List of required status check contexts for branch protection (empty to disable)"
  type        = list(string)
  default     = []
}

variable "required_status_checks_strict" {
  description = "Require branches to be up to date before merging"
  type        = bool
  default     = false
}

