#!/bin/bash
#
# optimize-images.sh
#
# Konvertiert alle "slider.*"-Bilder und alle Bilder in "gallery"-Ordnern
# im Portfolio-Repo zu WebP: max. 1800px lange Kante, Qualität 80,
# ohne Metadaten. Originale werden NICHT gelöscht, sondern nach
# "originals_backup/" (gleiche Ordnerstruktur) verschoben.
#
# Nutzung:
#   1. Dieses Skript ins Repo-Hauptverzeichnis legen
#      (/Users/delianiederberger/Documents/GitHub/portfolio)
#   2. chmod +x optimize-images.sh
#   3. ./optimize-images.sh
#
# Danach: Referenzen in data.js/projects.json und im HTML/CSS,
# die noch auf .png/.jpg zeigen, manuell auf .webp anpassen
# (das Skript listet am Ende alle konvertierten Dateien auf).

set -euo pipefail

MAX_DIM=1800
QUALITY=80
BACKUP_DIR="originals_backup"

# Nur ausführen, wenn man im Repo-Root ist (grobe Prüfung)
if [ ! -d "assets" ]; then
  echo "⚠️  Kein 'assets'-Ordner hier gefunden."
  echo "   Bitte dieses Skript im Repo-Hauptverzeichnis ausführen:"
  echo "   /Users/delianiederberger/Documents/GitHub/portfolio"
  exit 1
fi

mkdir -p "$BACKUP_DIR"

total_before=0
total_after=0
count=0
converted_list=()

convert_one() {
  local src="$1"
  local dir base name ext ext_lower webp_path backup_path size_before size_after

  dir="$(dirname "$src")"
  base="$(basename "$src")"
  name="${base%.*}"
  ext="${base##*.}"
  ext_lower="$(printf '%s' "$ext" | tr '[:upper:]' '[:lower:]')"
  webp_path="${dir}/${name}.webp"

  # Nur png/jpg/jpeg anfassen, alles andere überspringen
  case "$ext_lower" in
    png|jpg|jpeg) ;;
    *) return ;;
  esac

  # Schon konvertiert? Überspringen.
  if [ -f "$webp_path" ]; then
    echo "⏭  Übersprungen (WebP existiert schon): $src"
    return
  fi

  size_before=$(stat -f%z "$src")

  cwebp -quiet -metadata none -q "$QUALITY" -resize "$MAX_DIM" 0 "$src" -o "$webp_path"

  # Falls Bild schmaler als MAX_DIM ist, -resize mit 0-Höhe funktioniert
  # trotzdem korrekt (cwebp skaliert nur runter, nie hoch, wenn Ziel > Original
  # würde es hochskalieren – daher zusätzlicher Check):
  # (cwebp skaliert leider auch hoch; wir korrigieren das hier ab)
  orig_w=$(sips -g pixelWidth "$src" | awk '/pixelWidth/{print $2}')
  orig_h=$(sips -g pixelHeight "$src" | awk '/pixelHeight/{print $2}')
  longer=$(( orig_w > orig_h ? orig_w : orig_h ))
  if [ "$longer" -le "$MAX_DIM" ]; then
    cwebp -quiet -metadata none -q "$QUALITY" "$src" -o "$webp_path"
  fi

  size_after=$(stat -f%z "$webp_path")

  # Original sichern (Ordnerstruktur beibehalten)
  backup_path="${BACKUP_DIR}/${src}"
  mkdir -p "$(dirname "$backup_path")"
  mv "$src" "$backup_path"

  total_before=$((total_before + size_before))
  total_after=$((total_after + size_after))
  count=$((count + 1))
  converted_list+=("$src -> $webp_path")

  printf "✅ %s  (%.1f MB -> %.1f MB)\n" "$src" \
    "$(echo "$size_before / 1048576" | bc -l)" \
    "$(echo "$size_after / 1048576" | bc -l)"
}

echo "🔍 Suche slider.* und gallery-Bilder ..."
echo ""

# 1. Alle slider.png / slider.jpg / slider.jpeg
while IFS= read -r -d '' f; do
  convert_one "$f"
done < <(find . -type f \( -iname "slider.png" -o -iname "slider.jpg" -o -iname "slider.jpeg" \) \
  -not -path "./$BACKUP_DIR/*" -not -path "./.git/*" -print0)

# 2. Alle Bilder in Ordnern, die "gallery" heissen
while IFS= read -r -d '' f; do
  convert_one "$f"
done < <(find . -type d -iname "gallery" -not -path "./$BACKUP_DIR/*" -not -path "./.git/*" \
  -exec find {} -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) \; | \
  sed 's/^/.\//' | tr '\n' '\0' 2>/dev/null || true)

echo ""
echo "──────────────────────────────"
echo "Fertig: $count Bild(er) konvertiert."
if [ "$count" -gt 0 ]; then
  printf "Gesamt vorher: %.1f MB\n" "$(echo "$total_before / 1048576" | bc -l)"
  printf "Gesamt nachher: %.1f MB\n" "$(echo "$total_after / 1048576" | bc -l)"
  echo ""
  echo "Konvertierte Dateien (Referenzen im Code anpassen, z. B. data.js/projects.json):"
  for line in "${converted_list[@]}"; do
    echo "  $line"
  done
  echo ""
  echo "Originale liegen zur Sicherheit in: $BACKUP_DIR/"
  echo "Wenn alles läuft und die Website getestet ist, kannst du diesen Ordner löschen"
  echo "oder aus dem Git-Repo ausschliessen (.gitignore)."
fi
