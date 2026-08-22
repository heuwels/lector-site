#!/usr/bin/env bash
#
# Proves a deployed registry proxy actually serves pulls.
#
#   ./workers/registry/verify.sh registry.lector.dev latest
#
# Run by .github/workflows/deploy-registry.yml after each deploy, and safe to
# run by hand against either hostname.
set -euo pipefail

HOST="${1:?usage: verify.sh <hostname> [tag]}"
TAG="${2:-latest}"
REPO=lector

# A hostname Cloudflare has not served before needs a certificate issued before
# anything answers over TLS, and that took well over two minutes the first time
# registry.sandbox.lector.dev was attached. The budget is generous because it is
# only ever spent once per hostname; a redeploy passes this probe immediately.
readonly FIRST_PROBE_ATTEMPTS=100
readonly PROBE_SLEEP=6

ACCEPT='application/vnd.oci.image.index.v1+json,application/vnd.oci.image.manifest.v1+json,application/vnd.docker.distribution.manifest.list.v2+json,application/vnd.docker.distribution.manifest.v2+json'

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

# A bare curl status of 000 covers DNS, TCP and TLS failures alike, which is
# not enough to act on. This separates them, because each has a different cause
# and only one of them is worth waiting out.
diagnose() {
  if ! host "$HOST" >/dev/null 2>&1 && ! nslookup "$HOST" >/dev/null 2>&1; then
    echo "DNS does not resolve — the custom domain was never attached"
    return
  fi
  if ! curl --silent --output /dev/null --max-time 10 "https://${HOST}/v2/" 2>/dev/null; then
    if curl --silent --output /dev/null --max-time 10 --insecure "https://${HOST}/v2/" 2>/dev/null; then
      echo "the Worker answers, but the certificate is not valid yet — this is
  the first-deploy case and resolves on its own"
      return
    fi
    echo "cannot complete a TLS handshake. If this hostname is new, its
  certificate is still being issued and the wait above was not long enough.
  If it is not new, check that the custom domain is still attached."
    return
  fi
  echo "connected, but /v2/ did not answer 200"
}

echo "== 1/6 version check =="
for attempt in $(seq "$FIRST_PROBE_ATTEMPTS"); do
  status="$(curl --silent --output /dev/null --write-out '%{http_code}' "https://${HOST}/v2/" || true)"
  if [ "$status" = 200 ]; then
    echo "  /v2/ -> 200"
    break
  fi
  if [ "$attempt" = "$FIRST_PROBE_ATTEMPTS" ]; then
    fail "/v2/ never returned 200 (last status: ${status:-none})
  $(diagnose)"
  fi
  sleep "$PROBE_SLEEP"
done

echo "== 2/6 tag listing =="
tags="$(curl --fail --silent --show-error "https://${HOST}/v2/${REPO}/tags/list")" ||
  fail "tags/list did not answer"
echo "$tags" | jq -e --arg tag "$TAG" '.tags | index($tag)' >/dev/null ||
  fail "tag '$TAG' missing from tags/list"
# The listing must name the repository the client asked for, not GHCR's path.
echo "$tags" | jq -e --arg repo "$REPO" '.name == $repo' >/dev/null ||
  fail "tags/list reported name '$(echo "$tags" | jq -r .name)', expected '$REPO'"
echo "  tags/list contains '$TAG' and names '$REPO'"

echo "== 3/6 manifest resolves =="
headers="$(curl --fail --silent --show-error --head \
  --header "Accept: ${ACCEPT}" \
  "https://${HOST}/v2/${REPO}/manifests/${TAG}")" ||
  fail "manifest HEAD failed for '$TAG'"
grep -qi '^docker-content-digest:' <<<"$headers" ||
  fail "manifest response carried no Docker-Content-Digest"
echo "  ${TAG} -> $(grep -i '^docker-content-digest:' <<<"$headers" | tr -d '\r' | awk '{print $2}')"

echo "== 4/6 blobs still redirect off-Worker =="
# The whole cost model depends on this. If a blob is ever served inline, layer
# bytes start flowing through the Worker instead of GitHub's CDN.
platform_digest="$(curl --fail --silent --show-error \
  --header "Accept: ${ACCEPT}" \
  "https://${HOST}/v2/${REPO}/manifests/${TAG}" |
  jq -r 'if .manifests then .manifests[0].digest else "" end')"

manifest_ref="${platform_digest:-$TAG}"
layer_digest="$(curl --fail --silent --show-error \
  --header "Accept: ${ACCEPT}" \
  "https://${HOST}/v2/${REPO}/manifests/${manifest_ref}" |
  jq -r '.layers[0].digest')"
[ -n "$layer_digest" ] && [ "$layer_digest" != null ] ||
  fail "could not read a layer digest from the manifest"

blob_status="$(curl --silent --output /dev/null --write-out '%{http_code}' \
  "https://${HOST}/v2/${REPO}/blobs/${layer_digest}")"
redirect_url="$(curl --silent --output /dev/null --write-out '%{redirect_url}' \
  "https://${HOST}/v2/${REPO}/blobs/${layer_digest}")"

case "$blob_status" in
  30*) : ;;
  *) fail "blob returned $blob_status, expected a redirect (bytes would flow through the Worker)" ;;
esac
case "$redirect_url" in
  https://pkg-containers.githubusercontent.com/*) ;;
  *) fail "blob redirected to an unexpected host: ${redirect_url:-none}" ;;
esac
echo "  blob -> $blob_status pkg-containers.githubusercontent.com"

# The signed URL expires in minutes, so a cached Location would start handing
# out dead URLs. Read the headers off the GET, not a HEAD: HEAD is answered from
# upstream directly and never carries a redirect to cache.
blob_headers="$(curl --silent --output /dev/null --dump-header - \
  "https://${HOST}/v2/${REPO}/blobs/${layer_digest}" | tr -d '\r')"
grep -qi '^cache-control:.*no-store' <<<"$blob_headers" ||
  fail "blob redirect is cacheable; the signed URL expires within minutes"
echo "  blob redirect marked no-store"

echo "== 5/6 allowlist holds =="
body="$(curl --silent "https://${HOST}/v2/not-our-image/manifests/latest")"
grep -q NAME_UNKNOWN <<<"$body" ||
  fail "an unlisted repository was not rejected (open proxy): $body"
echo "  unlisted repository -> NAME_UNKNOWN"

echo "== 6/6 a real client agrees =="
# curl proves the protocol; only a registry client proves the handshake. The
# proxy answers /v2/ with 200 rather than an auth challenge, and this is what
# confirms a client accepts that and resolves the tag. `manifest inspect` reads
# manifests only, so it costs a few KB rather than the whole image.
if command -v docker >/dev/null && docker info >/dev/null 2>&1; then
  docker manifest inspect "${HOST}/${REPO}:${TAG}" >/dev/null ||
    fail "docker could not read ${HOST}/${REPO}:${TAG}"
  echo "  docker manifest inspect succeeded"

  # Opt-in, because it moves the whole image. Proves the redirect handoff works
  # for a client rather than just for curl.
  if [ "${FULL_PULL:-0}" = 1 ]; then
    docker pull --quiet "${HOST}/${REPO}:${TAG}" >/dev/null ||
      fail "docker pull failed"
    docker image rm --force "${HOST}/${REPO}:${TAG}" >/dev/null 2>&1 || true
    echo "  docker pull succeeded"
  fi
else
  echo "  skipped: no usable docker daemon here"
fi

echo
echo "OK: ${HOST} serves ${REPO}:${TAG}, blobs redirect, allowlist enforced."
