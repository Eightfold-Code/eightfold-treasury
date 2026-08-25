# Hello Eightfold

A minimal Eightfold adaptation that proves the Treasury flow all the way from
registry discovery to native DeepSeek Harness/Cordis plugin activation.

## Behavior

The package exports `eightfoldHello`, which takes a name and returns a greeting.
It also declares a native `dsh.bundle` and ships a `cordis.patch.yml`, so an
installed Treasury adaptation can be linked into any Harness profile through
the existing `dsh plugin` mechanism rather than a second Eightfold-specific
loader.

Input:

```json
{ "name": "Dino" }
```

Output:

```text
Hello Dino from Eightfold.
```

## Layout

```text
/
├── eightfold.json
├── package.json
├── cordis.patch.yml
├── index.js
└── README.md
```

`eightfold.json` is the Treasury manifest. `package.json` and
`cordis.patch.yml` are the native Harness bundle surface.
