// 數據存儲類
class Storage {
    constructor() {
        this.users = new Map();
        this.tokens = new Map();
        this.extensionToToken = new Map();
        this.tokenToExtension = new Map();
    }

    addToken(token, data) {
        const tokenData = {
            ...data,
            registeredAt: new Date().toISOString(),
            lastUpdate: new Date().toISOString()
        };

        this.tokens.set(token, tokenData);

        // 如果token已經關聯到某個分機，更新用戶信息
        const extension = this.tokenToExtension.get(token);
        if (extension) {
            const userInfo = this.users.get(extension);
            if (userInfo) {
                this.users.set(extension, {
                    ...userInfo,
                    platform: data.platform,
                    type: data.type,
                    lastUpdate: new Date().toISOString()
                });
            }
        }

        return tokenData;
    }

    getToken(token) {
        return this.tokens.get(token);
    }

    getAllTokens() {
        return Array.from(this.tokens.entries()).map(([token, data]) => ({
            token,
            ...data
        }));
    }

    removeToken(token) {
        const extension = this.tokenToExtension.get(token);
        if (extension) {
            this.tokenToExtension.delete(token);
            this.extensionToToken.delete(extension);
        }
        return this.tokens.delete(token);
    }
}

module.exports = { Storage };