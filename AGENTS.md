# factory47 — agent notes

## What this is
A cozy fireplace web app: a full-screen canvas particle-flame animation with looping
royalty-free fireplace sound. Served by a **standard-library-only** Python HTTP server
(no pip dependencies, no Flask).

## Running
- `python -m factory47` starts the server (`factory47/main.py` -> `factory47.server.serve`).
- It serves static files from `factory47/web/` on port 3000 (configurable via `PORT`).
- In the Base44 sandbox: `docker compose -f docker-compose.base44.yml up -d --build`.
  The compose uses `python:3.12-slim` with the repo bind-mounted, so HTML/CSS/JS edits
  appear on browser refresh with no rebuild. There is no HMR — call `reload_preview`
  after changes if needed.

## Assets
- `factory47/web/fireplace.wav` is a **generated** royalty-free crackling-fire loop
  (~20s). Regenerate with a stdlib `wave`/`struct` script if it ever needs replacing;
  do not assume it came from a third party.

## Tests
- `tests/test_main.py` only covers `greet()`. The web server is not unit-tested.
- Verify the app live: `curl http://localhost:3000/` returns `index.html`.

## Conventions
- Keep the server stdlib-only; do not introduce pip dependencies for the web layer.
- `greet()` is intentionally left intact — do not remove it.
