import { registerToken } from '../utils/storage.js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: '不支持的請求方法' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { extension, password, token, type = 'background', domain, platform = 'ios' } = await req.json();

    if (!extension || !password || !token || !domain) {
      return new Response(JSON.stringify({ error: '缺少必要參數' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const tokenData = await registerToken({
      extension,
      token,
      type,
      platform
    });

    return new Response(JSON.stringify({
      success: true,
      message: '推送token註冊成功',
      data: tokenData
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('註冊token時發生錯誤:', error);
    return new Response(JSON.stringify({ error: '服務器內部錯誤' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}