#!/usr/bin/env python3
"""Launch the packaged app using only Python's standard library."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from pathlib import Path
import sys, webbrowser
root=Path(__file__).resolve().parent/'app'
if not (root/'index.html').is_file():
    sys.exit('App files are missing. Extract the whole ZIP before starting.')
class Handler(SimpleHTTPRequestHandler):
    extensions_map={**SimpleHTTPRequestHandler.extensions_map,'.mjs':'text/javascript','.webmanifest':'application/manifest+json'}
    def end_headers(self):
        self.send_header('X-Content-Type-Options','nosniff')
        self.send_header('Cache-Control','no-cache')
        super().end_headers()
try:
    with ThreadingHTTPServer(('127.0.0.1',4173),partial(Handler,directory=str(root))) as server:
        url='http://127.0.0.1:4173'
        print(f'Due Diligence is running: {url}\nKeep this window open. Press Ctrl+C to stop.\nExport JSON to back up your cases.',flush=True)
        if '--no-browser' not in sys.argv: webbrowser.open(url)
        try: server.serve_forever()
        except KeyboardInterrupt: pass
except OSError as error:
    sys.exit(f'Cannot open port 4173: {error}. Close another running copy and retry.')
