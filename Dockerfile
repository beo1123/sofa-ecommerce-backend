# FILE: Dockerfile
# --- builder ---
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install --production=false
COPY . .
RUN npm prune --production

# --- runtime ---
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

RUN chmod +x migrate.sh

EXPOSE 3000

ENTRYPOINT ["sh", "-c", "./migrate.sh && node src/server.js"]
