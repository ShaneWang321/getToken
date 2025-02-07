import { NextResponse } from 'next/server';

export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new NextResponse(JSON.stringify({
            success: false,
            message: '不支持的請求方法'
        }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    try {
        const { extension, password, token } = await req.json();

        if (!extension || !password || !token) {
            return new NextResponse(JSON.stringify({
                success: false,
                message: '缺少必要參數'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // TODO: 實際的註冊邏輯
        // 這裡應該添加與SIP服務器的交互邏輯

        return new NextResponse(JSON.stringify({
            success: true,
            message: '註冊成功'
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({
            success: false,
            message: '服務器錯誤：' + error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}