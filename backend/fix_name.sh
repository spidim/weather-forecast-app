#!/bin/sh
# This script is used during development to properly rename the swagger
# generated module. It must run right after the swagger generation step

mv swagger_server backend_server || echo 'Module directory not found'
find . -type f \( -iname '*.py' -o -iname '*.yaml' -o -iname '*.md' -o -iname \
    'Dockerfile' \) -print0 | xargs -0 sed -i.tmpbak 's/swagger_server/backend_server/g'
find . -type f -iname '*.tmpbak' -exec rm {} \;
