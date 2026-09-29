# factory47

## Overview
Minimal Python project with a `greet()` function in `factory47/main.py`. No external dependencies — pure stdlib.

## Running in Base44
- `docker compose -f docker-compose.base44.yml up -d` starts a Python 3.12 container serving a simple HTML page on port 3000 via `factory47/server.py`.
- The server is a stdlib `http.server` wrapper around `greet()` — no web framework needed.
- Source is bind-mounted, so edits to `factory47/` are picked up by restarting the container.

## Tests
```bash
python3 -m unittest
```

## No external secrets required
The project has no external service dependencies.
