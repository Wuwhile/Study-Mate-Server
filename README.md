# Study-mate 后端服务器

Study-mate 后端基于 Node.js、Express 和 MySQL，提供账户认证、学习对话、诊断结果、学习规划预约等接口。后端面向服务器部署，不要求在前端目录本地运行。

## 主要能力

- 用户注册、登录、资料管理和登录日志。
- 基于通义千问兼容接口的 AI 学习助手。
- 对话历史、标题生成和消息分页。
- 学情诊断结果保存与查询。
- 学习导师预约、预约记录和统计。

## 环境变量

```env
PORT=7003
API_PREFIX=/alibaba-ai/v1
DB_HOST=localhost
DB_USER=studymate
DB_PASSWORD=studymate123@
DB_NAME=study_mate
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=7d
DASHSCOPE_API_KEY=your_dashscope_api_key
DASHSCOPE_MODEL=qwen-plus
```

## 部署概要

```bash
npm install
mysql -u root -p < sql/init.sql
npm start
```

生产环境建议使用 PM2：

```bash
pm2 start app.js --name study-mate
pm2 save
```

服务检查：

```bash
curl http://服务器地址:7003/health
```
