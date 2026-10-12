#!/usr/bin/env bash
# Construit le site (MkDocs) et les slides (Marp) dans site/.
# Usage : scripts/build.sh          build complet
#         scripts/build.sh --serve  assemble le contenu puis lance mkdocs serve
set -euo pipefail

cd "$(dirname "$0")/.."

MARP_VERSION="4.5.1"
CONTENT=(README.md formats-interfaces)

# 1. Assemblage du contenu dans build/docs (MkDocs refuse docs_dir: .)
rm -rf build/docs
mkdir -p build/docs
cp -R "${CONTENT[@]}" build/docs/

if [[ "${1:-}" == "--serve" ]]; then
  exec mkdocs serve
fi

# 2. Site MkDocs
mkdocs build --clean

# 3. Slides Marp : chaque slides.md -> slides.html à côté du README du chapitre
for src in formats-interfaces/*/slides.md; do
  out="site/${src%.md}.html"
  mkdir -p "$(dirname "$out")"
  npx --yes "@marp-team/marp-cli@${MARP_VERSION}" \
    "$src" -o "$out" --html --theme-set marp/theme.css < /dev/null
done

echo "Site construit dans site/"
