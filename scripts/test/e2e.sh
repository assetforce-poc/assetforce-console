#!/bin/bash
#
# Unified E2E Test Runner for AssetForce Console
#
# Usage:
#   ./scripts/test/e2e.sh [module] [playwright-options]
#
# Modules:
#   all       - Run all E2E tests (default)
#   auth      - Customer Portal authentication tests
#   admin     - Admin Console tests
#   <path>    - Run specific test file or directory
#
# Examples:
#   ./scripts/test/e2e.sh                          # Run all tests
#   ./scripts/test/e2e.sh auth                     # Run auth tests
#   ./scripts/test/e2e.sh admin                    # Run admin tests
#   ./scripts/test/e2e.sh admin --headed           # Run admin tests in headed mode
#   ./scripts/test/e2e.sh auth --ui                # Run auth tests in UI mode
#   ./scripts/test/e2e.sh e2e/admin/accounts.spec.ts  # Run specific test file
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the module argument (default to "all")
MODULE="${1:-all}"

# Shift to get remaining arguments for Playwright
shift || true
PLAYWRIGHT_ARGS="$@"

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$ROOT_DIR"

echo -e "${BLUE}🧪 AssetForce Console E2E Test Runner${NC}"
echo ""

# Function to run Playwright tests
run_playwright() {
  local config=$1
  local test_path=$2
  local description=$3

  echo -e "${YELLOW}▶ Running: $description${NC}"
  echo "  Config: $config"
  echo "  Path: $test_path"
  echo ""

  npx playwright test --config="$config" "$test_path" $PLAYWRIGHT_ARGS
}

# Run tests based on module
case "$MODULE" in
  all)
    echo -e "${GREEN}Running all E2E tests${NC}"
    echo ""

    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}📱 Customer Portal - Authentication Tests${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    run_playwright "e2e/playwright.config.cjs" "auth/" "Customer Portal authentication flow"

    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}🔧 Admin Console - All Tests${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    run_playwright "playwright.admin.config.cjs" "" "Admin Console all tests"

    echo ""
    echo -e "${GREEN}✅ All E2E tests completed${NC}"
    ;;

  auth)
    echo -e "${GREEN}Running Customer Portal authentication tests${NC}"
    run_playwright "e2e/playwright.config.cjs" "auth/" "Customer Portal authentication flow"
    ;;

  admin)
    echo -e "${GREEN}Running Admin Console tests${NC}"
    run_playwright "playwright.admin.config.cjs" "" "Admin Console all tests"
    ;;

  *)
    # Treat as a custom path
    if [[ "$MODULE" == e2e/auth/* ]]; then
      CONFIG="e2e/playwright.config.cjs"
    elif [[ "$MODULE" == e2e/admin/* ]] || [[ "$MODULE" == admin/* ]]; then
      CONFIG="playwright.admin.config.cjs"
    else
      echo -e "${RED}❌ Error: Unable to determine config for path: $MODULE${NC}"
      echo ""
      echo "Please specify one of:"
      echo "  - all, auth, admin"
      echo "  - e2e/auth/<test-file>"
      echo "  - e2e/admin/<test-file>"
      exit 1
    fi

    echo -e "${GREEN}Running custom test path: $MODULE${NC}"
    run_playwright "$CONFIG" "$MODULE" "Custom test path"
    ;;
esac

echo ""
echo -e "${GREEN}✨ Done${NC}"
