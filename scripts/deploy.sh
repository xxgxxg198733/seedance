#!/bin/bash
set -e
# Seedance 部署脚本 — 直接在你的腾讯云服务器上运行
# 运行前先 cd 到项目目录

SERVER_DIR="/var/www/seedance"
echo "🚀 Deploying Seedance..."

# 1. 复制文件
sudo mkdir -p "$SERVER_DIR"
sudo rsync -av --delete \
  --exclude '.git' --exclude 'node_modules' --exclude '.next' \
  --exclude 'prisma/dev.db' \
  ./ "$SERVER_DIR/"
sudo chown -R $USER:$USER "$SERVER_DIR"
cd "$SERVER_DIR"

# 2. 安装 + 构建
npm install --production
npm run build
npx prisma generate

# 3. 数据库
if [ ! -f prisma/prod.db ]; then
  DATABASE_URL="file:./prisma/prod.db" npx prisma db push
fi

# 4. 启动
pm2 delete seedance 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

# 5. 检查 Nginx 配置是否已加
if ! grep -q "seedance" /etc/nginx/nginx.conf /etc/nginx/conf.d/*.conf 2>/dev/null; then
  echo ""
  echo "⚠️  请手动把 nginx-seedance.conf 加到 Nginx："
  echo "   sudo nano /etc/nginx/conf.d/seedance.conf"
  echo "   粘贴项目里的 nginx-seedance.conf 内容"
  echo "   sudo nginx -t && sudo systemctl reload nginx"
fi

echo ""
echo "✅ Deployed! 访问: http://你的IP/seedance"
pm2 status
