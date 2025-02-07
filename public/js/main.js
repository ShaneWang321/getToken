// API端點配置
const API_CONFIG = {
    baseUrl: 'https://get-token-softphone.vercel.app',
    endpoints: {
        registerToken: '/api/register-token'
    },
    retryConfig: {
        maxRetries: 3,
        retryDelay: 1000
    }
};

// 頁面加載完成後的初始化
document.addEventListener('DOMContentLoaded', () => {
    // 模擬獲取並註冊token
    simulateTokenRegistration();
});

// 延遲函數
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// 帶重試機制的fetch函數
async function fetchWithRetry(url, options) {
    let lastError;
    
    for (let i = 0; i < API_CONFIG.retryConfig.maxRetries; i++) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            lastError = error;
            if (i < API_CONFIG.retryConfig.maxRetries - 1) {
                await delay(API_CONFIG.retryConfig.retryDelay * (i + 1));
            }
        }
    }
    
    throw lastError;
}

// 模擬token註冊過程
async function simulateTokenRegistration() {
    try {
        // 模擬獲取token（實際應用中這裡會從iOS應用獲取）
        const tokenData = {
            token: 'sample_push_token_' + Date.now(),
            type: 'voip',
            platform: 'ios'
        };

        // 發送註冊請求
        const data = await fetchWithRetry(
            `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.registerToken}`,
            {
                method: 'POST',
                body: JSON.stringify(tokenData)
            }
        );
        
        showMessage('Token註冊成功！', 'success');
        updateTokenInfo(tokenData);
    } catch (error) {
        showMessage(`錯誤：${error.message}`, 'error');
        console.error('註冊失敗：', error);
    }
}

// 更新Token信息顯示
function updateTokenInfo(tokenData) {
    const tokenInfo = document.getElementById('tokenInfo');
    tokenInfo.innerHTML = `
        <p><strong>Token:</strong> ${tokenData.token}</p>
        <p><strong>類型:</strong> ${tokenData.type}</p>
        <p><strong>平台:</strong> ${tokenData.platform}</p>
        <p><strong>註冊時間:</strong> ${new Date().toLocaleString()}</p>
    `;
}

// 顯示消息
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = type;
    
    // 3秒後自動隱藏消息
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = '';
    }, 3000);
}