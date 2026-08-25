# Eightfold Treasury architecture

Treasury is a distribution source for Eightfold adaptations. It is a
lightweight registry repository, not an application and not a framework.

## Registry model

`registry.json` on the `main` branch is the machine-readable catalog. It
lists every published adaptation and its metadata:

- name and description
- version
- source repository and branch
- entry file
- harness compatibility

The registry is validated against `schemas/registry.schema.json`. A new
`schemaVersion` is required only for breaking changes. Bundles can be added
later as a new top-level key without changing the adaptation entries.

## Branch model

Each adaptation lives on its own branch, named `adaptation/<name>`.

```text
main

adaptation/browser
adaptation/github
adaptation/hello-eightfold
```

Each adaptation branch is an orphan branch. An orphan branch has no parent
and shares no history with any other branch. It contains only the files the
adaptation needs:

```text
/
├── eightfold.json
├── package.json
├── README.md
└── src/
    └── index.ts
```

This makes each branch behave like a small, downloadable package. It avoids a
branch that carries the full history and files of every other adaptation.

## Version pinning

Branches are mutable. They represent the active development line, not a
canonical version.

A published version maps to a commit SHA, not to a branch name. The registry
entry records the branch for discovery and an optional pinned `commit` for
installation.

```json
{
  "version": "1.2.0",
  "source": {
    "repository": "Eightfold-Code/eightfold-treasury",
    "branch": "adaptation/browser",
    "commit": "abc123..."
  }
}
```

Pinning by commit makes every install reproducible. Installing from a moving
branch could deliver different code at different times.

## Transport

The harness must not clone the entire Treasury repository to install one
adaptation. The preferred transport is a GitHub archive, tarball, or zip of a
specific commit.

```text
https://github.com/Eightfold-Code/eightfold-treasury/archive/<commit>.tar.gz
```

Archives are cheap, immutable, and scoped to one snapshot. Cloning the whole
repository pulls history and files the user never needs, and it couples
installation to the local Git state.

## Evolution

The registry format is designed to stay easy to evolve. New adaptation
fields, bundles, and permission types do not require a breaking rewrite of
the registry format. Breaking changes bump `schemaVersion` in `registry.json`
and in both schemas.
