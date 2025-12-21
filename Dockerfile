# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy tsconfig, types, and source files
COPY tsconfig.json ./
COPY types ./types
COPY src ./src

# Build TypeScript
RUN npx tsc

# Expose port
EXPOSE 5000

# Run the app
CMD ["node", "dist/server.js"]
