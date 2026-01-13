# --- Giai đoạn 1: Build (Cài đặt dependencies) ---
FROM node:18-alpine AS builder
# Cài đặt dos2unix để xử lý file từ Windows ngay tại đây
RUN apk add --no-cache dos2unix

WORKDIR /app
COPY package*.json ./
RUN npm install --production=false

# Copy toàn bộ code vào builder
COPY . .

# Sửa lỗi xuống dòng của Windows ngay trong builder
RUN dos2unix migrate.sh && chmod +x migrate.sh

# Loại bỏ các thư viện dev nếu cần (optional)
RUN npm prune --production

# --- Giai đoạn 2: Runtime (Chạy thực tế) ---
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# Chỉ copy những thứ cần thiết từ stage builder sang
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

# Expose cổng của bạn
EXPOSE 3000

# Chạy migration rồi mới chạy server
ENTRYPOINT ["sh", "-c", "./migrate.sh && node src/server.js"]