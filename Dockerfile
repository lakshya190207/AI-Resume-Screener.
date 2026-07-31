# Multi-stage production build for TalentMatrix AI Resume Screener
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build production bundle
COPY . .
RUN npm run build

# Production web server container
FROM nginx:alpine

# Copy built static assets to Nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for production traffic
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
