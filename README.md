# 🚀 AI项目管理中心

[![部署状态](https://img.shields.io/badge/status-online-success)](https://ai-projects-hub.vercel.app)
[![技术栈](https://img.shields.io/badge/tech-DeepSeek%20AI-blue)](https://deepseek.com)
[![许可](https://img.shields.io/badge/license-MIT-green)](LICENSE)

一个美观、易用的AI项目管理平台，用于统一管理和快速访问多个AI应用项目。

## ✨ 特性

- 🎨 **现代化UI设计** - 渐变背景、卡片式布局、流畅动画
- 🚀 **快速启动** - 一键访问所有AI项目
- 📊 **项目管理** - 统一查看项目信息、功能特性
- 🔧 **易于扩展** - 简单配置即可添加新项目
- 📱 **响应式设计** - 支持各种屏幕尺寸

## 🎯 包含的项目

### 💰 小金智能助手
黄金价格查询与智能分析助手
- DeepSeek AI 智能对话
- 博查搜索联网功能
- R1推理过程展示
- 源引用标记功能

### 🤖 九章智启 AI开发平台
集成多种AI能力的综合开发平台
- DeepSeek AI模型集成
- 博查搜索联网
- 智能对话功能
- 平台能力展示

## 🚀 快速开始

### 在线访问
直接访问部署的网站：[ai-projects-hub.vercel.app](https://ai-projects-hub.vercel.app)

### 本地运行
1. 克隆仓库
```bash
git clone https://github.com/sherconan/ai-projects-hub.git
cd ai-projects-hub
```

2. 在浏览器中打开 `index.html`

## 📁 项目结构

```
ai-projects-hub/
├── index.html                    # 项目启动器主页
├── projects/                     # 所有项目
│   ├── xiaojin-platform/        # 小金智能助手
│   │   ├── index.html
│   │   └── config.json
│   └── ai-capabilities-hub/     # 九章智启平台
│       ├── index.html
│       └── config.json
└── README.md                    # 说明文档
```

## 🔧 添加新项目

1. 在 `projects/` 目录下创建新项目文件夹
2. 添加 `index.html` 和 `config.json`
3. 在主页 `index.html` 的 `projects` 数组中添加项目配置：

```javascript
{
  id: 'your-project',
  name: '项目名称',
  description: '项目描述',
  version: '1.0.0',
  icon: '🎯',
  color: '#5470ff',
  colorLight: '#667eea',
  tags: ['标签1', '标签2'],
  path: 'projects/your-project/index.html',
  features: ['功能1', '功能2']
}
```

## 🛠️ 技术栈

- **前端**: HTML5, CSS3, JavaScript (原生)
- **AI模型**: DeepSeek AI (DeepSeek-R1)
- **搜索引擎**: 博查搜索 API
- **Markdown**: Marked.js
- **部署**: Vercel

## 📝 更新日志

### v1.0.0 (2025-11-03)
- ✅ 创建项目启动器
- ✅ 集成小金智能助手
- ✅ 集成九章智启平台
- ✅ 优化回答格式展示
- ✅ 添加源引用标记功能
- ✅ 添加模型说明

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

## 📄 许可

MIT License

## 🙏 致谢

- [DeepSeek AI](https://deepseek.com) - AI模型支持
- [Claude Code](https://claude.com/claude-code) - 开发辅助
- [Vercel](https://vercel.com) - 免费托管

---

**Powered by DeepSeek AI & Claude Code**
