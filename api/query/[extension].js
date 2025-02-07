import { getToken } from '../utils/storage.js';

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

    const tokenData = await getToken(extension);

    if (!tokenData) {
      return new Response(JSON.stringify({ error: '找不到該分機號碼的token' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      token: tokenData.token,
      type: tokenData.type
    }), {
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