# ─────────────────────────────────────────────
# Stage 1: Build Angular frontend
# ─────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build -- --configuration production

# ─────────────────────────────────────────────
# Stage 2: Build NestJS backend
# ─────────────────────────────────────────────
FROM node:20-alpine AS backend-builder
WORKDIR /backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ .
RUN node ./node_modules/@nestjs/cli/bin/nest.js build

# ─────────────────────────────────────────────
# Stage 3: Final monolito image
# ─────────────────────────────────────────────
FROM node:20-alpine

# Install nginx + supervisor (to run both processes)
RUN apk add --no-cache nginx supervisor

# ── Backend ──────────────────────────────────
WORKDIR /app/backend
COPY --from=backend-builder /backend/package*.json ./
RUN npm ci --omit=dev
COPY --from=backend-builder /backend/dist ./dist

# ── Frontend (static files served by nginx) ──
COPY --from=frontend-builder /frontend/dist/frontend/browser /usr/share/nginx/html

# ── Nginx config ─────────────────────────────
# Nginx listens on 8080 (Koyeb health check expects traffic on the port)
# /api  → NestJS on localhost:3000
# /     → Angular static (from /usr/share/nginx/html)
RUN rm /etc/nginx/http.d/default.conf 2>/dev/null || true
COPY docker/nginx-mono.conf /etc/nginx/http.d/default.conf

# ── Supervisord config ────────────────────────
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 8080

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
