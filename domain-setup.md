# 自定义域名配置指南

## 通过 Vercel CLI 添加域名

### 1. 添加域名
```bash
cd ai-projects-hub
vercel domains add yourdomain.com
```

### 2. 列出所有域名
```bash
vercel domains ls
```

### 3. 移除域名
```bash
vercel domains rm yourdomain.com
```

---

## DNS 配置示例

### 使用阿里云 DNS

1. 登录 https://dns.console.aliyun.com
2. 选择您的域名
3. 点击"解析设置"
4. 添加记录：

**CNAME 记录（推荐用于子域名）**
- 记录类型: CNAME
- 主机记录: ai-hub
- 记录值: cname.vercel-dns.com
- TTL: 10分钟

**A 记录（用于根域名）**
- 记录类型: A
- 主机记录: @
- 记录值: 76.76.21.21
- TTL: 10分钟

### 使用腾讯云 DNS

1. 登录 https://console.cloud.tencent.com/cns
2. 选择您的域名
3. 点击"解析"
4. 添加记录（配置同上）

### 使用 Cloudflare DNS

1. 登录 https://dash.cloudflare.com
2. 选择您的域名
3. 进入 DNS 管理
4. 添加记录（配置同上）
5. ⚠️ 注意：关闭橙色云朵（Proxy status），使用 "DNS only"

---

## 常见域名配置场景

### 场景1: 使用子域名
```
域名: ai-hub.yourdomain.com
DNS 记录类型: CNAME
DNS 记录值: cname.vercel-dns.com
```

### 场景2: 使用根域名
```
域名: yourdomain.com
DNS 记录类型: A
DNS 记录值: 76.76.21.21
```

### 场景3: 同时使用根域名和 www
```
域名1: yourdomain.com
- 类型: A
- 值: 76.76.21.21

域名2: www.yourdomain.com
- 类型: CNAME
- 值: cname.vercel-dns.com
```

---

## 验证 DNS 配置

### Windows 系统
```bash
# 检查 CNAME 记录
nslookup -type=CNAME ai-hub.yourdomain.com

# 检查 A 记录
nslookup yourdomain.com
```

### 使用在线工具
- https://dnschecker.org
- https://www.whatsmydns.net

---

## 常见问题

### Q1: DNS 配置后多久生效？
- **正常情况**: 5-30 分钟
- **最长时间**: 48 小时
- **加速方法**: 将 TTL 设置为最小值（如 60 秒或 5 分钟）

### Q2: 显示 "Invalid Configuration"？
- 检查 DNS 记录是否正确
- 确认域名解析已生效
- 在 Vercel 控制台点击 "Refresh" 重新验证

### Q3: HTTPS 证书问题？
- Vercel 自动提供免费 SSL 证书
- 首次配置可能需要几分钟
- 如果超过 1 小时未生效，联系 Vercel 支持

### Q4: 如何设置多个域名？
```bash
# 添加主域名
vercel domains add yourdomain.com

# 添加 www 域名
vercel domains add www.yourdomain.com

# 添加其他子域名
vercel domains add api.yourdomain.com
```

### Q5: 如何设置域名重定向？
在 Vercel 项目中创建 `vercel.json`:
```json
{
  "redirects": [
    {
      "source": "/",
      "destination": "https://yourdomain.com",
      "permanent": true
    }
  ]
}
```

---

## 完整配置流程图

```
购买域名
    ↓
登录 Vercel 控制台
    ↓
进入项目 Settings → Domains
    ↓
输入域名并点击 Add
    ↓
查看 Vercel 提供的 DNS 配置信息
    ↓
登录域名注册商控制台
    ↓
添加 DNS 记录（CNAME 或 A 记录）
    ↓
等待 DNS 生效（5-30分钟）
    ↓
回到 Vercel 点击 Refresh
    ↓
Vercel 自动配置 SSL 证书
    ↓
✅ 完成！通过自定义域名访问
```

---

## 快速操作命令

```bash
# 进入项目目录
cd ai-projects-hub

# 查看当前域名
vercel domains ls

# 添加新域名
vercel domains add your-custom-domain.com

# 重新部署（如有需要）
vercel --prod

# 检查部署状态
vercel inspect
```

---

## 需要帮助？

- Vercel 文档: https://vercel.com/docs/custom-domains
- Vercel 支持: https://vercel.com/support
- 域名 DNS 检查: https://dnschecker.org
