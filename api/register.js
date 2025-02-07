const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { extension, password, token } = req.body;

        if (!extension || !password || !token) {
            return res.status(400).json({
                success: false,
                message: '缺少必要參數'
            });
        }

        // TODO: 實際的註冊邏輯
        // 這裡應該添加與SIP服務器的交互邏輯

        return res.status(200).json({
            success: true,
            message: '註冊成功'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: '服務器錯誤：' + error.message
        });
    }
});

module.exports = router;