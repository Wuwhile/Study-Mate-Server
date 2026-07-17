# Study-mate 数据库说明

默认数据库：`study_mate`

## 核心表

- `users`：用户账户、手机号、邮箱、头像等基础信息。
- `login_logs`：用户登录日志。
- `conversations`：学习对话会话。
- `messages`：AI 学习助手消息记录。
- `questionnaire_results`：学习画像诊断结果。历史字段 `depression_level` 在 Study-mate 中作为诊断等级使用。
- `appointments`：学习导师预约。历史字段 `doctor_*` 表示导师，`patient_*` 表示学习者，`consultation_content` 表示学习需求。

## 兼容说明

为降低迁移风险，部分表名和字段名沿用旧接口结构，但所有业务文案和使用语义已切换为 Study-mate 的学习系统场景。
