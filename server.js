const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// 配置和常量
const config = {
    port: process.env.PORT || 3001
};

// 數據存儲
class Storage {
    constructor() {
        this.users = new Map();
        this.tokens = new Map();
        this.extensionToToken = new Map();
        this.tokenToExtension = new Map();
        this.getAllTokens = this.getAllTokens.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
    }

    addUser(extension, data) {
        const { token, ...userData } = data;
        const tokenData = this.tokens.get(token);
        
        const userInfo = {
            ...userData,
            token,
            status: '已註冊',
            platform: tokenData ? tokenData.platform : undefined,
            type: tokenData ? tokenData.type : undefined,
            lastUpdate: new Date().toISOString()
        };

        this.users.set(extension, userInfo);
        this.extensionToToken.set(extension, token);
        this.tokenToExtension.set(token, extension);

        // 如果已經有token數據，更新用戶信息
        if (tokenData) {
            this.updateUserToken(extension, token);
        }

        return userInfo;
    }

    addToken(token, data) {
        const tokenData = {
            ...data,
            registeredAt: new Date().toISOString()
        };
        this.tokens.set(token, tokenData);
        
        // 檢查是否有關聯的用戶
        const extension = this.tokenToExtension.get(token);
        if (extension) {
            this.updateUserToken(extension, token);
        }

        return tokenData;
    }

    updateUserToken(extension, token) {
        const user = this.getUser(extension);
        const tokenData = this.getToken(token);
        
        if (user && tokenData) {
            const updatedUser = {
                ...user,
                token,
                platform: tokenData.platform,
                type: tokenData.type,
                lastUpdate: new Date().toISOString()
            };
            
            this.users.set(extension, updatedUser);
            this.extensionToToken.set(extension, token);
            this.tokenToExtension.set(token, extension);
            
            return updatedUser;
        }
        return null;
    }

    getUser(extension) {
        return this.users.get(extension);
    }

    getToken(token) {
        return this.tokens.get(token);
    }

    getAllTokens() {
        return Array.from(this.tokens.entries()).map(([token, data]) => {
            return {
                token,
                ...data
            };
        });
    }

    getAllUsers() {
        return Array.from(this.users.entries()).map(([extension, data]) => {
            return {
                extension,
                ...data
            };
        });
    }
}

// 錯誤處理中間件
const errorHandler = (err, req, res, next) => {
    console.error('錯誤:', err.stack);
    res.status(500).json({
        status: 'error',
        message: '服務器內部錯誤',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

// 請求驗證中間件
const validateRequest = (requiredFields) => {
    return (req, res, next) => {
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({
                    status: 'error',
                    message: `缺少必要參數: ${field}`
                });
            }
        }
        next();
    };
};

// 應用初始化
class App {
    constructor() {
        this.app = express();
        this.storage = new Storage();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    setupMiddleware() {
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(express.static('.'));
    }

    setupRoutes() {
        // 用戶註冊路由
        this.app.post('/api/register',
            validateRequest(['extension', 'password', 'token']),
            (req, res) => {
                const { extension, password, token } = req.body;
                this.storage.addUser(extension, { extension, password, token });
                res.json({
                    status: 'success',
                    message: '註冊成功'
                });
            });

        // Token註冊路由
        this.app.post('/api/register-token',
            validateRequest(['token', 'type', 'platform']),
            (req, res) => {
                try {
                    const { token, type, platform } = req.body;
                    if (this.storage.getToken(token)) {
                        // 如果token已存在，更新數據
                        this.storage.addToken(token, { type, platform });
                        res.json({
                            status: 'success',
                            message: 'Token更新成功'
                        });
                    } else {
                        // 新token註冊
                        this.storage.addToken(token, { type, platform });
                        res.json({
                            status: 'success',
                            message: 'Token註冊成功'
                        });
                    }
                } catch (error) {
                    res.status(500).json({
                        status: 'error',
                        message: '服務器處理失敗'
                    });
                }
            });

        // 獲取所有token
        this.app.get('/api/tokens', (req, res) => {
            const tokens = this.storage.getAllTokens();
            res.json({
                status: 'success',
                data: tokens
            });
        });

        // 獲取所有用戶
        this.app.get('/api/users', (req, res) => {
            const users = this.storage.getAllUsers();
            res.json({
                status: 'success',
                data: users
            });
        });

        // 用戶查詢路由
        this.app.get('/api/query/:extension', (req, res) => {
            const { extension } = req.params;
            const user = this.storage.getUser(extension);

            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: '用戶不存在'
                });
            }

            const { password, ...userInfo } = user;
            res.json({
                status: 'success',
                data: userInfo
            });
        });
    }

    setupErrorHandling() {
        this.app.use(errorHandler);
    }

    start() {
        try {
            this.app.listen(config.port, () => {
                console.log(`服務器運行在端口 ${config.port}`);
            });
        } catch (error) {
            console.error('服務器啟動失敗:', error);
            process.exit(1);
        }
    }
}

// 啟動應用
const server = new App();
server.start();
