"""Minimal HTTP server so the project can be previewed in a browser."""

from http.server import BaseHTTPRequestHandler, HTTPServer

from factory47.main import greet


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        message = greet("preview")
        body = (
            "<!doctype html><html><head><meta charset='utf-8'>"
            "<title>factory47</title>"
            "<style>"
            "body{display:flex;align-items:center;justify-content:center;"
            "min-height:100vh;margin:0;font-family:system-ui,sans-serif;"
            "color:#f1f5f9;overflow:hidden}"
            ".bg{position:fixed;inset:0;z-index:-1;"
            "background:linear-gradient(-45deg,#0f172a,#1e3a8a,#7c3aed,#0f172a);"
            "background-size:400% 400%;"
            "animation:gradient 12s ease infinite}"
            "@keyframes gradient{0%{background-position:0% 50%}"
            "50%{background-position:100% 50%}100%{background-position:0% 50%}}"
            "h1{font-size:2rem;font-weight:600;position:relative;z-index:1}"
            "</style></head>"
            f"<body><div class='bg'></div><h1>{message}</h1></body></html>"
            f"<body><h1>{message}</h1></body></html>"
        ).encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        pass


def serve(port: int = 3000) -> None:
    server = HTTPServer(("0.0.0.0", port), Handler)
    print(f"factory47 serving on http://0.0.0.0:{port}")
    server.serve_forever()


if __name__ == "__main__":
    serve()
