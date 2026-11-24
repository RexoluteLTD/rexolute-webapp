#!/usr/bin/env bash

frontend_domain() {
  local target=$1 app=$2 base_domain=$3
  if [[ "$target" == development ]]; then
    printf '%s-dev.%s\n' "$app" "$base_domain"
  elif [[ "$app" == landing ]]; then
    printf '%s\n' "$base_domain"
  else
    printf '%s.%s\n' "$app" "$base_domain"
  fi
}

# The release script sources the hostname mapping; CI runs this file for build outputs.
if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  set -euo pipefail
  : "${BASE_DOMAIN:?Set BASE_DOMAIN for the image build}"
  [[ "$BASE_DOMAIN" =~ ^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$ ]]
  [[ "$TARGET" == production || "$TARGET" == development ]]
  [[ "$APP" == landing || "$APP" == admin || "$APP" == client ]]

  landing_domain=$(frontend_domain "$TARGET" landing "$BASE_DOMAIN")
  admin_domain=$(frontend_domain "$TARGET" admin "$BASE_DOMAIN")
  client_domain=$(frontend_domain "$TARGET" client "$BASE_DOMAIN")
  indexable=false
  if [[ "$TARGET" == production ]]; then indexable=true; fi
  cloud_name=
  article_preset=
  if [[ "$APP" == admin ]]; then
    cloud_name=${CLOUDINARY_CLOUD_NAME:-}
    article_preset=${CLOUDINARY_ARTICLE_PRESET:-}
    [[ "$cloud_name" =~ ^[[:alnum:]_-]*$ && "$article_preset" =~ ^[[:alnum:]_-]*$ ]]
  fi

  tree=$(git rev-parse 'HEAD^{tree}')
  config_hash=$(printf '%s\n' "$APP" "$indexable" "$landing_domain" "$admin_domain" "$client_domain" "$cloud_name" "$article_preset" | sha256sum)
  {
    printf 'landing_domain=%s\nadmin_domain=%s\nclient_domain=%s\n' "$landing_domain" "$admin_domain" "$client_domain"
    printf 'indexable=%s\nimage=ghcr.io/%s/%s\n' "$indexable" "${GITHUB_REPOSITORY,,}" "$APP"
    printf 'cloudinary_cloud_name=%s\ncloudinary_article_preset=%s\n' "$cloud_name" "$article_preset"
    printf 'tag=build-%s-%s-%s\n' "$TARGET" "$tree" "${config_hash%% *}"
  } >> "$GITHUB_OUTPUT"
fi
