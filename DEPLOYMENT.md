# Study-mate 服务器部署指南

## 1. 上传代码

将 `study-mate-server` 目录上传到服务器。

## 2. 安装依赖

```bash
npm install
```

## 3. 配置环境变量

```env
PORT=7003
API_PREFIX=/alibaba-ai/v1
DB_HOST=localhost
DB_USER=studymate
DB_PASSWORD=studymate123@
DB_NAME=study_mate
JWT_SECRET=replace_with_a_strong_secret
DASHSCOPE_API_KEY=your_dashscope_api_key
DASHSCOPE_MODEL=qwen-plus
```

## 4. 初始化数据库

```bash
mysql -u root -p < sql/init.sql
```

## 5. 启动服务

```bash
pm2 start app.js --name study-mate
pm2 save
```

## 6. 服务检查

```bash
curl http://服务器地址:7003/health
```
