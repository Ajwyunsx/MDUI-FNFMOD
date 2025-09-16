# 游戏模组收录站

一个现代化的游戏模组分享和管理平台，基于 Node.js、Express 和 Material Design (MDUI) 构建。

## 🌟 主要功能

### 模组管理
- **模组上传**：支持上传模组文件和预览图片
- **模组搜索**：实时搜索模组名称和描述
- **模组筛选**：按游戏和标签筛选模组
- **模组分类**：热门游戏分区展示
- **模组统计**：详细的模组使用统计

### 用户界面
- **响应式设计**：支持各种设备尺寸
- **现代化UI**：基于 MDUI 的美观界面
- **FNF专区**：Friday Night Funkin' 模组专区
- **游戏分区**：热门游戏分类展示

### 管理功能
- **管理后台**：完整的管理员后台系统
- **数据导入导出**：支持 JSON 格式的数据备份和恢复
- **缓存管理**：清理临时文件和缓存
- **统计分析**：详细的网站和模组统计信息

### 第三方集成
- **GameBanana API**：集成 GameBanana 平台 API
- **外部模组链接**：安全的外部模组访问
- **模组导入**：从 GameBanana 导入模组到本地

## 🛠️ 技术栈

### 后端
- **Node.js**：JavaScript 运行时环境
- **Express.js**：Web 应用框架
- **Multer**：文件上传处理
- **CORS**：跨域资源共享
- **FS-Extra**：文件系统操作

### 前端
- **Material Design (MDUI)**：UI 组件库
- **Material Icons**：图标字体
- **原生 JavaScript**：交互逻辑
- **CSS Grid & Flexbox**：响应式布局

### 开发工具
- **VSCode**：代码编辑器
- **Git**：版本控制
- **Node.js**：运行环境

## 📦 安装和运行

### 环境要求
- Node.js 14.0 或更高版本
- npm 或 yarn 包管理器

### 安装依赖
```bash
npm install
```

### 启动服务器
```bash
node server.js
```

### 访问网站
- 主页：http://localhost:8080
- 管理后台：http://localhost:8080/admin.html

## 📁 项目结构

```
game-mods-platform/
├── public/
│   ├── index.html          # 主页面
│   ├── mod.html             # 模组详情页
│   ├── admin.html          # 管理后台
│   ├── uploads/            # 上传的模组文件
│   ├── images/             # 上传的图片文件
│   └── ...
├── data/                   # 数据存储目录
├── server.js              # 服务器主文件
├── package.json           # 项目配置
└── README.md               # 项目说明
```

## 🔧 核心功能详解

### 模组管理系统
- **CRUD 操作**：创建、读取、更新、删除模组
- **文件处理**：支持多文件上传和类型检查
- **图片管理**：自动生成缩略图和占位符
- **数据验证**：表单验证和错误处理

### 搜索和筛选
- **实时搜索**：防抖优化的实时搜索功能
- **多条件筛选**：支持按游戏和标签组合筛选
- **搜索历史**：保存用户搜索历史
- **筛选器管理**：动态生成筛选选项

### 统计分析
- **访问统计**：模组访问量、下载量统计
- **用户行为**：点赞、收藏行为分析
- **热门排行**：热门模组和游戏排行
- **数据可视化**：直观的统计图表

### 管理后台
- **管理员认证**：基于 token 的认证系统
- **权限控制**：不同角色的权限管理
- **操作日志**：记录所有管理操作
- **批量操作**：支持批量导入导出

## 🎨 UI/UX 特性

### 响应式设计
- **移动优先**：适配手机、平板、桌面设备
- **触摸友好**：支持触摸手势操作
- **自适应布局**：根据屏幕尺寸自动调整

### 视觉效果
- **渐变背景**：Hero 区域的渐变色背景
- **卡片悬停**：模组卡片的悬停动画效果
- **过渡动画**：平滑的页面过渡效果
- **加载状态**：优雅的加载和错误状态显示

### 交互设计
- **即时反馈**：所有操作都有即时的视觉反馈
- **确认对话框**：重要操作前的确认提示
- **错误处理**：友好的错误提示和处理
- **辅助功能**：键盘导航和屏幕阅读器支持

## 🔒 安全特性

### 认证和授权
- **管理员登录**：安全的登录验证系统
- **Token 验证**：API 访问的 token 验证
- **文件类型检查**：上传文件的类型和大小验证
- **XSS 防护**：防止跨站脚本攻击

### 数据保护
- **数据备份**：自动和手动数据备份功能
- **访问控制**：精细的访问权限控制
- **日志记录**：完整的操作和访问日志
- **错误处理**：安全的错误信息处理

## 🚀 部署和扩展

### 开发环境部署
```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# 生产环境构建
npm run build
```

### 生产环境部署
1. **PM2 进程管理**：
```bash
npm install -g pm2
pm2 start server.js
```

2. **Nginx 反向代理**：
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. **Docker 容器化**：
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

### 功能扩展建议
- **用户系统**：添加用户注册、登录和个人资料
- **评论系统**：模组评论和评分功能
- **收藏系统**：用户收藏模组功能
- **通知系统**：邮件和站内通知
- **多语言支持**：国际化多语言界面
- **移动应用**：React Native 或 Flutter 移动应用

## 🤝 贡献指南

### 开发流程
1. Fork 项目仓库
2. 创建功能分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m 'Add your feature'`
4. 推送分支：`git push origin feature/your-feature`
5. 创建 Pull Request

### 代码规范
- 使用 ESLint 进行代码检查
- 遵循 Prettier 代码格式化
- 添加适当的注释和文档
- 编写测试用例覆盖新功能

### 问题反馈
- 使用 Issues 报告 bug 或建议功能
- 提供详细的问题复现步骤
- 包含相关的错误日志和截图

## 📄 许可证

本项目采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户。特别感谢：

- Material Design 团队提供优秀的 UI 组件
- Node.js 和 Express.js 社区提供强大的后端框架
- 所有贡献代码和提出建议的开源社区成员

---

## 📞 项目截图

### 主页面
- 热门游戏分区展示
- FNF 模组专区
- 模组卡片列表
- 搜索和筛选功能

### 管理后台
- 管理员登录界面
- 模组管理功能
- 数据统计展示
- 系统管理功能

### 模组详情页
- 模组详细信息展示
- 下载和举报功能
- 相关模组推荐
- 用户评价系统

---

**联系方式**：如有问题或建议，请通过 Issues 联系我们。

**最后更新**：2024年9月
