#!/bin/sh
# Pre-publish sanity check. Run from the project root:  sh check.sh
#
# Catches the things that break the live site but still "look fine" in a
# quick glance — above all a syntax error inside a page's component script,
# which silently kills every dynamic element on that page (the project list,
# interactive modules) while the static markup still renders.

set -u
fail=0
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

echo "1. component scripts parse"
python3 - "$tmp" <<'PY'
import re, glob, os, sys
out = sys.argv[1]
for f in sorted(glob.glob("*.html")):
    src = open(f, encoding="utf8").read()
    m = re.search(r'<script type="text/x-dc" data-dc-script[^>]*>(.*?)</script>', src, re.S)
    if m:
        open(os.path.join(out, f + ".js"), "w", encoding="utf8").write(m.group(1))
PY
for f in "$tmp"/*.js; do
  [ -e "$f" ] || continue
  if node --check "$f" >/dev/null 2>&1; then
    printf '   ok    %s\n' "$(basename "$f" .js)"
  else
    printf '   FAIL  %s -- %s\n' "$(basename "$f" .js)" \
      "$(node --check "$f" 2>&1 | grep -m1 SyntaxError)"
    fail=1
  fi
done

echo "2. referenced assets exist"
missing=$(grep -ho 'assets/[A-Za-z0-9/_.-]*\.\(webp\|jpg\|png\|svg\)' ./*.html ./*.js 2>/dev/null \
  | sort -u | while read -r a; do [ -f "$a" ] || echo "$a"; done)
if [ -n "$missing" ]; then echo "$missing" | sed 's/^/   MISSING /'; fail=1; else echo "   ok    all present"; fi

echo "3. internal page links resolve"
broken=$(grep -ho 'href="[a-z0-9-]*\.html"' ./*.html 2>/dev/null | sed 's/href="//;s/"//' \
  | sort -u | while read -r p; do [ -f "$p" ] || echo "$p"; done)
if [ -n "$broken" ]; then echo "$broken" | sed 's/^/   BROKEN /'; fail=1; else echo "   ok    all resolve"; fi

echo "4. every page has its head essentials"
for p in *.html; do
  case "$p" in 404.html) continue;; esac
  grep -q 'http-equiv="refresh"' "$p" && continue   # skip redirect stubs
  for need in 'lang="en"' 'site.css' 'og:image' 'viewport'; do
    grep -q "$need" "$p" || { printf '   FAIL  %s missing %s\n' "$p" "$need"; fail=1; }
  done
done
[ "$fail" -eq 0 ] && echo "   ok    all pages"

echo
if [ "$fail" -eq 0 ]; then echo "PASS — safe to publish"; else echo "FAILED — do not publish"; fi
exit "$fail"
