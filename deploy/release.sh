#!/usr/bin/env bash
set -euo pipefail

: "${TARGET:?Missing TARGET}"
: "${RELEASE_ID:?Missing RELEASE_ID}"
: "${BASE_DOMAIN:?Missing BASE_DOMAIN}"
: "${REGISTRY_USER:?Missing REGISTRY_USER}"
: "${REGISTRY_PASSWORD:?Missing registry pull token}"
TRAEFIK_NETWORK=${TRAEFIK_NETWORK:-localhost}
[[ "$TARGET" == production || "$TARGET" == development ]]
[[ "$RELEASE_ID" =~ ^[0-9]+-[0-9]+$ ]]
[[ "$BASE_DOMAIN" =~ ^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$ ]]
[[ "$TRAEFIK_NETWORK" =~ ^[a-zA-Z0-9_.-]+$ ]]

release=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
root=$(cd -- "$release/../.." && pwd)
domain=$BASE_DOMAIN
if [[ "$TARGET" == development ]]; then domain="dev.$BASE_DOMAIN"; fi
# Keep registry credentials out of persistent application state.
DOCKER_CONFIG=$(mktemp -d)
export DOCKER_CONFIG
trap 'rm -rf -- "$DOCKER_CONFIG"' EXIT
printf '%s' "$REGISTRY_PASSWORD" | docker login ghcr.io -u "$REGISTRY_USER" --password-stdin
unset REGISTRY_PASSWORD

for app in landing admin client; do
  image_file="$release/images/$app.txt"
  [[ -f "$image_file" ]] || continue
  image=$(cat -- "$image_file")
  [[ "$image" =~ ^ghcr\.io/[a-z0-9._/-]+@sha256:[a-f0-9]{64}$ ]]
  app_domain=$domain
  if [[ "$app" != landing ]]; then app_domain="$app.$domain"; fi
  stack="rexolute-$TARGET-$app"
  state="$root/$app"
  mkdir -p -- "$state"
  candidate="$state/candidate.env"
  printf 'APP_IMAGE=%s\nAPP_DOMAIN=%s\nSTACK_ID=%s\nTRAEFIK_NETWORK=%s\n' \
    "$image" "$app_domain" "$stack" "$TRAEFIK_NETWORK" > "$candidate"
  compose=(docker compose --project-name "$stack" --env-file "$candidate" -f "$release/deploy/compose.yml")
  "${compose[@]}" config --quiet
  "${compose[@]}" pull app
  if "${compose[@]}" up -d --no-deps --wait --wait-timeout 120 app; then
    # Save only healthy releases; subsequent app-only deployments retain other app digests.
    cp -- "$release/deploy/compose.yml" "$state/compose.yml"
    mv -- "$candidate" "$state/.env"
    printf 'Deployed %s at https://%s\n' "$stack" "$app_domain"
  else
    printf 'Health check failed for %s.\n' "$stack" >&2
    if [[ -f "$state/.env" && -f "$state/compose.yml" ]]; then
      echo 'Restoring the previous healthy app release.' >&2
      docker compose --project-name "$stack" --env-file "$state/.env" -f "$state/compose.yml" \
        up -d --no-deps --wait --wait-timeout 120 app
    fi
    exit 1
  fi
done
