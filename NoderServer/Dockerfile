
FROM node:18

WORKDIR /app

# Copy package files and install dependencies first for better caching
COPY package.json package-lock.json* tsconfig.json* ./
RUN npm install -g ts-node-dev && npm install

# Copy source code
COPY ./src ./src

# Expose port
EXPOSE 3000

# Use ts-node-dev for hot-reloading
CMD ["npm", "run", "start"]
