#!/usr/bin/env bash
set -euo pipefail

: "${TARGET:?Missing TARGET}"
: "${APP:?Missing APP}"
: "${RELEASE_ID:?Missing RELEASE_ID}"
: "${BASE_DOMAIN:?Missing BASE_DOMAIN}"
: "${REGISTRY_USER:?Missing REGISTRY_USER}"
: "${REGISTRY_PASSWORD:?Missing registry pull token}"
TRAEFIK_NETWORK=${TRAEFIK_NETWORK:-localhost}
[[ "$TARGET" == production || "$TARGET" == development ]]
[[ "$APP" == landing || "$APP" == admin || "$APP" == client ]]
[[ "$RELEASE_ID" =~ ^[0-9]+-[0-9]+$ ]]
[[ "$BASE_DOMAIN" =~ ^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$ ]]
[[ "$TRAEFIK_NETWORK" =~ ^[a-zA-Z0-9_.-]+$ ]]

release=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
state=$(cd -- "$release/../.." && pwd)
directory="frontend-$APP"
if [[ "$TARGET" == development ]]; then
  directory+="-dev"
fi
# Reject mismatched environments/apps before touching deployment state.
[[ "$(basename -- "$state")" == "$directory" ]]
[[ "$(basename -- "$release")" == "$RELEASE_ID" ]]
image=$(cat -- "$release/images/$APP.txt")
[[ "$image" =~ ^ghcr\.io/[a-z0-9._/-]+@sha256:[a-f0-9]{64}$ ]]
app_domain=$BASE_DOMAIN
if [[ "$TARGET" == development ]]; then
  app_domain="$APP-dev.$BASE_DOMAIN"
elif [[ "$APP" != landing ]]; then
  app_domain="$APP.$BASE_DOMAIN"
fi
# Preserve project/router names so moving directories updates existing containers.
stack="rexolute-$TARGET-$APP"

# Adopt the previous layout's healthy state on the first release at this path.
# Keep the old files intact, and retain rollback across the directory migration.
legacy="$(dirname -- "$state")/rexolute/$TARGET/$APP"
if [[ ! -f "$state/.env" && -f "$legacy/.env" && -f "$legacy/compose.yml" ]]; then
  cp -- "$legacy/compose.yml" "$state/compose.yml"
  cp -- "$legacy/.env" "$state/.env"
fi

# Keep registry credentials out of persistent application state.
DOCKER_CONFIG=$(mktemp -d)
export DOCKER_CONFIG
trap 'rm -rf -- "$DOCKER_CONFIG"' EXIT
printf '%s' "$REGISTRY_PASSWORD" | docker login ghcr.io -u "$REGISTRY_USER" --password-stdin
unset REGISTRY_PASSWORD

candidate="$state/candidate.env"
printf 'APP_IMAGE=%s\nAPP_DOMAIN=%s\nSTACK_ID=%s\nTRAEFIK_NETWORK=%s\n' \
  "$image" "$app_domain" "$stack" "$TRAEFIK_NETWORK" > "$candidate"
compose=(docker compose --project-name "$stack" --env-file "$candidate" -f "$release/deploy/compose.yml")
"${compose[@]}" config --quiet
"${compose[@]}" pull app
if "${compose[@]}" up -d --no-deps --wait --wait-timeout 120 app; then
  cp -- "$release/deploy/compose.yml" "$state/compose.yml"
  mv -- "$candidate" "$state/.env"
  printf 'Deployed %s at https://%s in %s\n' "$stack" "$app_domain" "$state"
else
  printf 'Health check failed for %s.\n' "$stack" >&2
  if [[ -f "$state/.env" && -f "$state/compose.yml" ]]; then
    echo 'Restoring the previous healthy app release.' >&2
    docker compose --project-name "$stack" --env-file "$state/.env" -f "$state/compose.yml" \
      up -d --no-deps --wait --wait-timeout 120 app
  fi
  exit 1
fi
