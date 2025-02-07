const API_CONFIG = {
    baseUrl: '/api'
};

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const extension = document.getElementById('extension').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_CONFIG.baseUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                extension,
                password,
                token: 'dummy-token' // 實際應用中需要從iOS應用獲取
            })
        });

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        alert('註冊失敗：' + error.message);
    }
});

document.getElementById('queryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const extension = document.getElementById('queryExtension').value;
    const resultDiv = document.getElementById('queryResult');

    try {
        const response = await fetch(`${API_CONFIG.baseUrl}/query/${extension}`);
        const data = await response.json();

        resultDiv.innerHTML = `
            <div class="alert alert-info">
                <p><strong>分機號碼：</strong>${data.extension}</p>
                <p><strong>註冊狀態：</strong>${data.status}</p>
                <p><strong>最後更新：</strong>${data.lastUpdate}</p>
            </div>
        `;
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="alert alert-danger">
                查詢失敗：${error.message}
            </div>
        `;
    }
});