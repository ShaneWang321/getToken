import { NextResponse } from 'next/server';

export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    if (req.method !== 'GET') {
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
        const url = new URL(req.url);
        const extension = url.pathname.split('/').pop();

        if (!extension) {
            return new NextResponse(JSON.stringify({
                success: false,
                message: '缺少分機號碼'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // TODO: 實際的查詢邏輯
        // 這裡應該添加與SIP服務器的交互邏輯

        return new NextResponse(JSON.stringify({
            extension,
            status: '在線',
            lastUpdate: new Date().toISOString()
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