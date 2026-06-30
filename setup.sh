#!/bin/bash

# Betting Platform - Setup Script
# This script helps set up the project for development

set -e

echo "🚀 Betting Platform Setup Script"
echo "=================================="
echo ""

# Check Node version
NODE_VERSION=$(node -v)
echo "✅ Node.js version: $NODE_VERSION"

# Check npm version
NPM_VERSION=$(npm -v)
echo "✅ npm version: $NPM_VERSION"

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
cd frontend
npm install
echo "✅ Frontend dependencies installed"

# Setup Backend
echo ""
echo "📦 Setting up Backend..."
cd ../backend
npm install
echo "✅ Backend dependencies installed"

# Generate Prisma Client
echo ""
echo "🗄️ Setting up Database..."
npm run db:generate
echo "✅ Prisma client generated"

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Create .env files with your configuration"
echo "2. Run: npm run db:migrate (in backend folder)"
echo "3. Start backend: npm run dev (in backend folder)"
echo "4. Start frontend: npm run dev (in frontend folder)"
echo ""
echo "Documentation:"
echo "- Installation Guide: docs/INSTALLATION.md"
echo "- Architecture: docs/ARCHITECTURE.md"
echo "- API Docs: docs/API.md"
