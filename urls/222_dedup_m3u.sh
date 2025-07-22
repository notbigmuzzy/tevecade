#!/bin/bash
# dedup_m3u.sh - Remove duplicate tvg-id entries from an M3U playlist, keeping the first occurrence.
# Usage: ./dedup_m3u.sh input.m3u > output.m3u

awk '
BEGIN { seen[""] = 0; }
/^#EXTINF/ {
  if (match($0, /tvg-id="([^"]+)"/, arr)) {
    id = arr[1];
    if (seen[id]++) {
      skip = 1;
    } else {
      skip = 0;
    }
  } else {
    skip = 0;
  }
  line = $0;
  getline nextline;
  if (!skip) {
    print line;
    print nextline;
  }
  next;
}
{ if (!/^#EXTINF/) print $0; }
' "$1"
