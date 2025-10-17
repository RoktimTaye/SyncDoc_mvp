#!/bin/bash
# Deployment script for GitHub Pages

# Exit on any error
set -e

# Build the application
echo "Building the application..."
npm run build

# If you're deploying to GitHub Pages, you might need to:
# 1. Create a gh-pages branch
# 2. Push the dist folder to that branch

echo "Build completed successfully!"
echo "To deploy to GitHub Pages, run:"
echo "  npm run build"
echo "  npx gh-pages -d dist"