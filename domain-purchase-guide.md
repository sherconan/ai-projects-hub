# 域名购买与配置完整指南

## 第一步：在阿里云购买域名（推荐）

### 1.1 访问阿里云域名注册
https://wanwang.aliyun.com

### 1.2 搜索想要的域名
- 输入域名前缀（如：`ai-hub`, `xiaojin`, `ai-projects`）
- 查看可用性和价格
- 推荐后缀：
  - `.com` - 最专业，约 55 元/年
  - `.cn` - 中国域名，约 29 元/年
  - `.top` - 便宜，约 10 元/年
  - `.xyz` - 新颖，约 8 元/年

### 1.3 加入购物车并购买
- 选择 1 年或多年
- 勾选同意协议
- 支付宝/微信支付

### 1.4 完成实名认证
- 上传身份证照片
- 填写个人信息
- 等待审核（通常 1-2 小时）

---

## 第二步：配置 DNS 解析

### 2.1 登录阿里云控制台
https://dns.console.aliyun.com

### 2.2 找到您的域名
- 点击域名后面的"解析"按钮

### 2.3 添加解析记录

#### 情况1：使用子域名（如 ai.yourdomain.com）

点击"添加记录"：
```
记录类型: CNAME
主机记录: ai (或您想要的前缀)
解析路线: 默认
记录值: cname.vercel-dns.com
TTL: 10 分钟
```

#### 情况2：使用根域名（如 yourdomain.com）

点击"添加记录"：
```
记录类型: A
主机记录: @
解析路线: 默认
记录值: 76.76.21.21
TTL: 10 分钟
```

#### 情况3：同时使用根域名和 www

添加两条记录：

**记录1：根域名**
```
记录类型: A
主机记录: @
记录值: 76.76.21.21
```

**记录2：www 子域名**
```
记录类型: CNAME
主机记录: www
记录值: cname.vercel-dns.com
```

### 2.4 保存配置
- 点击"确认"
- DNS 记录立即生效（完全生效需要 5-30 分钟）

---

## 第三步：在 Vercel 添加自定义域名

### 3.1 访问 Vercel 项目设置
https://vercel.com/jessisherconan-gmailcoms-projects/ai-projects-hub/settings/domains

### 3.2 添加域名
- 输入您购买的域名（如：`ai.yourdomain.com` 或 `yourdomain.com`）
- 点击 "Add"

### 3.3 等待验证
- Vercel 会自动检测 DNS 配置
- 显示 "Valid Configuration" 表示成功
- 如果显示错误，点击 "Refresh" 重新检测

### 3.4 等待 SSL 证书配置
- Vercel 自动申请免费 SSL 证书
- 通常需要 2-5 分钟
- 完成后会显示绿色锁标志 🔒

---

## 第四步：验证域名是否生效

### 方法1：浏览器访问
直接在浏览器输入您的域名，看是否能打开网站

### 方法2：命令行检查（Windows）

```bash
# 检查 DNS 解析
nslookup yourdomain.com

# 检查 CNAME 记录
nslookup -type=CNAME ai.yourdomain.com
```

### 方法3：在线工具
访问 https://dnschecker.org 检查全球 DNS 解析情况

---

## 常见问题解决

### Q1: DNS 配置了但 Vercel 显示 "Invalid Configuration"
**解决方案：**
1. 检查 DNS 记录是否正确
2. 等待 10-30 分钟让 DNS 完全生效
3. 在 Vercel 点击 "Refresh" 重新验证
4. 使用 `nslookup` 命令检查 DNS 是否生效

### Q2: 显示 "Too Many Requests"
**解决方案：**
- 等待一段时间（通常 1 小时）再重试
- Vercel 对域名验证有频率限制

### Q3: SSL 证书一直不生效
**解决方案：**
1. 确保 DNS 记录正确
2. 等待最多 24 小时
3. 检查域名是否正确指向 Vercel
4. 如仍不行，联系 Vercel 支持

### Q4: 想要多个域名指向同一个项目
**解决方案：**
```bash
# 使用 CLI 添加多个域名
cd ai-projects-hub
vercel domains add yourdomain.com
vercel domains add www.yourdomain.com
vercel domains add ai.yourdomain.com
```

在阿里云为每个域名添加对应的 DNS 记录

### Q5: 如何设置默认域名？
在 Vercel 项目的 Domains 页面，点击域名右侧的三个点，选择 "Set as Primary"

---

## 完整配置流程时间线

```
购买域名: 5-10 分钟
    ↓
实名认证: 1-2 小时
    ↓
配置 DNS: 2-3 分钟
    ↓
DNS 生效: 5-30 分钟
    ↓
Vercel 添加域名: 1 分钟
    ↓
SSL 证书配置: 2-5 分钟
    ↓
✅ 完成！总耗时约 2-3 小时
```

---

## 推荐域名示例

根据您的项目，这些域名都不错：

**小金智能助手相关：**
- `xiaojin.top`
- `gold-ai.com`
- `ai-gold.cn`
- `jinzhu.top`

**AI 项目管理中心相关：**
- `ai-hub.top`
- `ai-projects.com`
- `myai.top`
- `ai-platform.cn`

**组合型：**
- `xiaojin-ai.com`
- `goldhelper.top`
- `ai-helper.cn`

---

## 使用 Vercel CLI 快速配置

购买域名并配置好 DNS 后，使用命令行快速添加：

```bash
# 1. 进入项目目录
cd C:\Users\liupengyang\ai-projects-hub

# 2. 添加域名
vercel domains add yourdomain.com

# 3. 添加 www 子域名
vercel domains add www.yourdomain.com

# 4. 查看所有域名
vercel domains ls

# 5. 检查域名状态
vercel domains inspect yourdomain.com
```

---

## 域名购买预算参考

### 经济型方案（10-30 元/年）
- `.top` 域名: 10 元/年
- `.xyz` 域名: 8 元/年
- `.site` 域名: 15 元/年

### 标准型方案（30-60 元/年）
- `.cn` 域名: 29 元/年
- `.com` 域名: 55 元/年
- `.net` 域名: 69 元/年

### 推荐购买时长
- 首次购买: 1 年（测试使用）
- 确定长期使用: 3-5 年（通常有折扣）

---

## 需要帮助？

如果您决定购买域名并需要配置帮助，告诉我：
1. 您购买的域名是什么
2. 在哪个平台购买的

我会为您提供详细的配置指导！
