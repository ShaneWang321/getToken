import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_FILE = join(process.cwd(), 'data', 'tokens.json');

// 確保數據目錄存在
async function ensureDataDirectory() {
  const dataDir = dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// 讀取所有token數據
async function readTokens() {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // 如果文件不存在，返回空數組
      return [];
    }
    throw error;
  }
}

// 保存token數據
async function saveTokens(tokens) {
  await ensureDataDirectory();
  await fs.writeFile(DATA_FILE, JSON.stringify(tokens, null, 2));
}

// 查詢特定分機的最新token
async function getToken(extension) {
  const tokens = await readTokens();
  return tokens.find(t => t.extension === extension);
}

// 註冊或更新token
async function registerToken(tokenData) {
  const tokens = await readTokens();
  const index = tokens.findIndex(t => t.extension === tokenData.extension);
  
  if (index >= 0) {
    tokens[index] = { ...tokenData, created_at: new Date().toISOString() };
  } else {
    tokens.push({ ...tokenData, created_at: new Date().toISOString() });
  }
  
  await saveTokens(tokens);
  return tokens.find(t => t.extension === tokenData.extension);
}

export {
  getToken,
  registerToken
};