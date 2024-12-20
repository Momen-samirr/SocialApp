FROM node:18-bookworm-slim

# Set the working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 5173

# Correct CMD syntax
CMD ["pnpm", "run", "dev"]
