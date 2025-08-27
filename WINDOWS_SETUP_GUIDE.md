# 🖥️ Windows Development Setup Guide

## 🚨 Common Issues When Cloning on Windows

### Issue 1: Prisma Client Platform Mismatch
**Problem**: Prisma generates platform-specific binaries. When you develop on Windows but deploy in Linux containers, you get binary mismatches.

**Solution**: Always regenerate Prisma client in the target environment.

### Issue 2: Line Ending Differences
**Problem**: Windows uses CRLF, Linux uses LF line endings.

**Solution**: Configure Git properly for cross-platform development.

### Issue 3: File Permissions
**Problem**: Docker containers run as different users, causing permission issues.

**Solution**: Proper Dockerfile configuration and volume mounting.

## ✅ Step-by-Step Setup for Windows

### 1. **Clone the Repository**
```bash
git clone https://github.com/Khairul-2000/amdka.git
cd amdka
```

### 2. **Configure Git for Line Endings** (Important!)
```bash
# Set Git to handle line endings automatically
git config core.autocrlf true

# If you already cloned, refresh files:
git rm --cached -r .
git reset --hard
```

### 3. **Setup Environment Variables**
Create `.env` file in `NoderServer` directory:
```env
DATABASE_URL="your_database_url_here"
EMAIL_SERVICE="gmail"
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_app_password"
```

### 4. **Docker Setup (Recommended)**

#### Option A: Use Docker (Easiest)
```bash
# From the root directory
docker-compose up --build
```

This will:
- Build the Node.js container with correct Prisma binaries
- Install all dependencies in Linux environment
- Generate Prisma client for Linux platform
- Start the services

#### Option B: Local Development (Advanced)
If you want to run locally on Windows:

```bash
cd NoderServer

# Install dependencies
npm install

# Generate Prisma client for current platform
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### 5. **Verify Setup**
Test the API endpoints:
```bash
# Check if server is running
curl http://localhost:3001/

# Check available serial numbers
curl http://localhost:3001/api/products/serial-numbers
```

## 🐛 Troubleshooting Common Windows Issues

### Error: "Prisma Client could not be initialized"
**Cause**: Platform mismatch between Windows and Linux Prisma binaries.

**Solution**:
```bash
# Delete generated client
rm -rf generated/prisma

# Regenerate for current platform
npx prisma generate

# If in Docker, rebuild container
docker-compose up --build
```

### Error: "ENOENT: no such file or directory"
**Cause**: Line ending issues or missing files.

**Solution**:
```bash
# Fix line endings
git config core.autocrlf true
git rm --cached -r .
git reset --hard

# Rebuild Docker container
docker-compose down
docker-compose up --build
```

### Error: "Permission denied" or file access issues
**Cause**: Docker volume permission issues on Windows.

**Solution**:
```bash
# Make sure Docker Desktop is running as administrator
# Or try without volume mounting by modifying docker-compose.yml
```

### Error: "Module not found" errors
**Cause**: Dependencies not installed properly or platform mismatch.

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# If using Docker, rebuild
docker-compose build --no-cache
```

## 🔧 Updated Docker Configuration

The Dockerfile has been updated to handle cross-platform issues:

```dockerfile
FROM node:18

WORKDIR /app

# Copy package files and install dependencies first
COPY package.json package-lock.json* tsconfig.json* ./

# Copy prisma schema
COPY prisma ./prisma

# Install global dependencies and project dependencies
RUN npm install -g ts-node-dev prisma && npm install

# Generate Prisma client (important for cross-platform compatibility)
RUN npx prisma generate

# Copy source code
COPY ./src ./src

# Create uploads directory
RUN mkdir -p uploads/products

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "run", "start"]
```

## 🚀 Best Practices for Cross-Platform Development

### 1. **Always Use Docker for Production**
- Ensures consistent environment across platforms
- Handles platform-specific binaries automatically
- Avoids "works on my machine" issues

### 2. **Configure Git Properly**
```bash
# For Windows developers
git config --global core.autocrlf true

# For team consistency
echo "* text=auto" > .gitattributes
echo "*.js text eol=lf" >> .gitattributes
echo "*.ts text eol=lf" >> .gitattributes
```

### 3. **Use Environment Variables**
- Never commit sensitive data
- Use `.env` files for local development
- Use environment variables in production

### 4. **Regenerate Prisma Client When Switching Platforms**
```bash
# When switching from Windows to Docker or vice versa
npx prisma generate
```

## 📝 Quick Commands Reference

```bash
# Full reset (if things go wrong)
docker-compose down
docker system prune -f
docker-compose up --build

# Prisma reset
npx prisma migrate reset --force
npx prisma generate

# Check logs
docker-compose logs node-1

# Access container shell
docker exec -it <container_name> /bin/bash
```

## ✨ Team Development Workflow

1. **Clone repository**
2. **Setup environment variables**
3. **Use Docker for consistency**: `docker-compose up --build`
4. **Make changes in your IDE**
5. **Test using the API endpoints**
6. **Commit and push changes**

This setup ensures that the project works consistently across Windows, macOS, and Linux! 🎉
