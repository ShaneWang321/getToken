// API端點配置
const API_CONFIG = {
    baseUrl: 'https://get-token-softphone.vercel.app',
    endpoints: {
        register: '/api/register',
        query: '/api/query'
    }
};

// 頁面加載完成後的初始化
document.addEventListener('DOMContentLoaded', () => {
    // 註冊表單提交事件處理
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', handleRegister);

    // 初始化標籤頁
    initializeTabs();
});

// 處理註冊表單提交
async function handleRegister(event) {
    event.preventDefault();
    
    const extension = document.getElementById('extension').value;
    const password = document.getElementById('password').value;
    
    try {
        // 獲取推送token
        const token = await getPushToken();
        
        // 發送註冊請求
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.register}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                extension,
                password,
                token
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            showMessage('註冊成功！', 'success');
            registerForm.reset();
        } else {
            throw new Error(data.message || '註冊失敗');
        }
    } catch (error) {
        showMessage(`錯誤：${error.message}`, 'error');
    }
}

// 查詢用戶信息
async function queryInfo() {
    const extension = document.getElementById('queryExtension').value;
    
    if (!extension) {
        showMessage('請輸入分機號碼', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.query}/${extension}`);
        const data = await response.json();
        
        if (response.ok) {
            const resultDiv = document.getElementById('queryResult');
            resultDiv.innerHTML = `
                <h3>查詢結果</h3>
                <p>分機號碼：${data.data.extension}</p>
                <p>註冊狀態：${data.data.status}</p>
                <p>最後更新：${new Date(data.data.lastUpdate).toLocaleString()}</p>
                <p>推送Token：${data.data.token}</p>
            `;
        } else {
            throw new Error(data.message || '查詢失敗');
        }
    } catch (error) {
        showMessage(`錯誤：${error.message}`, 'error');
    }
}

// 獲取推送Token
async function getPushToken() {
    // 這裡需要與iOS應用程序進行通信
    // 暫時返回一個模擬的token
    return 'sample_push_token';
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

// 初始化標籤頁
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tablinks');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            openTab(event, button.textContent === '註冊帳號' ? 'Register' : 'Query');
        });
    });
}

// 切換標籤頁
function openTab(event, tabName) {
    const tabcontents = document.getElementsByClassName('tabcontent');
    for (let content of tabcontents) {
        content.style.display = 'none';
    }

    const tablinks = document.getElementsByClassName('tablinks');
    for (let link of tablinks) {
        link.className = link.className.replace(' active', '');
    }

    document.getElementById(tabName).style.display = 'block';
    event.currentTarget.className += ' active';
}
