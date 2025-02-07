// 數據存儲類
class Storage {
    constructor() {
        this.tokens = new Map();
    }

    addToken(token, data) {
        const tokenData = {
            ...data,
            registeredAt: new Date().toISOString(),
            lastUpdate: new Date().toISOString()
        };

        this.tokens.set(token, tokenData);
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
        return this.tokens.delete(token);
    }
}

module.exports = { Storage };