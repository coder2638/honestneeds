#!/bin/bash
# Build script with memory optimization for Render deployments
set -e

echo "🔨 Starting optimized build process..."
echo "📊 Setting memory options: 2GB"
echo "📝 Environment:"
echo "   NODE_ENV=$NODE_ENV"
echo "   NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL"
echo "   RENDER=$RENDER"

# Set Node memory options
export NODE_OPTIONS="--max-old-space-size=2048 --trace-warnings"

# Run build with error handling
echo "🚀 Running: npm run build"
npm run build || {
  EXIT_CODE=$?
  echo "❌ Build failed with exit code: $EXIT_CODE"
  exit $EXIT_CODE
}

echo "✅ Build completed successfully!"

