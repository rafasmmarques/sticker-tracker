# AGENTS.local.md Example

Use this file as a template for machine-specific agent instructions.

This file can include local paths, shell preferences, Node version managers, or command wrappers that should not be committed. Copy it to `AGENTS.local.md` and adjust it for your machine.

Example for Windows with WSL:

```bash
wsl -e bash -lc "source ~/.nvm/nvm.sh && cd /path/to/your/sticker-tracker && nvm use --silent && npm run build"
wsl -e bash -lc "source ~/.nvm/nvm.sh && cd /path/to/your/sticker-tracker && nvm use --silent && npm run lint"
```
