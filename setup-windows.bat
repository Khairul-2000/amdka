@echo off
echo ============================================
echo Windows Setup Script for Node Server
echo ============================================
echo.

echo Step 1: Configuring Git for cross-platform development...
git config core.autocrlf true
echo ✓ Git line ending configuration updated

echo.
echo Step 2: Installing Node.js dependencies...
cd NoderServer
call npm install
if %errorlevel% neq 0 (
    echo ❌ npm install failed
    pause
    exit /b 1
)
echo ✓ Dependencies installed

echo.
echo Step 3: Generating Prisma client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Prisma client generation failed
    pause
    exit /b 1
)
echo ✓ Prisma client generated

echo.
echo Step 4: Setting up environment file...
if not exist .env (
    echo Creating .env file template...
    echo DATABASE_URL="your_database_url_here" > .env
    echo EMAIL_SERVICE="gmail" >> .env
    echo EMAIL_USER="your_email@gmail.com" >> .env
    echo EMAIL_PASS="your_app_password" >> .env
    echo ⚠️  Please update the .env file with your actual values
) else (
    echo ✓ .env file already exists
)

echo.
echo Step 5: Creating uploads directory...
if not exist uploads\products mkdir uploads\products
echo ✓ Uploads directory created

echo.
echo ============================================
echo Setup completed successfully! 🎉
echo ============================================
echo.
echo Next steps:
echo 1. Update your .env file with actual database credentials
echo 2. Run: npm run db:migrate (to setup database)
echo 3. Run: npm run dev (to start development server)
echo.
echo Or use Docker: docker-compose up --build
echo ============================================
pause
