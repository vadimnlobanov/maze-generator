# AGENTS.md

## Goal

Minimize token usage while maintaining sufficient quality.
Prefer the smallest context, the smallest valid change, and the least capable model that can reliably solve the task.

---

## Model Selection

Automatically choose the cheapest model that is likely to succeed.

### Small / Fast

Use for:

- formatting
- markdown
- comments
- documentation
- lint fixes
- test generation
- simple bug fixes
- CRUD
- config edits
- small refactors
- single-file changes
- writing small scripts

### Medium

Use for:

- multi-file features
- non-trivial debugging
- moderate refactoring
- API integration
- performance improvements
- code review of medium PRs

### Strongest Model

Use only when required:

- architecture
- system design
- project planning
- migrations
- complex debugging
- security review
- large refactoring
- repository-wide analysis
- final review before completion

After planning, switch back to a cheaper model whenever possible.

---

## Context Rules

Never load the entire repository unless explicitly requested.

Always minimize context.

Prefer:

- specific files
- specific folders
- git diff
- changed code only

Avoid reading unrelated files.

---

## Task Decomposition

Prefer many small independent tasks over one large task.

Typical workflow:

1. Plan
2. Split into subtasks
3. Execute one subtask at a time
4. Validate
5. Final review

---

## Output Rules

Default output:

- only modified code
- unified diff when possible
- concise explanations

Avoid long descriptions unless requested.

---

## Reasoning

Think before editing.

Avoid trial-and-error.

Batch related changes into one edit instead of many iterative edits.

---

## Editing

Modify only what is necessary.

Do not rewrite working code.

Avoid unnecessary renaming or formatting.

Keep diffs small.

---

## Testing

Run only tests relevant to modified code.

Avoid full test suites unless requested or necessary.

---

## Session Management

When a task is finished:

- summarize completed work
- list remaining work
- list known issues

Prefer starting the next task with this summary instead of relying on long conversation history.

---

## Communication

If the request is ambiguous:

- ask one concise clarifying question

Otherwise:

- make reasonable assumptions
- state them briefly
- continue

---

## Efficiency Priorities

In order of importance:

1. Reduce context size.
2. Choose the cheapest suitable model.
3. Split work into small tasks.
4. Keep edits localized.
5. Keep responses concise.
6. Avoid repeating information already available.
7. Avoid unnecessary repository analysis.

---

## Context Lifetime

After completing a subtask, do not retain unnecessary implementation details.

Carry forward only:

- current status
- remaining tasks
- blocking issues

Discard obsolete reasoning and intermediate analysis.

---

## Tool Usage

Before reading a file:

- verify it is relevant.

Before editing a file:

- verify it actually requires modification.

Never inspect or modify files unrelated to the current task.