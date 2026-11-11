#!/usr/bin/env bash
set -Eeuo pipefail

stage='validating release configuration'
# Report location and stage, never the failed command or its expanded credentials.
trap 'status=$?; printf "Release failed while %s (line %s, exit %s).\n" "$stage" "$LINENO" "$status" >&2; exit "$status"' ERR
fail() {
  printf 'Release validation failed: %s\n' "$1" >&2
  exit 1
}

: "${TARGET:?Missing TARGET}"
: "${APP:?Missing APP}"
: "${RELEASE_ID:?Missing RELEASE_ID}"
: "${BASE_DOMAIN:?Missing BASE_DOMAIN}"
: "${REGISTRY_USER:?Missing REGISTRY_USER}"
: "${REGISTRY_PASSWORD:?Missing registry pull token}"
TRAEFIK_NETWORK=${TRAEFIK_NETWORK:-localhost}
[[ "$TARGET" == production || "$TARGET" == development ]] || fail 'TARGET must be production or development.'
[[ "$APP" == landing || "$APP" == admin || "$APP" == client ]] || fail 'APP must be landing, admin, or client.'
[[ "$RELEASE_ID" =~ ^[0-9]+-[0-9]+$ ]] || fail 'RELEASE_ID must have the form run-attempt.'
[[ "$BASE_DOMAIN" =~ ^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$ ]] || fail 'BASE_DOMAIN must be a bare lowercase domain, without a scheme, path, or whitespace.'
[[ "$TRAEFIK_NETWORK" =~ ^[a-zA-Z0-9_.-]+$ ]] || fail 'TRAEFIK_NETWORK contains unsupported characters or whitespace.'

release=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
state=$(cd -- "$release/../.." && pwd)
directory="frontend-$APP"
if [[ "$TARGET" == development ]]; then
  directory+="-dev"
fi
# Reject mismatched environments/apps before touching deployment state.
[[ "$(basename -- "$state")" == "$directory" ]] || fail "Release must be inside the $directory deployment directory."
[[ "$(basename -- "$release")" == "$RELEASE_ID" ]] || fail 'Release directory does not match RELEASE_ID.'
[[ -r "$release/images/$APP.txt" ]] || fail "Missing or unreadable images/$APP.txt release artifact."
[[ -r "$release/deploy/compose.yml" ]] || fail 'Missing or unreadable deploy/compose.yml release manifest.'
image=$(cat -- "$release/images/$APP.txt")
[[ "$image" =~ ^ghcr\.io/[a-z0-9._/-]+@sha256:[a-f0-9]{64}$ ]] || fail "images/$APP.txt must contain a GHCR image with a sha256 digest and no extra whitespace."
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

stage='authenticating to GHCR'
printf 'Deploying %s/%s from %s\n' "$TARGET" "$APP" "$release"
echo 'Authenticating to GHCR with the configured pull account.'
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
stage='validating the Compose manifest'
echo 'Validating the Compose manifest.'
"${compose[@]}" config --quiet
stage='pulling the release image'
echo 'Pulling the release image.'
"${compose[@]}" pull app
stage='starting the app and checking health'
echo 'Starting the app and checking health.'
if "${compose[@]}" up -d --no-deps --wait --wait-timeout 120 app; then
  stage='saving the healthy release state'
  cp -- "$release/deploy/compose.yml" "$state/compose.yml"
  mv -- "$candidate" "$state/.env"
  printf 'Deployed %s at https://%s in %s\n' "$stack" "$app_domain" "$state"
else
  printf 'Health check failed for %s.\n' "$stack" >&2
  if [[ -f "$state/.env" && -f "$state/compose.yml" ]]; then
    stage='restoring the previous healthy app release'
    echo 'Restoring the previous healthy app release.' >&2
    docker compose --project-name "$stack" --env-file "$state/.env" -f "$state/compose.yml" \
      up -d --no-deps --wait --wait-timeout 120 app
  fi
  exit 1
fi
