const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const aiService = require('../services/aiService');

exports.sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { msgContent, msgType = 'text', conversationId } = req.body;

    if (!msgContent) {
      return res.status(400).json({ code: 400, message: '消息内容不能为空' });
    }

    if (!conversationId) {
      return res.status(400).json({ code: 400, message: '缺少对话ID' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || conversation.user_id !== userId) {
      return res.status(403).json({ code: 403, message: '无权访问该对话' });
    }

    const userMessage = await Message.create({
      userId,
      conversationId,
      content: msgContent,
      messageType: msgType,
      fromUserId: userId
    });

    const conversationHistory = await Message.findByConversationId(conversationId, 1, 100);
    const recentMessages = conversationHistory.records || [];

    const messages = [
      {
        role: 'system',
        content:
          '你是 Study-mate 的学习多智能体总控助手。请围绕个性化学习提供帮助：先识别学习目标、基础水平和薄弱知识点，再给出讲义、例题、练习、复习计划或项目任务。回答要清晰、可执行，必要时模拟诊断智能体、资源生成智能体、答疑智能体、计划智能体和评价智能体协同工作。不要输出非学习场景的专业建议。'
      }
    ];

    const historyToUse = recentMessages.slice(0, 10).reverse();
    for (const msg of historyToUse) {
      if (msg.id === userMessage.id) continue;
      messages.push({
        role: msg.fromUserId === 0 ? 'assistant' : 'user',
        content: msg.msgContent || msg.content
      });
    }

    messages.push({ role: 'user', content: msgContent });

    let fullAIReply = '';
    for await (const chunk of aiService.chatStream(messages, {
      temperature: 0.7,
      max_tokens: 900
    })) {
      if (chunk.type === 'content') fullAIReply += chunk.content;
      if (chunk.type === 'error') throw new Error(chunk.content);
    }

    if (!fullAIReply) {
      fullAIReply = '我暂时没有生成出结果。请补充课程、章节、当前基础和你希望得到的资源类型。';
    }

    const aiMessage = await Message.create({
      userId,
      conversationId,
      content: fullAIReply,
      messageType: msgType,
      fromUserId: 0
    });

    await Conversation.updateTitle(conversationId, conversation.title);

    return res.json({
      code: 200,
      message: '消息发送成功',
      data: {
        userMessage: {
          id: userMessage.id,
          msgContent: userMessage.content,
          msgType: userMessage.messageType,
          fromUserId: userMessage.fromUserId,
          time: userMessage.createdAt
        },
        aiMessage: {
          id: aiMessage.id,
          msgContent: aiMessage.content,
          msgType: aiMessage.messageType,
          fromUserId: aiMessage.fromUserId,
          time: aiMessage.createdAt
        }
      }
    });
  } catch (error) {
    console.error('发送学习消息失败:', error);
    return res.status(500).json({
      code: 500,
      message: '发送学习消息失败: ' + error.message
    });
  }
};

exports.getMessageList = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversationId = req.query.conversationId;
    const current = parseInt(req.query.current) || 1;
    const size = parseInt(req.query.size) || 20;

    if (current < 1 || size < 1) {
      return res.status(400).json({ code: 400, message: '分页参数无效' });
    }

    let result;
    if (conversationId) {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation || conversation.user_id !== userId) {
        return res.status(403).json({ code: 403, message: '无权访问该对话' });
      }
      result = await Message.findByConversationId(conversationId, current, size);
    } else {
      result = await Message.findByUserId(userId, current, size);
    }

    return res.json({
      code: 200,
      message: '获取消息成功',
      data: {
        records: result.records,
        total: result.total,
        size: result.size,
        current: result.current,
        pages: result.pages
      }
    });
  } catch (error) {
    console.error('获取学习消息列表失败:', error);
    return res.status(500).json({
      code: 500,
      message: '获取学习消息列表失败: ' + error.message
    });
  }
};
