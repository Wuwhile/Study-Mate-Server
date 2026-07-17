# Study-mate 开发指南

## 代码结构

- `controllers/`：业务控制器。
- `models/`：MySQL 数据访问。
- `routes/`：Express 路由。
- `services/aiService.js`：通义千问兼容接口封装。
- `sql/`：初始化脚本和迁移脚本。

## 开发约定

- 保持现有接口路径兼容。
- 新学习业务优先围绕学习画像、资源生成、AI 答疑、计划智能体和评价智能体扩展。
- 历史字段名可以兼容保留，但新增文案必须使用 Study-mate 学习场景。
