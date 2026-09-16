#!/usr/bin/env bash
# Generates hero background clips from the existing brand stills.
#
# The hero rotates several clips, so each one gets a distinct camera move
# (slow zoom, lateral pan, diagonal drift, zoom-out) to avoid the loop reading
# as the same shot over and over. Stills are upscaled before the move so the
# Ken Burns crop stays sharp at 1280x720, then a matching poster frame is
# exported for the video's poster attribute.
#
# Usage: scripts/make-hero-videos.sh
set -u

FF="${FFMPEG:-/tmp/ffm/node_modules/ffmpeg-static/ffmpeg}"
OUT="public/videos"
SRC="public/images/benifex"
SECONDS_PER_CLIP=10
FPS=25
FRAMES=$((SECONDS_PER_CLIP * FPS))

mkdir -p "$OUT"

# Zoom in, anchored centre.
kb_zoom_in="z='min(zoom+0.0006,1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
# Slow horizontal sweep, held at a gentle zoom.
kb_pan_right="z='1.12':x='(iw-iw/zoom)*(on/($FRAMES-1))':y='ih/2-(ih/zoom/2)'"
kb_pan_left="z='1.12':x='(iw-iw/zoom)*(1-on/($FRAMES-1))':y='ih/2-(ih/zoom/2)'"
# Diagonal drift, for a different rhythm to the straight pans.
kb_diagonal="z='min(zoom+0.0004,1.14)':x='(iw-iw/zoom)*(on/($FRAMES-1))':y='(ih-ih/zoom)*(on/($FRAMES-1))'"
# Zoom out, revealing the frame.
kb_zoom_out="z='max(1.15-0.0006*on,1.0)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"

make_clip() {
  name="$1"; img="$2"; move="$3"
  src="$SRC/$img"
  if [ ! -f "$src" ]; then
    echo "missing source: $src" >&2
    return 1
  fi
  echo "  building $name.mp4 from $img"
  "$FF" -hide_banner -loglevel error -y -loop 1 -i "$src" \
    -filter_complex "scale=2560:-2:flags=lanczos,zoompan=$move:d=$FRAMES:s=1280x720:fps=$FPS,format=yuv420p" \
    -t "$SECONDS_PER_CLIP" -c:v libx264 -preset medium -crf 24 -movflags +faststart -an \
    "$OUT/$name.mp4" || return 1

  # Poster: a frame from partway in, so the still already shows the move.
  "$FF" -hide_banner -loglevel error -y -ss 3 -i "$OUT/$name.mp4" -frames:v 1 -q:v 4 \
    "$OUT/$name-poster.jpg" || return 1
  return 0
}

echo "Generating hero clips:"
make_clip hero-safari      africa/kenya.jpg               "$kb_zoom_in"
make_clip hero-lagos       africa/nigeria.jpg             "$kb_pan_right"
make_clip hero-marrakech   africa/morocco.jpg             "$kb_pan_left"
make_clip hero-dining      cat/food-dining.jpg            "$kb_diagonal"
make_clip hero-stays       cat/hotels-hospitality.jpg     "$kb_zoom_out"
make_clip hero-wellness    cat/fitness-sports.jpg         "$kb_zoom_in"
make_clip hero-travel      cat/travel-holidays.jpg        "$kb_pan_right"
make_clip hero-retail      cat/shopping-retail.jpg        "$kb_diagonal"

echo
echo "Done. Clips in $OUT:"
ls -la "$OUT" | grep -E "mp4|poster" | awk '{print "  " $9 "  " int($5/1024) "KB"}'