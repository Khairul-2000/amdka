#!/bin/bash

echo "============================================"
echo "Linux/Mac Setup Script for Node Server"
echo "============================================"
echo

echo "Step 1: Configuring Git for cross-platform development..."
git config core.autocrlf false
echo "✓ Git line ending configuration updated"

echo
echo "Step 2: Installing Node.js dependencies..."
cd NoderServer
npm install
if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi
echo "✓ Dependencies installed"

echo
echo "Step 3: Generating Prisma client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "❌ Prisma client generation failed"
    exit 1
fi
echo "✓ Prisma client generated"

echo
echo "Step 4: Setting up environment file..."
if [ ! -f .env ]; then
    echo "Creating .env file template..."
    cat > .env << EOF
DATABASE_URL="your_database_url_here"
EMAIL_SERVICE="gmail"
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_app_password"
EOF
    echo "⚠️  Please update the .env file with your actual values"
else
    echo "✓ .env file already exists"
fi

echo
echo "Step 5: Creating uploads directory..."
mkdir -p uploads/products
echo "✓ Uploads directory created"

echo
echo "============================================"
echo "Setup completed successfully! 🎉"
echo "============================================"
echo
echo "Next steps:"
echo "1. Update your .env file with actual database credentials"
echo "2. Run: npm run db:migrate (to setup database)"
echo "3. Run: npm run dev (to start development server)"
echo
echo "Or use Docker: docker-compose up --build"
echo "============================================"
