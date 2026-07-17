const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.DASHSCOPE_API_KEY;
    this.baseUrl = 'https://dashscope.aliyuncs.com/compatible-mode/v1';
    this.model = process.env.DASHSCOPE_MODEL || 'qwen-plus';

    if (!this.apiKey) {
      console.warn('DASHSCOPE_API_KEY is not configured. Study-mate AI replies will use fallback text.');
    }
  }

  async chat(messages, options = {}) {
    try {
      if (!this.apiKey) {
        return this.getFallbackReply();
      }

      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.model,
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 1024,
          top_p: options.top_p || 0.8
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      const choice = response.data && response.data.choices && response.data.choices[0];
      return choice ? choice.message.content : this.getFallbackReply();
    } catch (error) {
      console.error('DashScope chat request failed:', error.message);
      return this.getFallbackReply();
    }
  }

  async *chatStream(messages, options = {}) {
    try {
      if (!this.apiKey) {
        yield { type: 'content', content: this.getFallbackReply() };
        yield { type: 'done', usage: null };
        return;
      }

      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.model,
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 1024,
          top_p: options.top_p || 0.8,
          stream: true,
          stream_options: { include_usage: true }
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000,
          responseType: 'stream'
        }
      );

      for await (const chunk of response.data) {
        const lines = chunk.toString().split('\n');
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6);
          if (!jsonStr || jsonStr === '[DONE]') continue;

          try {
            const data = JSON.parse(jsonStr);
            const choice = data.choices && data.choices[0];
            if (!choice) continue;

            if (choice.delta && choice.delta.content) {
              yield { type: 'content', content: choice.delta.content };
            }
            if (choice.finish_reason === 'stop') {
              yield { type: 'done', usage: data.usage || null };
            }
          } catch (error) {
            console.warn('Failed to parse DashScope stream chunk:', jsonStr);
          }
        }
      }
    } catch (error) {
      console.error('DashScope streaming request failed:', error.message);
      yield { type: 'error', content: error.message };
    }
  }

  getFallbackReply() {
    const replies = [
      '我可以先帮你拆解学习目标，再生成一份可执行的资源清单。',
      '请告诉我课程、章节、当前基础和截止时间，我会给你定制学习路径。',
      '这个问题可以分成概念理解、例题练习和复盘检查三步来处理。',
      '你可以发一段错题或代码，我会先分析错误原因，再给出同类训练题。',
      '我建议先定位薄弱知识点，再生成讲义、练习和复习卡片。'
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }
}

module.exports = new AIService();
