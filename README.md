# Eightfold Treasury

**The capability registry for Eightfold Harness.**

Eightfold Treasury is the distribution layer for [Eightfold Harness](https://github.com/Eightfold-Code/eightfold-harness). It publishes a small machine-readable catalog of **adaptations** and **bundles** that Harness can discover and install on demand.

Treasury is deliberately simple: it is **not** another runtime, package manager, or plugin framework. Adaptations still use the native Harness/Cordis plugin model. Treasury only answers three questions:

1. What capabilities are available?
2. Where is the exact source snapshot for each capability?
3. Which capabilities belong together as a bundle?

> Treasury is currently a developer preview. The registry schema and adaptation format may change while the distribution model is being stabilized.

## How it fits together

```text
                    main branch
              ┌──────────────────┐
              │   registry.json  │
              │ schemas · docs   │
              └────────┬─────────┘
                       │ resolves
          ┌────────────┴────────────┐
          ▼                         ▼
adaptation/session-search   adaptation/hello-eightfold
          │                         │
          └────────────┬────────────┘
                       │ pinned commit archive
                       ▼
              ┌──────────────────┐
              │ Eightfold Harness│
              │ .eightfold/      │
              └──────────────────┘
```

Each adaptation lives independently on its own `adaptation/<name>` branch. Published registry entries point to exact Git commit SHAs so installs are reproducible even when a development branch later moves.

## Current catalog

The registry currently publishes:

| Adaptation | Version | Purpose |
| --- | --- | --- |
| `hello-eightfold` | `0.2.0` | Minimal example adaptation and native Harness plugin bundle |
| `session-search` | `0.1.0` | Persistent full-text session search for Harness profiles |

The `developer` bundle currently groups both adaptations.

The live source of truth is [`registry.json`](registry.json).

## Using Treasury

Treasury is consumed through the Eightfold Harness CLI.

### Discover adaptations

```bash
pnpm dsh eightfold treasury list
pnpm dsh eightfold treasury search session
```

### Install an adaptation

```bash
pnpm dsh eightfold add session-search
```

### Work with bundles

```bash
pnpm dsh eightfold bundle list
pnpm dsh eightfold bundle add developer
```

### Update installed adaptations

```bash
# Update one
pnpm dsh eightfold update session-search

# Update all
pnpm dsh eightfold update
```

### Remove an adaptation

```bash
pnpm dsh eightfold remove session-search
```

By default, Harness stores Treasury-managed files under `.eightfold/` in the current working directory. `EIGHTFOLD_HOME` overrides that location, and `EIGHTFOLD_TREASURY_URL` can point Harness at a different registry.

Installing from Treasury does **not** currently rewrite or activate a Harness profile automatically. Treasury handles distribution; profile/plugin activation remains part of the Harness lifecycle.

## Repository model

### `main`

The default branch contains only the catalog and infrastructure needed to publish adaptations:

```text
eightfold-treasury/
├── README.md
├── registry.json
├── schemas/
│   ├── registry.schema.json
│   └── adaptation.schema.json
├── docs/
│   ├── architecture.md
│   └── publishing.md
└── examples/
    └── hello-eightfold/
```

### `adaptation/*`

Each adaptation is distributed from its own orphan branch, for example:

```text
adaptation/hello-eightfold
adaptation/session-search
```

An adaptation branch contains only that adaptation's files rather than the complete history and contents of every other capability.

A typical branch looks like:

```text
/
├── eightfold.json
├── package.json
├── README.md
└── src/
    └── index.ts
```

Depending on the package, a native Harness bundle surface such as `dsh.bundle` or Cordis configuration may also be present.

## Installation flow

When Harness installs an adaptation, it:

1. Fetches and validates `registry.json`.
2. Resolves the requested adaptation or expands a named bundle.
3. Resolves the registry's pinned source commit.
4. Downloads an archive for that snapshot instead of cloning Treasury.
5. Validates archive paths and the root `eightfold.json` manifest.
6. Extracts the adaptation into `.eightfold/adaptations/<id>`.
7. Records the installed source commit and declared permissions in local state.

This keeps downloads small and makes the installed source auditable and reproducible.

## Registry format

A registry entry describes the adaptation and the source snapshot Harness should install:

```json
{
  "session-search": {
    "name": "Session Search",
    "description": "Enable persistent full-text session search in Eightfold Harness profiles.",
    "version": "0.1.0",
    "source": {
      "repository": "Eightfold-Code/eightfold-treasury",
      "branch": "adaptation/session-search",
      "commit": "<full-git-sha>"
    },
    "entry": "index.js",
    "compatibility": {
      "eightfoldHarness": ">=0.1.1"
    }
  }
}
```

Branches are useful for development and discovery; the commit SHA is what makes a published install stable.

## Bundles

Bundles are named collections of adaptation IDs:

```json
{
  "bundles": {
    "developer": [
      "hello-eightfold",
      "session-search"
    ]
  }
}
```

A bundle does not introduce another package format. It is simply a convenient way to resolve and install several normal adaptations together.

## Publishing an adaptation

1. Create an orphan branch named `adaptation/<id>`.
2. Add the adaptation manifest and native Harness/Cordis package files.
3. Commit and push the branch.
4. Add or update its entry in `registry.json` on `main`.
5. Pin the registry entry to the full commit SHA you want to publish.
6. Validate the manifest and registry schemas before merging.

See [Publishing](docs/publishing.md) for the exact manifest and package format, and [Architecture](docs/architecture.md) for the reasoning behind the branch and registry model.

## Design goals

- **Small installs** — fetch one adaptation snapshot instead of cloning the whole repository.
- **Reproducibility** — published versions resolve to exact Git commits.
- **Isolation** — each adaptation has an independent branch and package surface.
- **Compatibility** — adaptations remain native Harness/Cordis plugins rather than a parallel extension system.
- **Simple discovery** — one registry can expose individual capabilities and curated bundles.

## Related project

- [Eightfold Harness](https://github.com/Eightfold-Code/eightfold-harness) — the runtime that consumes Treasury.
