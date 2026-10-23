#!/usr/bin/env bash
# Bouwt een map met de site van elke branch, voor GitHub Pages:
#   /                    -> main
#   /branches/           -> overzicht van alle branches
#   /branches/<naam>/    -> de site van die branch
# Gebruik: bouw-previews.sh <uitvoermap>
set -euo pipefail

uit="$1"
rm -rf "$uit"
mkdir -p "$uit/branches"

# Previews mogen niet in Google komen (de echte site is boterzout.nl)
geen_index() {
  find "$1" -name '*.html' -exec sed -i \
    's#<head>#<head>\n    <meta name="robots" content="noindex, nofollow" />#' {} +
}

# Zet de bestanden van een branch in een map, zonder repo-bestanden
pak_uit() {
  mkdir -p "$2"
  git archive "origin/$1" | tar -x -C "$2"
  rm -rf "$2/.github" "$2/.idea" "$2/.htaccess" "$2/CLAUDE.md"
  geen_index "$2"
}

pak_uit main "$uit"

rijen=""
while IFS='|' read -r branch datum onderwerp; do
  case "$branch" in HEAD | gh-pages | "") continue ;; esac
  if [ "$branch" = "main" ]; then
    link="../"
  else
    map=$(printf '%s' "$branch" | sed 's#[^A-Za-z0-9._-]#-#g')
    pak_uit "$branch" "$uit/branches/$map"
    link="$map/"
  fi
  onderwerp=$(printf '%s' "$onderwerp" | sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g')
  rijen="$rijen        <li><a href=\"$link\">$branch</a><span>$datum &middot; $onderwerp</span></li>
"
done < <(git for-each-ref --sort=-committerdate \
  --format='%(refname:lstrip=3)|%(committerdate:short)|%(contents:subject)' refs/remotes/origin)

cat > "$uit/branches/index.html" <<HTML
<!DOCTYPE html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Boter + Zout | branches</title>
    <style>
      body { margin: 0; padding: 3rem 1rem; background: #faf3e0; color: #85301c;
             font-family: Georgia, serif; }
      main { max-width: 40rem; margin: 0 auto; }
      h1 { font-weight: normal; }
      ul { list-style: none; padding: 0; }
      li { padding: 0.8rem 0; border-bottom: 1px solid #f5e3b3; }
      a { color: #59a0e5; font-size: 1.2rem; }
      span { display: block; font-size: 0.9rem; margin-top: 0.2rem; }
    </style>
  </head>
  <body>
    <main>
      <h1>boter + zout &mdash; branches</h1>
      <ul>
$rijen      </ul>
    </main>
  </body>
</html>
HTML

touch "$uit/.nojekyll"
