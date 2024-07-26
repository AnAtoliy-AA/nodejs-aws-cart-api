# Stage 1: Build
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Install production dependencies
RUN npm install --only=production

# Expose the port and run the application
EXPOSE 3000
CMD ["node", "dist/bundle.js"]
