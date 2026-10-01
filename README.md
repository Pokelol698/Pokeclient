# Poke Client

Poke Client is a Tauri 2 desktop launcher UI for Minecraft. This repository is set up to build Windows, Linux and macOS bundles automatically with GitHub Actions.

## Current build

- Poke Client launcher UI
- Home, Mods, Profiles, Servers and Settings pages
- Local persistence for selected profile and launcher settings
- Native minimize/close controls
- Tauri 2 desktop configuration and permissions
- GitHub Actions builds for Windows x64, Linux x64, macOS Intel and Apple Silicon
- Microsoft sign-in is deliberately not faked: the real OAuth flow needs a registered Microsoft/Xbox/Minecraft application and its client ID/redirect configuration

## Build locally

Requirements: Node.js 22+, Rust stable and the Tauri system dependencies for your OS.

```bash
npm install
npm run tauri dev
```

Create a release bundle:

```bash
npm run tauri build
```

## GitHub build

Upload the repository to GitHub, push to `main` or `master`, then open **Actions**. The workflow builds platform-specific artifacts automatically. It can also be started manually with **Run workflow**.

## Important

Do not put Microsoft client secrets in this repository. The next backend step should use an OAuth authorization-code flow with PKCE and keep tokens in the OS credential store.
