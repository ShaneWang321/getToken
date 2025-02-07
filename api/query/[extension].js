import { createClient } from '@vercel/postgres';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    const url = new URL(req.url);
    const extension = url.pathname.split('/').pop();

    if (!extension) {
      return new Response(JSON.stringify({ error: '缺少分機號碼' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = createClient();
    await client.connect();

    const { rows } = await client.query(
      'SELECT token, type FROM push_tokens WHERE extension = $1 ORDER BY created_at DESC LIMIT 1',
      [extension]
    );

    await client.end();

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: '找不到該分機號碼的token' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(rows[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('查詢token時發生錯誤:', error);
    return new Response(JSON.stringify({ error: '服務器內部錯誤' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}