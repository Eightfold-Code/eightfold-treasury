# Publishing an adaptation

This page explains how a maintainer publishes an adaptation in Eightfold
Treasury.

Follow the house writing standards in `AGENTS.md`. Keep each adaptation small
and focused.

## 1. Create an orphan branch

An orphan branch carries no history and only the adaptation files. Create it
from `main`.

```bash
git checkout --orphan adaptation/browser
git rm -rf .
```

## 2. Add the manifest and files

Create `eightfold.json` at the branch root.

```json
{
  "schemaVersion": 1,
  "id": "browser",
  "name": "Browser",
  "version": "0.1.0",
  "description": "Browser interaction capability for Eightfold.",
  "entry": "./src/index.ts",
  "compatibility": {
    "harness": ">=0.1.0"
  },
  "permissions": [
    "network"
  ],
  "dependencies": []
}
```

Validate the manifest against the adaptation schema.

```bash
python3 -m jsonschema -i eightfold.json schemas/adaptation.schema.json
```

Add the adaptation files: `package.json`, `README.md`, and `src/index.ts`.
Keep only these files on the branch.

## 3. Commit and push the branch

```bash
git add .
git commit -m "feat: add browser adaptation"
git push -u origin adaptation/browser
```

## 4. Update the registry

On `main`, add an entry to `registry.json`.

```json
{
  "schemaVersion": 1,
  "adaptations": {
    "browser": {
      "name": "Browser",
      "description": "Browser interaction capability for Eightfold.",
      "version": "0.1.0",
      "source": {
        "repository": "Eightfold-Code/eightfold-treasury",
        "branch": "adaptation/browser",
        "commit": "<full commit sha>"
      },
      "entry": "index.ts",
      "compatibility": {
        "eightfoldHarness": ">=0.1.0"
      }
    }
  }
}
```

Record the full commit SHA of the adaptation branch in `source.commit`. The
registry resolves each version to that pinned commit, so installs stay
reproducible.

Validate the registry.

```bash
python3 -m jsonschema -i registry.json schemas/registry.schema.json
```

## 5. Open a pull request

Open a pull request against `main`. CI validates the registry and the
manifest against the schemas, and checks that every referenced branch exists
on `origin`.

After the pull request merges, the adaptation is published.
