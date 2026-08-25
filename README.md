# Eightfold Treasury

Eightfold Treasury is the distribution source for Eightfold adaptations. It
publishes a machine-readable registry of installable capabilities.

Eightfold Harness consumes the registry to discover, download, validate, and
install adaptations.

## How it works

Treasury uses a branch-per-adaptation model.

- `main` holds the registry, schemas, documentation, and examples.
- Each adaptation lives on its own orphan branch, such as
  `adaptation/browser`.
- Each branch contains only the files the adaptation needs: an
  `eightfold.json` manifest, a `package.json`, a `README.md`, and source files.
- `registry.json` lists every published adaptation and points at its branch.

Branches are mutable. For reproducible installs, versions resolve to a pinned
commit SHA, not to a moving branch. See `docs/architecture.md`.

## Publish an adaptation

1. Create an orphan branch for the adaptation.
2. Add the `eightfold.json` manifest and the adaptation files.
3. Push the branch.
4. Update `registry.json` on `main` with the new entry.
5. Open a pull request.

See `docs/publishing.md` for the full steps.

## How the harness consumes it

1. Read `registry.json`.
2. Resolve an adaptation to a pinned commit.
3. Download a tarball or archive of that commit.
4. Validate the `eightfold.json` manifest.
5. Install dependencies.
6. Register the adaptation.

The harness prefers archives over cloning the whole repository. See
`docs/architecture.md`.

## Layout

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
