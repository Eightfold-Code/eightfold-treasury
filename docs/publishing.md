# Publishing an adaptation

This page explains how a maintainer publishes an adaptation in Eightfold
Treasury.

Keep each adaptation small and focused. An adaptation intended for activation
inside Eightfold Harness must be both:

1. an **Eightfold adaptation**, described by `eightfold.json`; and
2. a **native DeepSeek Harness bundle**, described by `package.json` with a
   `dsh.bundle` patch.

Treasury is a distribution layer, not a second plugin runtime. Reusing the
Harness bundle/profile mechanism keeps downloaded adaptations compatible with
the existing Cordis loader and `dsh plugin` tooling.

## 1. Create an orphan branch

An orphan branch carries only the adaptation files and does not inherit the
Treasury `main` tree.

```bash
git checkout --orphan adaptation/browser
git rm -rf .
```

## 2. Add the Eightfold manifest

Create `eightfold.json` at the branch root.

```json
{
  "schemaVersion": 1,
  "id": "browser",
  "name": "Browser",
  "version": "0.1.0",
  "description": "Browser interaction capability for Eightfold.",
  "entry": "./index.js",
  "compatibility": {
    "harness": ">=0.1.0"
  },
  "permissions": [
    "network"
  ],
  "dependencies": []
}
```

The manifest describes Treasury-facing identity, compatibility, requested
permissions, dependencies, and the package entry point.

## 3. Make it a native Harness bundle

Create `package.json`:

```json
{
  "name": "eightfold-browser",
  "version": "0.1.0",
  "type": "module",
  "main": "index.js",
  "files": [
    "index.js",
    "cordis.patch.yml",
    "eightfold.json"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  }
}
```

Create the Cordis/Harness patch:

```yaml
- insert:
    - id: eightfold-browser
      name: eightfold-browser
```

Then provide the module named by the package manifest, for example `index.js`:

```js
export const name = 'eightfold-browser'

export function apply(ctx) {
  // Register the adaptation with the ordinary Cordis/Harness APIs.
}
```

The package name used by `cordis.patch.yml` must resolve from the profile after
`dsh plugin` installs or links the downloaded adaptation package.

A library-only Treasury artifact may omit `dsh.bundle`, but it cannot be
activated as a Harness profile layer and should not be presented as an
ordinary end-user adaptation.

## 4. Validate the branch

Validate the Eightfold manifest against `schemas/adaptation.schema.json` from
Treasury `main`.

```bash
python3 -m jsonschema -i eightfold.json schemas/adaptation.schema.json
```

The expected branch layout is intentionally small:

```text
/
├── eightfold.json
├── package.json
├── cordis.patch.yml
├── index.js
└── README.md
```

## 5. Commit and push the branch

```bash
git add .
git commit -m "feat: add browser adaptation"
git push -u origin adaptation/browser
```

Record the resulting full 40-character commit SHA.

## 6. Update the registry

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
      "entry": "index.js",
      "compatibility": {
        "eightfoldHarness": ">=0.1.0"
      }
    }
  }
}
```

`source.commit` is the release. The branch may continue moving, but users who
install this registry version receive the exact pinned commit.

Keep the registry descriptor synchronized with `eightfold.json`, especially:

- adaptation id;
- version;
- entry point;
- Harness compatibility.

Validate the registry:

```bash
python3 -m jsonschema -i registry.json schemas/registry.schema.json
```

## 7. Optional: publish a bundle

Treasury bundles are named collections of adaptation ids, not separate plugin
packages.

```json
{
  "bundles": {
    "developer": [
      "browser",
      "github",
      "filesystem"
    ]
  }
}
```

The Harness resolves each member through the normal adaptation installer and
can activate every member in the same profile.

## 8. Test the user path

The intended user experience is:

```bash
dsh eightfold treasury list
dsh eightfold add browser --profile tui
```

For a collection:

```bash
dsh eightfold add developer --profile tui
```

The first command discovers the pinned adaptation. The second downloads and
validates it under the Eightfold home, then delegates activation to the native
`dsh plugin` profile reconciler.

## 9. Open a pull request

Open a pull request against `main`. CI should validate the registry and
manifests, verify referenced branches and pins, and reject a registry entry that
cannot be reproduced from its declared source.

After the pull request merges, the adaptation is published.
