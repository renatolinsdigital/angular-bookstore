# Claude Code project setup: the real mental model

This project was scaffolded to be a reusable template: copy `.claude/`,
`CLAUDE.md`, and `.mcp.json` into a new project and edit from there.

This doc also corrects a popular "Claude Code folder" infographic that
inspired this scaffold. Several of its claims don't match how Claude Code
actually works (verified against the official docs at code.claude.com as of
2026-07). Corrections are marked **✗**.

## CLAUDE.md: real

Your project rulebook. Loaded into every session as a user message (not
part of the system prompt), so it's advisory, not enforced: Claude tries
to follow it but nothing blocks a violation. Keep it under ~200 lines;
longer files reduce adherence. HTML comments (`<!-- -->`) are stripped
before Claude sees them, so they're free to use as authoring notes (see the
template in [CLAUDE.md](CLAUDE.md)).

Also loads from `~/.claude/CLAUDE.md` (personal, all projects) and an
IT-managed path (org-wide). `CLAUDE.local.md` at the project root is your
personal, gitignored layer.

## `.claude/settings.json` / `.claude/settings.local.json`: real

`settings.json` is checked into git and shared with the team.
`settings.local.json` is personal and gitignored (add it once you
`git init`, it's already in [.gitignore](.gitignore)). Precedence, highest
to lowest: managed policy → CLI flags → `settings.local.json` →
`settings.json` → `~/.claude/settings.json`.

This is also where `permissions` (allow/deny/ask rules), `hooks`, `model`,
`statusLine`, `outputStyle`, `agent`, and dozens of other keys live: see
[`.claude/settings.json`](.claude/settings.json) for a working example.

## `.claude/hooks/`: **✗ not auto-discovered, but real as a convention**

The infographic implies Claude reads files in `.claude/hooks/` the way it
reads `.claude/agents/`. It doesn't. **Hooks are configured entirely inside
`settings.json`**, under a `"hooks"` key, keyed by event name (`PreToolUse`,
`PostToolUse`, `SessionStart`, `Stop`, `PreCompact`, and about two dozen
others). What's real: pointing a hook's `command` at a script file living
under `.claude/hooks/` is a common convention: see
[`.claude/hooks/post-edit-log.sh`](.claude/hooks/post-edit-log.sh), wired up
in `settings.json`. Nothing runs unless `settings.json` references it.

Hooks are deterministic: they fire as real shell commands regardless of
what Claude decides, unlike CLAUDE.md. On Windows, shell-form commands run
via Git Bash if installed, else PowerShell; set `"shell": "powershell"`
explicitly for a script you want to guarantee runs in PowerShell.

## `.claude/skills/`: real

A `SKILL.md` with YAML frontmatter (`description` is the important field,
Claude matches it against your request) plus a markdown body, optionally
with a folder of supporting scripts/templates. Claude invokes a skill
automatically when relevant, or you type `/skill-name`. See
[`.claude/skills/commit/`](.claude/skills/commit/SKILL.md) (manual-only, via
`disable-model-invocation: true`) and
[`.claude/skills/summarize-changes/`](.claude/skills/summarize-changes/SKILL.md)
(auto-invoked, pulls live `git diff` output into the prompt before Claude
sees it).

## `.claude/agents/`: real

Subagent definitions: YAML frontmatter (`name`, `description`, `tools`,
`model`, and more) plus a system prompt body. Each runs in its own context
window, so verbose work (log analysis, research, exploration) doesn't
bloat your main conversation. See
[`.claude/agents/code-reviewer.md`](.claude/agents/code-reviewer.md) and
[`.claude/agents/researcher.md`](.claude/agents/researcher.md).

## `.claude/commands/`: real, but legacy

**Custom commands have been merged into skills.** A file at
`.claude/commands/deploy.md` and a skill at
`.claude/skills/deploy/SKILL.md` both create `/deploy` and work the same
way: existing `commands/` files keep working, but skills are recommended
going forward since they support supporting files, invocation control, and
more. Kept [`.claude/commands/changelog.md`](.claude/commands/changelog.md)
here only to show the format still works.

## `.claude/rules/`: real

Path-scoped instruction files. A rule with no `paths` frontmatter loads
every session, same priority as CLAUDE.md. A rule with `paths: [...]`
(glob patterns) loads only when Claude touches a matching file, good for
splitting a growing CLAUDE.md by topic or subsystem. See
[`.claude/rules/code-style.md`](.claude/rules/code-style.md) (unconditional)
and [`.claude/rules/api-design.md`](.claude/rules/api-design.md)
(path-scoped to `src/api/**`).

## `.claude/plugins/`: **✗ not a thing Claude Code auto-scans in a project**

The infographic shows `.claude/plugins/vercel/` as if plugins live inside
your project's `.claude/` folder the same way skills or agents do. That's
not the real mechanism. A **plugin** is its own self-contained directory
anywhere on disk (or in a git repo), identified by a
`.claude-plugin/plugin.json` manifest at its root, with `skills/`,
`agents/`, `hooks/hooks.json`, `.mcp.json`, etc. as siblings of that
manifest folder, never nested inside it. You use one by:

- `claude --plugin-dir ./my-plugin` for local testing, or
- installing it from a marketplace with `/plugin install name@marketplace`,
  which records it in `enabledPlugins` in a settings file.

Plugin skills are namespaced (`/plugin-name:skill-name`) so they can't
collide with your project's own skills. This template doesn't ship an
example plugin. Ask if you want one scaffolded.

## `.mcp.json`: real

Lives at the project root (see [`.mcp.json`](.mcp.json)), not inside
`.claude/`. Declares MCP servers under `mcpServers`, keyed by server name,
each with `command`/`args` (stdio) or a `url` (http/sse). Currently empty
here: add servers as you need them.

## `.claude/output-styles/`: real

Changes _how_ Claude talks (tone, format), not what it knows. That's
CLAUDE.md's job. A markdown file with `name`/`description`/
`keep-coding-instructions` frontmatter. See
[`.claude/output-styles/terse.md`](.claude/output-styles/terse.md). Switch
with `/config` → Output style.

## Status line: real, but it's a settings key, not a folder

`statusLine` in `settings.json`, `{"type": "command", "command": "..."}`,
pointing at a script that reads session JSON from stdin and prints what you
want shown. Not scaffolded here: run `/statusline` and describe what you
want, and Claude configures it for you.

## The actual mental model

- **CLAUDE.md / `.claude/rules/`**: context Claude _reads and tries to
  follow_. Advisory.
- **`.claude/skills/`**: procedures Claude _loads on demand_, by you or by
  relevance-matching.
- **`.claude/agents/`**: workers with their _own context window and tools_,
  used to keep your main conversation clean.
- **Hooks (in `settings.json`)**: shell commands that _run automatically at
  fixed lifecycle events_, regardless of what Claude decides. The only
  layer here that's actually enforced.
- **Plugins**: how you _package and share_ any of the above, namespaced and
  versioned, across projects or with a team.

Start small: a good CLAUDE.md and one or two skills usually beat a fully
loaded `.claude/` folder that nobody maintains.
