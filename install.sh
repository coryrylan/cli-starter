#!/bin/bash
set -euo pipefail

REPO="coryrylan/bun-cli-starter"
INSTALL_DIR="$HOME/.local/bin"
BINARY_NAME="bun-cli-starter"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Detect OS and architecture
OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
  Darwin)
    case "$ARCH" in
      arm64) TARGET="bun-cli-starter-macos-arm64" ;;
      x86_64) TARGET="bun-cli-starter-macos-x64" ;;
      *) echo "Unsupported architecture: $ARCH"; exit 1 ;;
    esac
    ;;
  Linux)
    case "$ARCH" in
      x86_64) TARGET="bun-cli-starter-linux-x64" ;;
      aarch64) TARGET="bun-cli-starter-linux-arm64" ;;
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
    | grep -o '"tag_name": *"bun-cli-starter-v[^"]*"' \
    | head -1 \
    | cut -d'"' -f4)
  if [ -z "$TAG" ]; then
    echo "Could not find latest bun-cli-starter release"; exit 1
  fi
  DOWNLOAD_URL="https://github.com/$REPO/releases/download/$TAG/$TARGET"
  SOURCE="$(mktemp)"
  curl -fsSL "$DOWNLOAD_URL" -o "$SOURCE"
fi

chmod +x "$SOURCE"

# Applying ad-hoc code signature for MacOS
if [ "$OS" = "Darwin" ]; then
  codesign --sign - --force "$SOURCE"
fi

DEST="$INSTALL_DIR/$BINARY_NAME"

if [ -w "$INSTALL_DIR" ]; then
  cp "$SOURCE" "$DEST"
else
  echo "Installing to $INSTALL_DIR (requires sudo)..."
  sudo cp "$SOURCE" "$DEST"
fi

echo "Installed $BINARY_NAME to $DEST"
echo ""
echo "Run 'bun-cli-starter --help' to get started."
