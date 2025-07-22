#!/bin/bash
# tevecade_check_m3u8.sh
# Usage: ./tevecade_check_m3u8.sh input.m3u > output.m3u

INPUT="$1"

if [ -z "$INPUT" ]; then
  echo "Usage: $0 input.m3u > output.m3u"
  exit 1
fi

while IFS= read -r line; do
  if [[ "$line" == http* ]]; then
    echo "Checking: $line" >&2
    code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 "$line")
    if [ "$code" = "200" ]; then
      echo "$line"
      last_extinf="$prev_extinf"
    else
      # skip this link and its #EXTINF
      prev_extinf=""
    fi
  else
    if [[ "$line" == "#EXTINF"* ]]; then
      prev_extinf="$line"
    elif [[ "$line" == "#EXTM3U" ]]; then
      echo "$line"
    fi
  fi
  # print #EXTINF only if next line is a working link
  if [[ "$last_extinf" != "" ]]; then
    echo "$last_extinf"
    last_extinf=""
  fi
  prev_line="$line"
done < "$INPUT"
