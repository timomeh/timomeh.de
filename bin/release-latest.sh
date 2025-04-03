#!/usr/bin/env bash

set -euo pipefail

DEPLOY_WEBHOOK_URL="${COOLIFY_DEPLOY_WEBHOOK_URL}"
DEPLOY_STATUS_URL="${COOLIFY_DEPLOY_STATUS_URL}"
AUTH_TOKEN="${COOLIFY_TOKEN}"

echo "Triggering deployment of the latest release..."

start_response=$(curl --silent --request GET "$DEPLOY_WEBHOOK_URL" \
  --header "Authorization: Bearer $AUTH_TOKEN")

deployment_uuid=$(echo "$start_response" | jq -r '.deployments[0].deployment_uuid')

if [[ -z "$deployment_uuid" || "$deployment_uuid" == "null" ]]; then
  echo "Failed to retrieve deployment_uuid"
  exit 1
fi

echo "Deployment created [ID:$deployment_uuid]"
echo -n "Deploying"

while true; do
  status_response=$(curl --silent --request GET "$DEPLOY_STATUS_URL/$deployment_uuid" \
    --header "Authorization: Bearer $AUTH_TOKEN")

  status=$(echo "$status_response" | jq -r '.status')

  case "$status" in
    finished)
      echo -e "\nDeployment finished successfully."
      exit 0
      ;;
    queued|in_progress)
      echo -n "."
      sleep 3
      ;;
    *)
      echo -e "\nDeployment failed with status: $status"
      exit 1
      ;;
  esac
done
