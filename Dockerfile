# Dockerfile für Perfect Tour (Vite React App)

# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Package files kopieren
COPY package*.json ./

# Dependencies installieren
RUN npm ci --only=production

# Source code kopieren
COPY . .

# Vite Build
RUN npm run build

# Production Stage
FROM nginx:alpine

# Nginx-Konfiguration kopieren
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx.conf für SPA
COPY nginx.conf /etc/nginx/nginx.conf

# Port freigeben
EXPOSE 80

# Nginx starten
CMD ["nginx", "-g", "daemon off;"]