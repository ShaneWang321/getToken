import { createClient } from '@vercel/postgres';

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

    const client = createClient();
    await client.connect();

    // 插入或更新token記錄
    const { rows } = await client.query(
      `INSERT INTO push_tokens (extension, token, type, platform, created_at) 
       VALUES ($1, $2, $3, $4, NOW()) 
       ON CONFLICT (extension) 
       DO UPDATE SET token = $2, type = $3, platform = $4, created_at = NOW() 
       RETURNING *`,
      [extension, token, type, platform]
    );

    await client.end();

    return new Response(JSON.stringify({
      success: true,
      message: '推送token註冊成功',
      data: rows[0]
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