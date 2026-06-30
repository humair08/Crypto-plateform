@echo off
REM Betting Platform - Setup Script for Windows
REM This script helps set up the project for development

echo.
echo 🚀 Betting Platform Setup Script
echo ==================================
echo.

REM Check Node version
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%

REM Check npm version
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✅ npm version: %NPM_VERSION%

REM Setup Frontend
echo.
echo 📦 Setting up Frontend...
cd frontend
call npm install
echo ✅ Frontend dependencies installed

REM Setup Backend
echo.
echo 📦 Setting up Backend...
cd ..\backend
call npm install
echo ✅ Backend dependencies installed

REM Generate Prisma Client
echo.
echo 🗄️ Setting up Database...
call npm run db:generate
echo ✅ Prisma client generated

echo.
echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Create .env files with your configuration
echo 2. Run: npm run db:migrate (in backend folder)
echo 3. Start backend: npm run dev (in backend folder)
echo 4. Start frontend: npm run dev (in frontend folder)
echo.
echo Documentation:
echo - Installation Guide: docs/INSTALLATION.md
echo - Architecture: docs/ARCHITECTURE.md
echo - API Docs: docs/API.md
