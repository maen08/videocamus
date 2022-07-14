#!/bin/sh

hypercorn "camus/vidoco:create_app()" --log-file - --bind 0.0.0.0:5000

# hypercorn camus.vidoco:app  --workers=3 --bind 0.0.0.0:5000 