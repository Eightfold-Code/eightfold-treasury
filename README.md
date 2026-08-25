# Eightfold Treasury

Eightfold Treasury is the distribution source for Eightfold adaptations. It
publishes a small machine-readable registry of capabilities and named bundles
that Eightfold Harness can install on demand.

Treasury is intentionally **not** a second plugin runtime. Downloaded
adaptations use the native DeepSeek Harness/Cordis bundle format, so Eightfold
can activate them through the existing profile/plugin machinery.

## User flow

Discover what Treasury publishes:

```bash
dsh eightfold treasury list
dsh eightfold treasury search browser
```

Install one adaptation:

```bash
dsh eightfold add browser
```

Install it and activate it in a Harness profile:

```bash
dsh eightfold add browser --profile tui
```

Install a named collection the same way:

```bash
dsh eightfold add developer --profile tui
```

## How it works

Treasury uses a branch-per-adaptation model.

- `main` holds `registry.json`, schemas, documentation, and CI.
- Each adaptation lives on its own branch, such as `adaptation/browser`.
- A published adaptation carries an `eightfold.json` Treasury manifest and,
  when it is activatable, a native Harness `dsh.bundle` package surface.
- `registry.json` maps adaptation ids to exact source commits and can also
  define named bundles such as `developer`.

A typical adaptation branch looks like:

```text
/
├── eightfold.json
├── package.json
├── cordis.patch.yml
├── index.js
└── README.md
```

Branches may move. Stable registry entries should point at a full commit SHA so
an installation is reproducible.

## How Harness consumes it

1. Fetch and validate `registry.json`.
2. Resolve an adaptation or expand a named bundle.
3. Use the registry's pinned commit, or resolve a development branch if no pin
   exists.
4. Download only that commit's archive rather than cloning Treasury.
5. Validate archive paths and the root `eightfold.json` before writing files.
6. Extract the adaptation under the local Eightfold home and record its source
   commit and permissions.
7. When `--profile` is supplied, pass the downloaded package to the existing
   `dsh plugin` profile manager, which owns pnpm state and
   `dsh.profile.bundles`.

This keeps Treasury lightweight while preserving DeepSeek Harness's native
plugin lifecycle.

## Publishing

1. Create an adaptation branch.
2. Add the Treasury manifest and native Harness bundle package files.
3. Commit and push the branch.
4. Add or update the entry in `registry.json` on `main` using the full commit
   SHA.
5. Validate the registry and manifest, then merge the registry change.

See [`docs/publishing.md`](docs/publishing.md) for the exact package and manifest
format.

## Main-branch layout

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
