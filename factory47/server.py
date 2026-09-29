"""Minimal stdlib HTTP server for the cozy fireplace web app."""

import functools
import http.server
import os

WEB_DIR = os.path.join(os.path.dirname(__file__), "web")
PORT = int(os.environ.get("PORT", "3000"))


def serve(port: int | None = None) -> None:
    """Serve the static fireplace web app from ``factory47/web``."""
    port = PORT if port is None else port
    handler = functools.partial(
        http.server.SimpleHTTPRequestHandler, directory=WEB_DIR
    )
    with http.server.ThreadingHTTPServer(("0.0.0.0", port), handler) as httpd:
        print(f"Cozy fireplace web app serving on http://0.0.0.0:{port}")
        httpd.serve_forever()


if __name__ == "__main__":
    serve()
