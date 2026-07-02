---
description: Sync Adobe After Effects expressions or scripting docs from upstream GitHub repos into local MDX (one doc-set per run)
argument-hint: "[expressions|scripting]"
allowed-tools: Bash(curl -s https://api.github.com/*), Bash(curl -s https://raw.githubusercontent.com/*), Bash(jq:*), Read, Edit, Write, Grep, Glob, Bash(git diff:*), Bash(git status:*), Bash(git log:*)
---

# /sync — pull upstream AE doc changes into local MDX

This command ports upstream changes from one (never both) of the two docsforadobe repos below into this repo's `content/docs/{expressions,scripting}` MDX trees. It never stages or commits — it only edits the working tree and reports what to do next.

## Sources

- **Expressions**: https://github.com/docsforadobe/after-effects-expression-reference (branch `master`, docs under `docs/`)
- **Scripting**: https://github.com/docsforadobe/after-effects-scripting-guide (branch `master`, docs under `docs/`)

Config/state for each lives in `.claude/sync/expressions.json` and `.claude/sync/scripting.json` respectively. If either of those `upstream.url` values ever stops matching the URLs above, treat that as a warning (config drift) — don't silently trust one over the other, surface it to the user.

**Do not use `WebFetch` for anything in this command.** It summarizes fetched content through a small model rather than returning raw bytes, which silently corrupts diff patches, JSON, and file content — exactly what this command must get byte-exact. Instead, pipe `curl` straight into `jq` for every network call that returns JSON — one MSYS/Git-Bash process end to end, no intermediate file, and `jq` extracts only the fields actually needed (never pulling unrelated JSON like `files[].patch` into context).

**Preflight — `jq` is required:**

```bash
jq --version
```

If this fails (not installed / not on PATH), stop immediately — do not attempt any GitHub API calls or improvise another way to parse JSON. Report:

> `jq` is required but not found on PATH. Install it and try again — e.g. `winget install jqlang.jq`, `scoop install jq`, or `choco install jq`.

## 0. Determine target

Parse `$ARGUMENTS` (trimmed, lowercased):

- `expressions` or `scripting` → that's the target, proceed to step 1.
- empty → ask the user (single-select) to pick `expressions` or `scripting`. Do not proceed until answered.
- anything implying both, or anything else unrecognized → refuse: "/sync only processes one doc-set per run. Run `/sync expressions` and `/sync scripting` separately." Stop.

## 1. Load config

`Read(.claude/sync/{target}.json)` → `upstream`, `local`, `state`, `ignore`, `mappingOverrides`.

## 2. Resolve upstream HEAD

```bash
curl -s "https://api.github.com/repos/{upstream.repo}/commits/{upstream.branch}" | jq -r '.sha'
```

Validate the result is a 40-character hex string. If it isn't, or the call fails, retry once. If it still fails, abort with a clear message (likely GitHub API rate limiting or a malformed response) — do not guess or proceed with a stale/partial SHA.

## 3. No-op short-circuit

If `headSha === state.lastSyncedCommit`:

> Nothing to sync — {target} is already up to date with upstream `{headSha[:7]}`.

Stop immediately. Do not run any further steps, do not touch any files.

## 4. Pre-flight dirty-tree check

```bash
git status --porcelain -- {local.docsRoot}
```

If non-empty, don't block — just remember to call this out prominently in the final report (step 12), so the user can tell which changes came from this sync run vs. pre-existing uncommitted edits.

## 5. Get the changed file list

```bash
curl -s "https://api.github.com/repos/{upstream.repo}/compare/{state.lastSyncedCommit}...{headSha}" \
  | jq -r '.files[] | "\(.status) \(.filename) \(.previous_filename // "")"'
```

This gives the file list and status (`added`/`modified`/`removed`/`renamed`) for the whole range in one call. **Never trust `files[].patch` for content — only the filename/status list from this call is used.** If the compare response indicates truncation (very large ranges: >300 files or huge diffs), fall back to walking `GET /repos/{upstream.repo}/commits?sha={headSha}` between the two SHAs commit-by-commit instead of trusting a possibly-incomplete file list.

**Bootstrap edge case**: only relevant when `state.lastSyncedAt` is `null` (a doc-set's very first run, seeded with a baseline commit that hasn't been through a real sync cycle yet). In that case also fetch `GET /repos/{upstream.repo}/commits/{state.lastSyncedCommit}` and fold its own changed files into the list — a freshly hand-seeded baseline is not guaranteed to already be fully applied locally, so its own diff may still need syncing. Once a doc-set has completed one real run, `lastSyncedAt` is always set and this branch is dead for it going forward — but don't remove the check, since a config could be manually reset to an arbitrary commit later.

## 6. Filter to relevant content paths

Keep only entries where `filename` starts with `{upstream.docsRoot}/` and doesn't match any prefix in `ignore`. If nothing's left after filtering:

- still update `state.lastSyncedCommit = headSha` and `state.lastSyncedAt = now` in the config file (the range has been fully evaluated, nothing in it was doc content)
- report "No docs/\*\* changes between `{old[:7]}` and `{new[:7]}` — state updated, nothing to review."
- stop.

## 7. Resolve each changed path to a local path

For each remaining `added`/`modified` file, path relative to `upstream.docsRoot` (e.g. `docs/layer/avlayer.md` → `layer/avlayer.md`):

1. If it's a key in `mappingOverrides` → local path is `{local.docsRoot}/{mappingOverrides[key]}`.
2. Else apply the default transform: swap `.md` → `.mdx`, prepend `{local.docsRoot}/`. Check the resulting path exists.
3. If neither resolves to an existing file, this is a **new upstream file with no known mapping**. Stop and ask the user (blocking) to confirm or edit the proposed default path from step 2 before writing anything. Once confirmed, immediately write the decision into `mappingOverrides` in `.claude/sync/{target}.json` (don't batch this — persist it right away so a later failure in this same run doesn't lose the decision).

For `removed`/`renamed` entries, do **not** resolve a local path automatically — see step 8.

## 8. Deletions and renames — flag, never auto-apply

Collect every `removed` or `renamed` upstream file into a "needs manual review" list (old path, new path if renamed, status). Do not delete or move any local file for these. Local structure already deliberately diverges from upstream in places (e.g. the `match-names` reorganization), so an upstream rename doesn't necessarily imply the same rename should happen locally — that's a human call. Surface this list prominently in the final report (step 12).

## 9. Per-file content sync

For each resolved `(upstreamPath, localPath, status)` from step 7:

```bash
# only if status == modified:
curl -s "https://raw.githubusercontent.com/{upstream.repo}/{state.lastSyncedCommit}/{upstreamPath}"
# always:
curl -s "https://raw.githubusercontent.com/{upstream.repo}/{headSha}/{upstreamPath}"
```

Read the current local file (if `modified`) with `Read(localPath)`. Compare the old and new upstream snapshots to determine the semantic delta, then re-express that same delta against the current local content — do not mechanically apply the raw diff; translate it through the syntax table below and this repo's established conventions (minimal `title`-only frontmatter, internal links with no `.md`/`.mdx` extension, existing anchor conventions like `#objectnamepropertyname`).

For `added` files: construct the new local file from the new upstream snapshot using the same conventions, then check whether the target directory's `meta.json` needs the new page appended to its `pages` array — Fumadocs won't surface a page in nav otherwise (see `content/docs/scripting/match-names/meta.json` for the array-of-slugs pattern).

### MkDocs Material → Fumadocs MDX syntax reference

This repo's `src/components/mdx.tsx` re-exports `fumadocs-ui`'s full default MDX component set unmodified, so `Callout`, `Tabs`/`Tab`, and `Accordion`/`Accordions` are all available for use in any `.mdx` file regardless of which of them a given page happens to use already.

For every row below, before picking a specific rendering, check whether the target directory already has local content using that same MkDocs construct and match its existing convention. If there's no local precedent to match, flag the choice in the final report rather than inventing a convention silently.

| MkDocs Material syntax                                                            | Fumadocs MDX equivalent                                                            | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| First `# H1` heading                                                              | Remove it; use its text as the frontmatter `title` (escape any embedded `"`)       | The rest of the body never repeats the H1 — local pages start directly at the access-path line or `#### Description`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `!!! type "title"` admonition                                                     | `<Callout type="...">...</Callout>`                                                | Material for MkDocs' officially supported qualifiers are exactly: `note`, `abstract`, `info`, `tip`, `success`, `question`, `warning`, `failure`, `danger`, `bug`, `example`, `quote` — anything else is a deprecated alias of one of these (or, if truly unrecognized, falls back to `note` in Material itself). Map by family: omit `type` (→ `info` default) for `note`/`abstract`/`info`/`question`/`example`/`quote` and their deprecated aliases `summary`/`tldr`/`help`/`faq`/`snippet`/`cite`; `type="idea"` for `tip` and its alias `hint`; `type="warn"` for `warning`/`bug` and warning's aliases `caution`/`attention`; `type="error"` for `danger`/`failure` and their aliases `error`/`fail`/`missing`; `type="success"` for `success` and its aliases `check`/`done`. |
| Admonition inside a table cell                                                    | `<Callout type="...">content all on one line</Callout>` inside the cell            | `Callout` works fine inside a markdown table cell — the only constraint is the cell can't contain a literal line break, so the entire opening tag, content, and closing tag must be on that one cell line. Don't flatten it to plain bold text; use the real component, same type-mapping rules as above.                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Inline annotation marker `text(1)` + `{ .annotate }` + `1.  body`                 | GFM footnote: `text[^1]` inline, `[^1]: body` collected at the bottom of the file  | Confirmed live in `docs/index.md` → `index.mdx` in both repos. Number footnotes sequentially per file (`[^1]`, `[^2]`, ...); multi-paragraph annotation bodies join into one footnote definition.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `???`/`???+ type "title"` collapsible                                             | `<Callout type="...">...</Callout>` (same as a non-collapsible admonition)         | Prior conversions treated `???` identically to `!!!` rather than using `<Accordion>` — follow that precedent for consistency unless local content later adopts real `<Accordion>` usage, in which case match that instead.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `=== "Tab Title"` tabs                                                            | `<Tabs items={["A", "B"]}><Tab value="A">...</Tab><Tab value="B">...</Tab></Tabs>` | No precedent either way — if hit, flag it in the final report rather than guessing at formatting.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Fenced code blocks (`pymdownx.superfences`/`highlight`)                           | Standard triple-backtick fences with language tag                                  | Pass-through, matches how local `.mdx` code blocks are already written.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| GFM pipe tables (`\| Col \| Col \|`)                                              | Pass-through                                                                       | `remark-gfm` is enabled in `source.config.ts`; upstream and local use identical pipe-table syntax.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ASCII/RST grid tables (`+---+---+` / `+===+===+` borders, `markdown_grid_tables`) | Rewrite as a GFM pipe table                                                        | Common in these repos' Parameters/Attributes tables (confirmed in multiple files), not an edge case — always check for this format. `remark-gfm` does not parse it; pasting it verbatim renders as a broken code block. When a cell's content spans multiple wrapped lines, join them into one cell: plain prose joins with a single space, but if the wrapped lines form a list (each starting with `-` or `1.`/`2.`/etc.), joining with a space breaks the list rendering — join those with `\n` between items instead, which renders correctly. When a grid section repeats a value in the first column across sub-rows, split it into that many separate table rows instead of merging them.                                                                                     |
| `- [ ]` / `- [x]` task lists                                                      | Pass-through                                                                       | Same `remark-gfm` plugin.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Raw HTML blocks (`md_in_html`)                                                    | Must be valid JSX                                                                  | Self-close void tags (`<br>` → `<br />`, `<img ...>` → `<img ... />`) — MDX parses via JSX, not permissive HTML. An unclosed tag fails the MDX build, not just renders wrong.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `toc` config (sidebar TOC, permalinks)                                            | N/A                                                                                | Fumadocs generates its own page TOC from headings automatically — never hand-author one.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

## 10. Copywriting pass

On just the newly-touched text spans (not full-file reformatting): check spelling, punctuation, and internal consistency. If upstream itself has an editorial quirk (e.g. a reused non-version-specific link across two headings, or a bullet bundling multiple unrelated items into one line), mirror it faithfully rather than "fixing" it, and note it in the final report. We are porting upstream's content, not editing their copy.

## 11. Update state

Write `state.lastSyncedCommit = headSha` and `state.lastSyncedAt = <current ISO timestamp>` back to `.claude/sync/{target}.json`. (`mappingOverrides` additions from step 7 are already persisted as they happened.)

## 12. Verify and report

```bash
git diff --stat -- {local.docsRoot}
git status -- {local.docsRoot}
```

Grep the touched files for any leftover `!!!` admonition markers or `.md`/`.mdx`-suffixed internal links — signs of a missed conversion.

Final report to the user, in order:

1. List of local files changed (from `git diff --stat`).
2. Any pre-existing dirty-tree warning from step 4.
3. The "needs manual review" deletions/renames list from step 8, if non-empty — called out prominently, not buried.
4. Any new `mappingOverrides` entries added this run.
5. Any upstream editorial quirks mirrored faithfully (step 10).
6. Proposed commit message: `Chores: Sync {target} docs with upstream ({old[:7]}..{new[:7]})`.
7. Explicit reminder: nothing has been staged or committed — review and commit manually.
