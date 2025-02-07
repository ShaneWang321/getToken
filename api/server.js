const express = require('express');
const cors = require('cors');
const registerRouter = require('./register');
const queryRouter = require('./query/[extension]');

const app = express();
const port = process.env.PORT || 3000;

// 中間件配置
app.use(cors());
app.use(express.json());

// API路由
app.use('/api/register', registerRouter);
app.use('/api/query', queryRouter);

// 靜態文件服務
app.use(express.static('public'));

// 啟動服務器
app.listen(port, () => {
    console.log(`服務器運行在端口 ${port}`);
});