<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, read the relevant version-matched docs in:

`node_modules/next/dist/docs/`

Do not rely on memory for framework behavior when repo reality or bundled docs can confirm it.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — VIWASCO Project Guide

This file tells coding agents how to work safely and effectively in this repository.

The primary goal is not speed.
The primary goal is correctness, minimal drift, and avoiding wasteful failed patch loops.

If there is a conflict between “move fast” and “be certain,” choose “be certain.”

---

## 1. Mission

This repository already has strong patterns.

Agents must:

- preserve existing repository patterns
- avoid speculative architecture changes
- avoid broad edits when a narrow edit is enough
- avoid repeated failed patch attempts
- avoid changing files that were not explicitly part of the task
- prefer the path that is most certain to succeed

A partially completed but correct change is better than a large risky change that causes patch failures, file drift, or unrelated edits.

---

## 2. Project Snapshot

- This is a Next.js 16 App Router project for a water utility website plus an admin CMS.
- Public pages live under `app/(public)`.
- Admin/CMS pages live under `app/(admin)`.
- Auth pages live under `app/auth`.
- Access-control utility pages live under `app/(other)`.
- The dev server runs on port `3000`.

The current `README.md` is not authoritative.
Prefer the actual codebase, package versions, and this file.

---

## 3. Source of Truth Order

When there is uncertainty, use this order:

1. current repository files
2. bundled Next.js docs in `node_modules/next/dist/docs/`
3. installed package versions in `package.json`
4. this `AGENTS.md`
5. memory

If memory conflicts with the repo, the repo wins.

If assumptions conflict with inspected code, inspected code wins.

---

## 4. Core Working Rules

- Follow existing patterns before introducing new abstractions.
- Keep `page.tsx` files thin.
- Prefer Server Components for reads.
- Prefer Server Actions for writes when that is the local pattern.
- Validate write payloads with Zod.
- Use the shared Prisma client from `lib/db.ts`.
- Reuse existing cache tags and invalidation patterns.
- Do not introduce a separate API layer for CMS mutations if Server Actions are the established local pattern.
- Do not use Tailwind CSS in this project.
- Do not use shadcn/ui in this project.
- Do not assume the repo uses shadcn/ui or lucide unless the codebase actually shows that.
- Mirror the nearest existing working feature before creating a new pattern.

Most important:

- Do not guess.
- Do not “helpfully” refactor unrelated code.
- Do not rewrite working files just because you prefer a different structure.
- Do not remove existing wiring unless you have verified it is unused and the task requires removal.

---

## 5. Mandatory Safe-Change Workflow

Before making any code change, do this in order:

### Step A — Inspect first

Read the exact files directly involved in the task.

At minimum, inspect:

- the route/page being changed
- the closest similar working feature in the repo
- the relevant schema/data/action/form files
- any shared types/helpers used by that feature

Do not start editing before understanding the pattern.

### Step B — Mirror an existing feature

Pick the nearest existing working pattern and mirror it.

Examples:

- for admin list/new/edit pages, mirror an existing content module
- for public getters, mirror an existing public getter module
- for forms, mirror an existing form that uses the same submission helper
- for media fields, mirror the existing upload and JSON handling pattern
- for rich text display, mirror the existing rich content renderer

### Step C — Minimize the blast radius

Only edit the files that are strictly necessary.

If a task can be solved by editing 2 files, do not edit 7.
If a task is only about public pages, do not touch admin pages.
If a task is only about getters, do not mutate schema or actions.

### Step D — Make the smallest safe edit

Prefer small localized edits over sweeping patches.

### Step E — Stop if repo reality differs from the assumption

If the inspected code does not match the expected pattern, stop and re-evaluate from the codebase.

Do not continue on assumption.

---

## 6. Anti-Waste Rules For Patching

These rules are strict.

### 6.1 Never do repeated blind patch retries

If a patch fails once:

- do not keep retrying the same large patch in slightly different forms
- do not continue with additional speculative edits
- do not branch into unrelated cleanup

Instead:

1. re-read the exact current file contents
2. reduce the patch size
3. patch one file at a time
4. patch one block at a time

### 6.2 Prefer full-file replacement when safer than fragile multi-hunk patching

If a file is small-to-medium sized and the intended final content is clear, prefer replacing the file content fully instead of attempting many fragile hunks.

Use this especially when:

- the file is being created new
- the file is mostly being rewritten anyway
- the patch tool has already failed once on that file
- there are many small moving parts

### 6.3 One file at a time after the first patch failure

After the first patch failure in a task:

- only modify one file at a time
- verify the exact target content before the next edit
- do not queue broad multi-file patches

### 6.4 No unrelated edits during recovery

When recovering from a patch failure:

- do not edit sidebars
- do not rename routes
- do not alter schema
- do not remove props
- do not “simplify” other code

unless that change is explicitly required by the task and verified from inspected files.

---

## 7. Next.js 16.2 and React 19.2 Rules

This repo targets modern Next.js and React behavior.

### 7.1 Linting

- Do not use `next lint`.
- Use ESLint directly.
- Run `npm`/package checks through the existing package scripts:
  `lint` = `eslint .`
  `pretty` = `prettier -w "**/*.{ts,tsx,js,jsx,json,css,md,html}"`
  `ts-check` = `tsc --noEmit`
- Do not run `pnpm build`; the user handles builds manually.
- Do not assume `next build` will run linting.
- Keep a separate `tsc --noEmit` check for type safety.

### 7.2 Turbopack

- Turbopack is the default in Next.js 16.
- Do not add `--turbopack` to `next build` unless the repo has a specific reason.
- Do not introduce webpack fallbacks unless required.

### 7.3 React hooks and effects

- Respect React 19.2 semantics.
- Do not suppress hook dependency warnings casually.
- Consider `useEffectEvent` only when the code is truly an Effect-fired event, not as a lint silencer.
- Keep dependencies honest.

### 7.4 Server/client boundaries

- Preserve Server Components by default.
- Only add `'use client'` when interactivity or browser-only APIs require it.
- Do not move server logic into client code without a clear need.

### 7.5 Caching

- Reuse existing cache tags and invalidation patterns.
- Do not invent parallel caching logic when local helpers already exist.

### 7.6 MCP workflow

- When investigating or fixing Next.js behavior, use the relevant MCP tools first, especially the Next.js MCP tools.
- Start Next.js runtime investigation with `mcp__next_devtools__init`, then use `mcp__next_devtools__nextjs_index` and `mcp__next_devtools__nextjs_call` as appropriate.
- Use browser automation via MCP when runtime verification is needed.
- Use MCP diagnostics to reduce guesswork before editing code.

---

## 8. Actual Stack: Verify From Repo, Do Not Assume

Use the real repository as source of truth for stack details.

Examples to verify from code before acting:

- UI library and styling approach
- icon library
- auth flow
- form helpers
- upload/media handling
- cache helpers
- table/list patterns
- admin layout wiring

Do not impose a preferred stack on the repo.

---

## 9. Prisma Rules

Non-negotiable:

- Reuse the shared Prisma client from `lib/db.ts`.
- Do not create extra Prisma clients.
- Do not change `prisma/schema.prisma` casually.
- Do not use schema edits to “make UI wiring easier.”

Expected schema-change workflow:

1. update `prisma/schema.prisma`
2. run a Prisma migration
3. regenerate Prisma client if needed
4. update corresponding Zod schemas, getters, actions, and UI

But if the task is only wiring already-existing models, do not touch the schema.

If the user says migrations already ran, treat the current schema as authoritative unless they explicitly request a schema change.

---

## 10. Data Fetching And Mutations

Preserve local patterns.

General rules:

- public reads should stay in public data modules
- admin reads should stay in admin data modules
- write logic should stay in server actions if that is the local pattern
- validate writes with Zod
- keep returned shapes close to what existing pages/components expect

Do not invent a second mutation style for the same feature area.

---

## 11. Forms And Validation

- Reuse existing form helpers and field components.
- Keep field-level errors in the current local style.
- Do not remove relation fields or required fields just because wiring them is inconvenient.
- If a relation exists in the schema, wire it correctly.

---

## 12. TypeScript Discipline

- Never use `any` unless the repo already forces it in a very narrow boundary and there is no safer practical alternative.
- Prefer explicit types, Zod inference, discriminated unions, and small helper types.
- Do not “fix” type errors by weakening core types globally.
- Do not silence type issues with broad casts unless absolutely necessary and localized.

Preferred order for fixing TS issues:

1. correct the actual type
2. narrow unknown data with parsing/validation
3. add a small adapter/helper
4. as a last resort, use a tightly scoped assertion

---

## 13. File Placement Rules

Prefer these locations:

- new public data getters: `lib/data/public/**`
- new admin data getters: `lib/data/admin/**`
- new server actions: `actions/**`
- new Zod schemas: `lib/schemas/**`
- new public UI: `components/public/**`
- new admin UI: `components/admin/**`
- shared generic UI: existing shared component areas

Avoid dumping feature logic into `app/**` unless it is truly route-specific.

---

## 14. Output Discipline

### For existing files

- make minimal exact edits
- preserve comments when possible
- preserve naming unless rename is required
- do not reformat unrelated code

### For new files

- provide a complete ready-to-use file

### For risky edits

- keep the change set narrow
- state exact files to change
- avoid touching neighboring features

### For code suggestions

- prefer directly usable code
- avoid pseudo-code
- avoid broad “while we are here” refactors

---

## 15. Hard Stop Conditions

Stop broad editing and re-evaluate if any of these happen:

- a patch fails once on a large multi-file change
- inspected repository code does not match the assumed pattern
- a required relation/field is missing from the actual schema
- a requested change would require a schema change the user did not ask for
- a file path in memory differs from the real repository path
- a patch attempt starts affecting unrelated files

After a hard stop:

1. inspect the exact current file contents again
2. reduce scope
3. proceed file by file

---

## 16. Forbidden Behaviors

Do not do the following:

- do not repeatedly retry failed broad patches
- do not modify unrelated files while recovering from a failed patch
- do not remove required fields or relations to avoid wiring them
- do not silently change Prisma schema to make UI code easier
- do not change route structure without explicit need
- do not rewrite working modules into a different architecture
- do not invent new conventions when an existing local convention exists
- do not assume memory is correct when repo files say otherwise

---

## 17. Preferred Decision Order

When uncertain, decide in this order:

1. What do the current repository files actually do?
2. What do the bundled version-matched Next docs say?
3. What is the nearest existing feature with the same pattern?
4. What is the smallest edit that satisfies the task?
5. Can this be done without touching schema/routes/sidebars?
6. If not, has the user explicitly asked for those broader changes?

If the answer to step 6 is no, do not make the broader changes.

---

## 18. Final Principle

This repo prefers disciplined, pattern-based, low-risk changes.

Behave like a careful maintainer, not an eager refactorer.

Be conservative.
Be exact.
Reuse what already works.
Patch narrowly.
Stop after the first sign of drift and re-check the real code.
