# Study-mate API 文档

后端默认前缀：`/alibaba-ai/v1`

## 用户认证

- `POST /login`
- `POST /register`
- `GET /user/info`
- `PUT /user/info`

## AI 学习助手

- `POST /message`
  - 入参：`msgContent`、`msgType`、`conversationId`
  - 用途：向 Study-mate 多智能体学习助手发送课程问题、错题、资源生成需求或学习计划需求。
- `GET /message`
  - 入参：`conversationId`、`current`、`size`

## 学习对话

- `POST /conversation`
- `GET /conversation`
- `GET /conversation/:id`
- `PUT /conversation/:id`
- `DELETE /conversation/:id`
- `POST /conversation/:id/generate-title`

## 学情诊断

现有接口名称保持兼容，业务含义为学习画像诊断结果。

- `POST /questionnaireResults/savePhq9Result`
- `GET /questionnaireResults/listByUserId/:userId`
- `GET /questionnaireResults/latestByUserId/:userId`
- `GET /questionnaireResults/:id`
- `DELETE /questionnaireResults/:id`
- `GET /questionnaireResults/count`

## 学习导师预约

现有字段名保持数据库兼容：`doctor*` 表示导师，`patient*` 表示学习者，`consultationContent` 表示学习需求。

- `POST /appointment/saveAppointment`
- `GET /appointment/list`
- `GET /appointment/listByDoctorId/:doctorId`
- `GET /appointment/listByPatientPhone/:patientPhone`
- `GET /appointment/:id`
- `PUT /appointment`
- `DELETE /appointment/:id`
- `GET /appointment/count`
