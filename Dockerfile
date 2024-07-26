# Stage 1: Build
FROM node:20 AS build

RUN mkdir /app

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./


# Copy all source files
COPY . .

# List files in the directory to verify
RUN ls -l

# install dependencies
RUN  npm install
# Build the application
RUN npm run build

# Stage 2: Runtime
FROM node:20-slim

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Install only production dependencies
RUN npm prune --production

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/bundle.js"]
