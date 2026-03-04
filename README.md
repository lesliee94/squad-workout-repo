# 🏋️ Squad Workout Plan

> 团队健身计划展示站 — 自动部署到 GitHub Pages，方便队友随时查看训练动作。

## 📖 简介

这是一个极简的健身计划展示网站，数据以 JSON 文件管理，前端纯静态渲染，通过 GitHub Pages 自动部署。

## 🗂 项目结构

```
squad-workout-repo/
├── .github/workflows/pages-deploy.yml
├── data/
│   ├── index.json
│   ├── monday.json
│   ├── tuesday.json
│   ├── wednesday.json
│   ├── thursday.json
│   └── friday.json
├── assets/
│   ├── css/style.css
│   └── js/app.js
├── index.html
└── README.md
```

## 🚀 本地运行

```bash
# 克隆仓库
git clone https://github.com/lesliee94/squad-workout-repo.git
cd squad-workout-repo

# 使用任意静态服务器，例如：
npx serve .
# 或
python3 -m http.server 8080
```

然后在浏览器打开 `http://localhost:8080`。

## 🤝 贡献规范

欢迎队友提 PR！请遵循以下流程：

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feat/your-feature`
3. 提交更改：`git commit -m "feat: 描述你的改动"`
4. 推送分支：`git push origin feat/your-feature`
5. 创建 Pull Request

### 数据修改

- 训练数据存放在 `data/` 目录，格式为 JSON
- 修改后请确保 JSON 格式合法
- 新增训练部位需同步更新 `data/index.json`

## 📄 License

本项目仅供团队内部使用，版权归作者所有。