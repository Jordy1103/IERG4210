# Azure VM 部署指南

## 前置準備
- ✅ Node.js 和 npm 已在 Azure VM 上安裝
- ✅ SSH 私鑰: `ierg4210.pem`
- ✅ Azure VM IP: `20.199.85.138`
- ✅ Azure VM 用戶: `IERG4210`

## 部署步驟

### 步驟 1: 上傳文件到 Azure VM

在你的 **Windows PowerShell** 或 **cmd** 上運行此命令：

```powershell
scp -r -i "C:\Users\jordy\Downloads\ierg4210.pem" "C:\Documents\Github\IERG4210\*" IERG4210@20.199.85.138:~/website/
```

**注意**：
- 確保 `ierg4210.pem` 文件路徑正確
- 確保源文件夾路徑正確
- 如果看到 permission denied，檢查私鑰文件權限

### 步驟 2: SSH 進入 Azure VM

```bash
ssh -i "C:\Users\jordy\Downloads\ierg4210.pem" IERG4210@20.199.85.138
```

### 步驟 3: 運行部署腳本

在 Azure VM 上執行：

```bash
cd ~/website
chmod +x deploy.sh
./deploy.sh
```

或者手動執行以下命令：

```bash
cd ~/website
npm install
npm start
```

## 訪問應用

部署完成後，訪問：
```
http://20.199.85.138:3000/
```

## 問題排除

### 連接被拒絕
- 檢查 Azure VM 的安全組規則（Security Group Rules）
- 確保允許 TCP 3000 端口的入站流量（Inbound rule）

### Port 已被占用
如果 3000 端口已被使用，指定不同端口：
```bash
PORT=8080 npm start
```
然後訪問：`http://20.199.85.138:8080/`

### npm install 失敗
```bash
npm cache clean --force
npm install
```

### 數據庫問題
確保 `uploads` 目錄存在：
```bash
mkdir -p ~/website/uploads/thumbnails
```

## 後台運行應用（可選）

使用 PM2 讓應用在後台運行：

```bash
npm install -g pm2
pm2 start server.js --name "ecommerce"
pm2 startup
pm2 save
```

查看日誌：
```bash
pm2 logs ecommerce
```

## 更新應用

如果需要更新代碼：

```bash
# 停止應用
npm stop  # 或 pm2 stop ecommerce

# 上傳新文件
scp -r -i "C:\Users\jordy\Downloads\ierg4210.pem" "C:\Documents\Github\IERG4210\*" IERG4210@20.199.85.138:~/website/

# 重新安裝依賴（如有更改）
cd ~/website
npm install

# 重新啟動
npm start  # 或 pm2 restart ecommerce
```
