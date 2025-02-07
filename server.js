const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// 中間件配置
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// 創建SQLite數據庫連接
const db = new sqlite3.Database('devices.db', (err) => {
    if (err) {
        console.error('數據庫連接錯誤:', err);
    } else {
        console.log('成功連接到SQLite數據庫');
        // 創建設備表
        db.run(`CREATE TABLE IF NOT EXISTS devices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            extension TEXT NOT NULL,
            token TEXT NOT NULL,
            platform TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// 設備註冊端點
app.post('/api/register-device', (req, res) => {
    const { extension, token, platform } = req.body;

    if (!extension || !token || !platform) {
        return res.status(400).json({
            success: false,
            message: '缺少必要參數'
        });
    }

    // 更新或插入設備記錄
    db.run(`INSERT OR REPLACE INTO devices (extension, token, platform, updated_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
        [extension, token, platform],
        function(err) {
            if (err) {
                console.error('註冊設備錯誤:', err);
                return res.status(500).json({
                    success: false,
                    message: '設備註冊失敗'
                });
            }

            res.json({
                success: true,
                message: '設備註冊成功',
                deviceId: this.lastID
            });
        }
    );
});

// 獲取所有註冊設備
app.get('/api/devices', (req, res) => {
    db.all('SELECT * FROM devices ORDER BY updated_at DESC', [], (err, rows) => {
        if (err) {
            console.error('獲取設備列表錯誤:', err);
            return res.status(500).json({
                success: false,
                message: '獲取設備列表失敗'
            });
        }

        res.json({
            success: true,
            devices: rows
        });
    });
});

// 刪除設備註冊
app.delete('/api/devices/:extension', (req, res) => {
    const { extension } = req.params;

    db.run('DELETE FROM devices WHERE extension = ?', [extension], function(err) {
        if (err) {
            console.error('刪除設備錯誤:', err);
            return res.status(500).json({
                success: false,
                message: '刪除設備失敗'
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                success: false,
                message: '未找到指定設備'
            });
        }

        res.json({
            success: true,
            message: '設備已成功刪除'
        });
    });
});

// 啟動服務器
app.listen(port, () => {
    console.log(`服務器運行在 http://localhost:${port}`);
});