
FROM node:18

WORKDIR /app

# Copy package files and install dependencies first for better caching
COPY package.json package-lock.json* tsconfig.json* ./

# Copy prisma schema
COPY prisma ./prisma

# Install global dependencies and project dependencies
RUN npm install -g ts-node-dev prisma && npm install

# Generate Prisma client (important for cross-platform compatibility)
RUN npx prisma generate

# Copy source code
COPY ./src ./src

# Create uploads directory for file uploads
RUN mkdir -p uploads/products

# Expose port
EXPOSE 3000

# Use ts-node-dev for hot-reloading
CMD ["npm", "run", "start"]
