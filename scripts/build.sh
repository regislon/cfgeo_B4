#!/usr/bin/env bash
# Construit le site (MkDocs) et les slides (Marp) dans site/.
# Usage : scripts/build.sh          build complet
#         scripts/build.sh --serve  assemble le contenu puis lance mkdocs serve
set -euo pipefail

cd "$(dirname "$0")/.."

MARP_VERSION="4.5.1"
CONTENT=(README.md formats-interfaces assets)

# 1. Assemblage du contenu dans build/docs (MkDocs refuse docs_dir: .)
rm -rf build/docs
mkdir -p build/docs
cp -R "${CONTENT[@]}" build/docs/

if [[ "${1:-}" == "--serve" ]]; then
  exec mkdocs serve
fi

# 2. Site MkDocs
mkdocs build --clean

# 3. Slides Marp : chaque slides.md -> slides.html et slides.pdf à côté du README du chapitre
for src in formats-interfaces/*/slides.md; do
  out="site/${src%.md}"
  mkdir -p "$(dirname "$out")"
  npx --yes "@marp-team/marp-cli@${MARP_VERSION}" \
    "$src" -o "$out.html" --html --theme-set marp/theme.css < /dev/null
  # Liens des slides (démos, cours, exercices) : ouverture dans un nouvel onglet,
  # sauf les ancres internes à la présentation (href="#…")
  perl -pi -e 's/<a (?![^>]*\btarget=)(?=[^>]*\bhref="(?!#))/<a target="_blank" rel="noopener" /g' "$out.html"
  # --allow-local-files : le navigateur qui produit le PDF doit lire les images du chapitre
  npx --yes "@marp-team/marp-cli@${MARP_VERSION}" \
    "$src" -o "$out.pdf" --pdf --allow-local-files --html --theme-set marp/theme.css < /dev/null
done

# 4. Données des exercices : un zip par exercice
for dir in formats-interfaces/exercices/*/donnees; do
  ex="$(dirname "$dir")"
  (cd "$dir" && zip -qr -X "$OLDPWD/site/$ex/donnees.zip" . -x ".DS_Store")
done

echo "Site construit dans site/"
