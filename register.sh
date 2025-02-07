#!/bin/bash

# 設置API端點
API_URL="http://localhost:3000/api/register"

# 設置請求參數
EXTENSION="1234"  # 替換為您的分機號碼
PASSWORD="password123"  # 替換為您的密碼
TOKEN="your-push-token"  # 替換為您的推送token

# 構建JSON請求體
JSON_DATA='{"extension":"'"$EXTENSION"'","password":"'"$PASSWORD"'","token":"'"$TOKEN"'"}'

# 發送POST請求
curl -X POST "$API_URL" \
     -H "Content-Type: application/json" \
     -d "$JSON_DATA" \
     -v

# -X POST: 指定HTTP方法為POST
# -H: 設置請求頭，指定內容類型為JSON
# -d: 發送JSON格式的數據
# -v: 顯示詳細的請求和響應信息