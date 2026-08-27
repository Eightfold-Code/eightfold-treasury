# Embedded Container Runtime UI

## Goal

Make Docker-style container workflows available directly inside Eightfold Harness without requiring Docker Desktop.

## Runtime concept

- On Windows, provision/manage an Eightfold-owned WSL2 environment.
- Run Moby/dockerd + containerd + BuildKit inside it.
- Expose the standard Docker API/socket so existing Docker-compatible tooling keeps working.
- Detect and optionally use an existing Docker Desktop/local/remote Docker backend instead.
- Keep the Harness UI independent from the runtime backend.

## Harness UI

Add a native Runtime section with:

- Engine status, backend, versions, WSL status, resource limits, restart controls
- Containers: start/stop/restart/delete, ports, CPU/RAM, env, mounts, shell, logs
- Compose/Stacks: discovered compose projects, up/down/rebuild
- Images: pull/remove/build, tags, size
- Volumes
- Networks
- BuildKit/build history/cache controls
- Resource usage and disk usage
- Engine and per-container logs
- Settings: autostart, limits, disk location, cleanup, socket/API configuration

## Agent isolation

Harness agents can use the same runtime for isolated workspaces:

- Dedicated workspace container per agent/session when needed
- Isolated networking
- CPU/RAM limits
- Temporary filesystems
- UI affordances for terminal, logs, ports, files and destroy

## Suggested architecture

Eightfold Runtime API

- Embedded Moby / WSL2
- Docker Desktop
- Local Docker Engine
- Remote Docker host

The goal is for the user experience to be: install Eightfold Harness, open it, and containers work without a separate Docker Desktop workflow.
