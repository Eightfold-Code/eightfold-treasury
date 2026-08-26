# Eightfold Treasury

**A small, reproducible catalog for Eightfold Harness capabilities.**

Treasury is the distribution layer for [Eightfold Harness](https://github.com/Eightfold-Code/eightfold-harness). It publishes machine-readable metadata for installable adaptations and named bundles.

Treasury is not another runtime, package manager, or plugin framework. Adaptations continue to use the native Harness and Cordis model. Treasury answers three questions:

1. Which capabilities are available?
2. Where is each capability's source snapshot?
3. Which capabilities belong together as a bundle?

> Treasury is in developer preview. The registry schema and adaptation format may change.

## Current catalog

| Adaptation | Version | Purpose |
| --- | --- | --- |
| hello-eightfold | 0.2.0 | Minimal example adaptation and native Harness plugin bundle |
| session-search | 0.1.0 | Persistent full-text search for Harness sessions |

The developer bundle currently includes both adaptations. The live source of truth is the [registry](registry.json).

## Use Treasury through Harness

~~~bash
pnpm dsh eightfold treasury list
pnpm dsh eightfold treasury search session
pnpm dsh eightfold add session-search
~~~

Work with bundles:

~~~bash
pnpm dsh eightfold bundle list
pnpm dsh eightfold bundle add developer
~~~

Update or remove an adaptation:

~~~bash
pnpm dsh eightfold update session-search
pnpm dsh eightfold remove session-search
~~~

Harness stores managed files under .eightfold/ by default. Set EIGHTFOLD_HOME to use another location. Set EIGHTFOLD_TREASURY_URL to use a different registry.

Installing an adaptation distributes it. It does not silently activate or rewrite an existing Harness profile.

## Repository model

### main

main contains the catalog and publishing infrastructure:

~~~text
eightfold-treasury/
├── registry.json
├── schemas/
│   ├── registry.schema.json
│   └── adaptation.schema.json
├── docs/
└── examples/
~~~

### adaptation/<id>

Each adaptation has an independent branch, such as:

~~~text
adaptation/hello-eightfold
adaptation/session-search
~~~

The published commit contains only that adaptation's package. A typical package includes:

~~~text
/
├── eightfold.json
├── package.json
├── README.md
└── src/
~~~

The registry records the branch for discovery and a full commit SHA for reproducible installation. Branches may move; a published commit does not.

## Installation flow

Harness:

1. Fetches and validates registry.json.
2. Resolves an adaptation or expands a bundle.
3. Resolves the pinned source commit.
4. Downloads one archive instead of cloning Treasury.
5. Validates eightfold.json, package paths, compatibility, and permissions.
6. Extracts the package into local Eightfold state.
7. Records the installed version and source commit.

This keeps installs small, auditable, and reproducible.

## Registry entry

~~~json
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
~~~

The commit is the release reference. The branch remains the development line.

## Publish an adaptation

1. Create adaptation/<id> as an adaptation-only branch.
2. Add eightfold.json and a native Harness package surface.
3. Validate the manifest against schemas/adaptation.schema.json.
4. Commit and push the branch.
5. Add the adaptation to registry.json on main.
6. Pin the registry entry to the full 40-character commit SHA.
7. Validate the registry and open a pull request.

See [Architecture](docs/architecture.md) and [Publishing](docs/publishing.md) for the complete format.

## Design principles

- **Small installs** — fetch one adaptation snapshot.
- **Reproducibility** — install exact commits.
- **Isolation** — keep adaptations independently versioned.
- **Compatibility** — use the native Harness and Cordis lifecycle.
- **Simple discovery** — expose adaptations and bundles from one registry.

## Related projects

- [Eightfold Harness](https://github.com/Eightfold-Code/eightfold-harness) — the runtime.
- [Eightfold Armoury](https://github.com/Eightfold-Code/eightfold-armoury) — the visual catalog.
