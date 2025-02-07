const express = require('express');
const router = express.Router();

router.get('/:extension', async (req, res) => {
    try {
        const { extension } = req.params;

        if (!extension) {
            return res.status(400).json({
                success: false,
                message: '缺少分機號碼'
            });
        }

        // TODO: 實際的查詢邏輯
        // 這裡應該添加與SIP服務器的交互邏輯

        return res.status(200).json({
            extension,
            status: '在線',
            lastUpdate: new Date().toISOString()
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: '服務器錯誤：' + error.message
        });
    }
});

module.exports = router;