// Token註冊API處理函數
const { Storage } = require('../lib/storage');
const storage = new Storage();

module.exports = async (req, res) => {
    // 允許跨域請求
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 處理OPTIONS請求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 只接受POST請求
    if (req.method !== 'POST') {
        res.status(405).json({ error: '方法不允許' });
        return;
    }

    try {
        const { token, type, platform } = req.body;

        // 驗證必要參數
        if (!token || !type || !platform) {
            res.status(400).json({ error: '缺少必要參數' });
            return;
        }

        // 註冊token
        const tokenData = storage.addToken(token, { type, platform });

        res.status(200).json({
            success: true,
            message: 'Token註冊成功',
            data: tokenData
        });
    } catch (error) {
        console.error('Token註冊錯誤:', error);
        res.status(500).json({
            success: false,
            error: '服務器內部錯誤'
        });
    }
};