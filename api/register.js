import { kv } from '@vercel/kv';
import express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { extension, password, token, domain, platform, type } = req.body;

        if (!extension || !password || !token || !domain) {
            return res.status(400).json({
                success: false,
                message: '缺少必要參數'
            });
        }

        // 使用KV存儲保存token信息
        const tokenKey = `token:${extension}`;
        await kv.set(tokenKey, {
            token,
            domain,
            platform,
            type,
            updatedAt: new Date().toISOString()
        }, { ex: 86400 }); // 24小時過期

        return res.status(200).json({
            success: true,
            message: '註冊成功'
        });
    } catch (error) {
        console.error('Token註冊錯誤:', error);
        return res.status(500).json({
            success: false,
            message: '服務器錯誤：' + error.message
        });
    }
});

export default router;