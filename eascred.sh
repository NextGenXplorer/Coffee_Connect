#!/usr/bin/env bash
# eas_apply_env.sh
# Usage:
#   ./eas_apply_env.sh --env .env [--dry-run] [--visibility-default plaintext|sensitive]
#
# What it does:
# - Reads the given .env file (simple KEY="value" lines)
# - For each KEY it runs:
#     eas env:create --name KEY --value "$VALUE" --environment production --visibility <visibility>
# - By default visibility is "plaintext" (you can change via --visibility-default)
# - Use --dry-run to print the commands (values masked) instead of executing them.
#
# Safety notes:
# - This script reads secrets from your local .env; nothing is sent through this chat.
# - Use "sensitive" visibility for API keys and passwords (EXPO_PUBLIC_ vars can't use "secret")
# - Test with --dry-run first.

set -euo pipefail

# Defaults
ENV_FILE=""
DRY_RUN=false
VIS_DEFAULT="plaintext"

# Keys we *force* to sensitive visibility (EXPO_PUBLIC_ vars can't use "secret")
# Note: EXPO_PUBLIC_ variables are embedded in compiled app, so use "sensitive" not "secret"
declare -A FORCE_SENSITIVE_KEYS=(
  ["EXPO_PUBLIC_FIREBASE_API_KEY"]=1
  ["EXPO_PUBLIC_GEMINI_API_KEY"]=1
  ["EXPO_PUBLIC_ADMIN_PASSWORD_1"]=1
  ["EXPO_PUBLIC_ADMIN_PASSWORD_2"]=1
  ["EXPO_PUBLIC_ADMIN_PASSWORD_3"]=1
)

print_usage() {
  cat <<EOF
Usage: $0 --env path/to/.env [--dry-run] [--visibility-default plaintext|sensitive]

Options:
  --env FILE                    Path to .env file (required)
  --dry-run                     Print the commands (values masked) instead of executing
  --visibility-default VALUE    Default visibility for vars: plaintext or sensitive (default: plaintext)
  -h, --help                    Show this help

Note: EXPO_PUBLIC_ variables use "sensitive" visibility (not "secret") as they're embedded in compiled app.
EOF
}

# parse args
while [[ $# -gt 0 ]]; do
  case "$1" in
    --env)
      ENV_FILE="$2"; shift 2;;
    --dry-run)
      DRY_RUN=true; shift;;
    --visibility-default)
      VIS_DEFAULT="$2"; shift 2;;
    -h|--help)
      print_usage; exit 0;;
    *)
      echo "Unknown arg: $1"; print_usage; exit 2;;
  esac
done

if [[ -z "$ENV_FILE" ]]; then
  echo "ERROR: --env is required"
  print_usage
  exit 2
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: env file '$ENV_FILE' not found"
  exit 2
fi

if [[ "$VIS_DEFAULT" != "plaintext" && "$VIS_DEFAULT" != "sensitive" ]]; then
  echo "ERROR: --visibility-default must be 'plaintext' or 'sensitive'"
  exit 2
fi

# helper: trim surrounding quotes
trim_quotes() {
  local v="$1"
  # remove leading and trailing double or single quote
  v="${v%\"}"; v="${v#\"}"
  v="${v%\'}"; v="${v#\'}"
  printf '%s' "$v"
}

# helper: mask value for printing
mask_value() {
  local v="$1"
  if [[ -z "$v" ]]; then
    printf '%s' "''"
    return
  fi
  # show first 3 and last 3 chars if length > 8
  local len=${#v}
  if (( len <= 8 )); then
    printf '%s' "'****'"
  else
    local first=${v:0:3}
    local last=${v: -3}
    printf "'%s****%s'" "$first" "$last"
  fi
}

echo "Applying env from: $ENV_FILE"
if $DRY_RUN; then
  echo "Mode: DRY RUN (no commands will be executed)"
else
  echo "Mode: EXECUTE (will run eas env:create)"
fi
echo "Default visibility: $VIS_DEFAULT"
echo

# read lines
while IFS= read -r line || [[ -n "$line" ]]; do
  # skip comments and blank
  [[ "$line" =~ ^[[:space:]]*# ]] && continue
  [[ -z "${line//[[:space:]]/}" ]] && continue
  # must contain '='
  if [[ "$line" != *=* ]]; then
    continue
  fi

  key="${line%%=*}"
  raw_value="${line#*=}"
  # trim whitespace around key
  key="$(echo -n "$key" | sed -E 's/^[[:space:]]+|[[:space:]]+$//g')"
  # Remove possible export prefix: export KEY="value"
  key="${key#export }"
  value="$(trim_quotes "$raw_value")"

  # decide visibility
  if [[ -n "${FORCE_SENSITIVE_KEYS[$key]:-}" ]]; then
    visibility="sensitive"
  else
    visibility="$VIS_DEFAULT"
  fi

  # Build command
  # Note: use printf to build safely; but when executing we rely on shell expansion of "$value"
  cmd=(eas env:create --name "$key" --value "$value" --environment production --visibility "$visibility")

  # Print informational line (mask value)
  printf "KEY: %-36s VIS: %-8s CMD: " "$key" "$visibility"
  masked=$(mask_value "$value")
  printf "eas env:create --name %s --value %s --environment production --visibility %s\n" "$key" "$masked" "$visibility"

  if ! $DRY_RUN; then
    # Execute the command
    # If this fails, stop the script to avoid partial state
    if ! "${cmd[@]}"; then
      echo "ERROR: command failed for key $key"
      exit 3
    fi
  fi

done < "$ENV_FILE"

echo
echo "Completed."
if $DRY_RUN; then
  echo "This was a dry-run. Re-run without --dry-run to execute the commands."
fi
