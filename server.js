// server.js - 纯文本总结的最终简化版

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai'); // 只需 openai 库

const app = express();
const PORT = 3000;

// --- 初始化 OpenAI 客户端 ---
const openai = new OpenAI({
    apiKey: process.env.ARK_API_KEY,
    baseURL: process.env.ARK_API_URL,
});

// --- 中间件 ---
app.use(cors());
app.use(express.json());
app.use(express.static('./')); // 托管前端文件

// --- API 接口 (只保留文本总结) ---
app.post('/api/summarize', async (req, res) => {
    const { text } = req.body;
    if (!text || text.trim() === '') {
        return res.status(400).json({ error: '需要总结的文本不能为空' });
    }
    
    try {
        console.log("后端收到总结请求，正在调用大模型API...");
        const response = await openai.chat.completions.create({
            model: 'doubao-seed-1-6-250615',
            messages: [
                {
                    role: 'system',
                    content: '你是智慧助手小新，请对用户输入的内容，以亲切的、口语化的、适合老年人阅读的风格，进行一段总结，并提炼出1-3个核心要点。'
                },
                {
                    role: 'user',
                    content: text 
                }
            ],
        });

        const summary = response.choices[0].message.content;
        console.log("成功从AI获取总结。");
        res.json({ summary });

    } catch (error) {
        console.error('AI总结失败:', error);
        res.status(500).json({ error: 'AI总结服务调用失败，请检查API Key或网络连接。' });
    }
});

// --- 启动服务器 ---
app.listen(PORT, () => {
    console.log(`后端服务已启动 (纯文本模式)，正在监听 http://localhost:${PORT}`);
});