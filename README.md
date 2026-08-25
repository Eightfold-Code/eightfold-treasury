# Session Search

`session-search` enables persistent full-text session search for an Eightfold
Harness profile.

DeepSeek Harness already mounts `@deepseek-ai/dsh-session-query-sqlite` in the
base bundle, but deliberately configures it with `openAt: never`. This
adaptation changes only that configuration:

- the SQLite index is opened lazily on the first full-text search;
- the index is persisted under `$DSH_HOME/session-search.sqlite`;
- the existing Harness search implementation remains responsible for indexing
  and queries.

No second search engine or runtime dependency is installed.

## Install

```sh
dsh eightfold add session-search --profile tui
```

The same adaptation can be activated in another profile by installing it there
as well.

## Permission

The adaptation declares the `filesystem` permission because it creates and
updates the persistent SQLite index under the Harness home.

## Native bundle patch

```yaml
- id: session-query-sqlite
  config:
    path: !!js dshHomePath('session-search.sqlite')
    openAt: first-search
```

Harness patch layers replace a row's complete `config`, so the adaptation
restates both values rather than trying to deep-merge one key.
