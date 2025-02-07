import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import registerRouter from './register/route.js';
import queryRouter from './query/[extension].js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// 中間件配置
app.use(cors());
app.use(express.json());

// API路由
app.use('/api/register', registerRouter);
app.use('/api/query', queryRouter);

// 靜態文件服務
app.use(express.static(join(__dirname, '../../public')));

// 啟動服務器
app.listen(port, () => {
    console.log(`服務器運行在端口 ${port}`);
});