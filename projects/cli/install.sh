#!/bin/bash
set -euo pipefail

REPO="coryrylan/cli-starter"
INSTALL_DIR="$HOME/.local/bin"
BIN_NAME="mycli"
RELEASE_TAG_PREFIX="cli-starter"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Detect OS and architecture
OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
  Darwin)
    case "$ARCH" in
      arm64) TARGET="$BIN_NAME-macos-arm64" ;;
      x86_64) TARGET="$BIN_NAME-macos-x64" ;;
      *) echo "Unsupported architecture: $ARCH"; exit 1 ;;
    esac
    ;;
  Linux)
    case "$ARCH" in
      x86_64) TARGET="$BIN_NAME-linux-x64" ;;
      aarch64) TARGET="$BIN_NAME-linux-arm64" ;;
      *) echo "Unsupported architecture: $ARCH"; exit 1 ;;
    esac
    ;;
  *)
    echo "Unsupported OS: $OS"
    echo "For Windows, download the binary manually from:"
    echo "  https://github.com/$REPO/releases/latest"
    exit 1
    ;;
esac

echo "Detected $OS ($ARCH)"

# Use local binary if available (in dist/ relative to script), otherwise download
if [ -f "$SCRIPT_DIR/dist/$TARGET" ]; then
  echo "Installing from local build..."
  SOURCE="$SCRIPT_DIR/dist/$TARGET"
else
  echo "Downloading $TARGET..."
  TAG=$(curl -fsSL "https://api.github.com/repos/$REPO/releases" \
    | grep -o '"tag_name": *"'"$RELEASE_TAG_PREFIX"'-v[^"]*"' \
    | head -1 \
    | cut -d'"' -f4)
  if [ -z "$TAG" ]; then
    echo "Could not find latest release"; exit 1
  fi
  DOWNLOAD_URL="https://github.com/$REPO/releases/download/$TAG/$TARGET"
  SOURCE="$(mktemp)"
  curl -fsSL "$DOWNLOAD_URL" -o "$SOURCE"
fi

chmod +x "$SOURCE"

DEST="$INSTALL_DIR/$BIN_NAME"

mkdir -p "$INSTALL_DIR"
cp "$SOURCE" "$DEST"

# macOS requires ad-hoc code signature for binaries to execute
if [ "$OS" = "Darwin" ] && command -v codesign >/dev/null 2>&1; then
  codesign --sign - --force "$DEST" 2>/dev/null || echo "Ad-hoc code signing failed — binary may not run."
fi

echo "Installed $BIN_NAME to $DEST"
echo ""
echo "Run '$BIN_NAME --help' to get started."
