const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 8080;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 创建必要的目录
const dirs = ['public/uploads', 'public/images', 'data'];
dirs.forEach(dir => fs.ensureDirSync(dir));

// 确保首页可以访问
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 模组详情页面路由
app.get('/mod.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mod.html'));
});

// 模拟数据
const modsData = [
  {
    id: 1,
    name: "超级猫猫包",
    game: "Minecraft",
    author: "CatLover99",
    description: "一个超级可爱的猫猫主题模组包，包含多种猫猫皮肤和物品",
    version: "1.0.0",
    downloads: 15420,
    likes: 892,
    image: "https://picsum.photos/seed/catmod1/400/300.jpg",
    fileUrl: "/uploads/cat-mod-1.zip",
    createdAt: "2024-01-15",
    tags: ["动物", "可爱", "材质包"]
  },
  {
    id: 2,
    name: "赛博朋克猫",
    game: "Cyberpunk 2077",
    author: "TechCat",
    description: "将游戏中的所有NPC替换成赛博朋克风格的猫猫",
    version: "2.1.0",
    downloads: 8756,
    likes: 623,
    image: "https://picsum.photos/seed/cybercat2/400/300.jpg",
    fileUrl: "/uploads/cyber-cat-2.zip",
    createdAt: "2024-02-20",
    tags: ["角色", "科幻", "猫"]
  },
  {
    id: 3,
    name: "魔法猫咪冒险",
    game: "Stardew Valley",
    author: "WitchCat",
    description: "添加新的魔法猫咪角色和相关的魔法物品",
    version: "1.5.2",
    downloads: 12389,
    likes: 756,
    image: "https://picsum.photos/seed/magiccat3/400/300.jpg",
    fileUrl: "/uploads/magic-cat-3.zip",
    createdAt: "2024-03-10",
    tags: ["角色", "魔法", "冒险"]
  }
];

// 文件上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'image') {
      cb(null, 'public/images/');
    } else {
      cb(null, 'public/uploads/');
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// API 路由

// API 路由
app.get('/api/mods', (req, res) => {
  const { game, tag, search } = req.query;
  let filteredMods = [...modsData];

  if (game) {
    filteredMods = filteredMods.filter(mod => mod.game.toLowerCase().includes(game.toLowerCase()));
  }

  if (tag) {
    filteredMods = filteredMods.filter(mod => mod.tags.includes(tag));
  }

  if (search) {
    filteredMods = filteredMods.filter(mod => 
      mod.name.toLowerCase().includes(search.toLowerCase()) ||
      mod.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json(filteredMods);
});

app.get('/api/mods/:id', (req, res) => {
  const mod = modsData.find(m => m.id === parseInt(req.params.id));
  if (mod) {
    res.json(mod);
  } else {
    res.status(404).json({ error: '模组未找到' });
  }
});

app.post('/api/mods', upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), (req, res) => {
  const { name, game, author, description, version, tags } = req.body;
  
  const newMod = {
    id: modsData.length + 1,
    name,
    game,
    author,
    description,
    version,
    downloads: 0,
    likes: 0,
    image: req.files.image ? `/images/${req.files.image[0].filename}` : '/images/default.jpg',
    fileUrl: req.files.file ? `/uploads/${req.files.file[0].filename}` : '',
    createdAt: new Date().toISOString().split('T')[0],
    tags: tags ? tags.split(',').map(tag => tag.trim()) : []
  };

  modsData.push(newMod);
  res.status(201).json(newMod);
});

app.post('/api/mods/:id/like', (req, res) => {
  const mod = modsData.find(m => m.id === parseInt(req.params.id));
  if (mod) {
    mod.likes += 1;
    res.json({ likes: mod.likes });
  } else {
    res.status(404).json({ error: '模组未找到' });
  }
});

app.get('/api/games', (req, res) => {
  const games = [...new Set(modsData.map(mod => mod.game))];
  res.json(games);
});

app.get('/api/tags', (req, res) => {
  const tags = [...new Set(modsData.flatMap(mod => mod.tags))];
  res.json(tags);
});

// 管理功能 API

// 导出数据
app.get('/api/export', (req, res) => {
  try {
    const exportData = {
      mods: modsData,
      exportTime: new Date().toISOString(),
      version: '1.0.0'
    };
    
    res.json(exportData);
  } catch (error) {
    console.error('导出数据失败:', error);
    res.status(500).json({ error: '导出失败' });
  }
});

// 导入数据
app.post('/api/import', (req, res) => {
  try {
    const { mods } = req.body;
    
    if (mods && Array.isArray(mods)) {
      // 清空现有数据
      modsData.length = 0;
      
      // 导入新数据
      mods.forEach(mod => {
        modsData.push(mod);
      });
      
      res.json({ success: true, importedCount: mods.length });
    } else {
      res.status(400).json({ error: '无效的数据格式' });
    }
  } catch (error) {
    console.error('导入数据失败:', error);
    res.status(500).json({ error: '导入失败' });
  }
});

// 清理缓存
app.post('/api/clear-cache', (req, res) => {
  try {
    // 清理上传目录中的临时文件
    const uploadsDir = path.join(__dirname, 'public/uploads');
    const imagesDir = path.join(__dirname, 'public/images');
    
    let clearedItems = 0;
    
    // 清理uploads目录
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      files.forEach(file => {
        const filePath = path.join(uploadsDir, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
          clearedItems++;
        }
      });
    }
    
    // 清理images目录（除了默认图片）
    if (fs.existsSync(imagesDir)) {
      const files = fs.readdirSync(imagesDir);
      files.forEach(file => {
        if (file !== 'default.jpg') {
          const filePath = path.join(imagesDir, file);
          if (fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
            clearedItems++;
          }
        }
      });
    }
    
    res.json({ success: true, clearedItems });
  } catch (error) {
    console.error('清理缓存失败:', error);
    res.status(500).json({ error: '清理失败' });
  }
});

// 获取详细统计信息
app.get('/api/stats', (req, res) => {
  try {
    // 基本统计
    const totalMods = modsData.length;
    const totalDownloads = modsData.reduce((sum, mod) => sum + mod.downloads, 0);
    const totalLikes = modsData.reduce((sum, mod) => sum + mod.likes, 0);
    const totalGames = new Set(modsData.map(mod => mod.game)).size;
    
    // 标签统计
    const tagCounts = {};
    modsData.forEach(mod => {
      mod.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    const topTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
    
    // 游戏统计
    const gameCounts = {};
    modsData.forEach(mod => {
      gameCounts[mod.game] = (gameCounts[mod.game] || 0) + 1;
    });
    
    const topGames = Object.entries(gameCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name, mods]) => ({ name, mods }));
    
    res.json({
      totalMods,
      totalDownloads,
      totalLikes,
      totalGames,
      topTags,
      topGames
    });
  } catch (error) {
    console.error('获取统计失败:', error);
    res.status(500).json({ error: '获取统计失败' });
  }
});

// 管理员认证API

// 管理员登录
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  // 简单的管理员验证（实际应用中应该使用数据库和密码哈希）
  if (username === 'admin' && password === 'admin123') {
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
    res.json({ 
      success: true, 
      token: token,
      message: '登录成功' 
    });
  } else {
    res.status(401).json({ success: false, message: '用户名或密码错误' });
  }
});

// 验证管理员token
function verifyAdminToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = req.query.token || (authHeader && authHeader.split(' ')[1]);
  
  if (!token) {
    return res.status(401).json({ success: false, message: '未提供认证令牌' });
  }
  
  // 简单的token验证（实际应用中应该使用JWT）
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    if (decoded.includes('admin')) {
      req.adminUser = decoded.split(':')[0];
      next();
    } else {
      res.status(401).json({ success: false, message: '无效的认证令牌' });
    }
  } catch (error) {
    res.status(401).json({ success: false, message: '无效的认证令牌' });
  }
}

// 管理员模组管理API

// 获取所有模组（管理员）
app.get('/api/admin/mods', verifyAdminToken, (req, res) => {
  res.json(modsData);
});

// 添加模组（管理员）
app.post('/api/admin/mods', verifyAdminToken, (req, res) => {
  const { name, game, author, description, version, tags, downloads, likes, image, fileUrl } = req.body;
  
  const newMod = {
    id: modsData.length > 0 ? Math.max(...modsData.map(m => m.id)) + 1 : 1,
    name,
    game,
    author,
    description,
    version: version || '1.0.0',
    downloads: parseInt(downloads) || 0,
    likes: parseInt(likes) || 0,
    image: image || `https://picsum.photos/seed/mod${Date.now()}/400/300.jpg`,
    fileUrl: fileUrl || '',
    createdAt: new Date().toISOString().split('T')[0],
    tags: tags ? tags.split(',').map(tag => tag.trim()) : []
  };

  modsData.push(newMod);
  res.status(201).json({ success: true, mod: newMod });
});

// 更新模组（管理员）
app.put('/api/admin/mods/:id', verifyAdminToken, (req, res) => {
  const modId = parseInt(req.params.id);
  const modIndex = modsData.findIndex(m => m.id === modId);
  
  if (modIndex === -1) {
    return res.status(404).json({ success: false, message: '模组未找到' });
  }

  const { name, game, author, description, version, tags, downloads, likes, image, fileUrl } = req.body;
  
  modsData[modIndex] = {
    ...modsData[modIndex],
    name: name || modsData[modIndex].name,
    game: game || modsData[modIndex].game,
    author: author || modsData[modIndex].author,
    description: description || modsData[modIndex].description,
    version: version || modsData[modIndex].version,
    downloads: parseInt(downloads) || modsData[modIndex].downloads,
    likes: parseInt(likes) || modsData[modIndex].likes,
    image: image || modsData[modIndex].image,
    fileUrl: fileUrl || modsData[modIndex].fileUrl,
    tags: tags || modsData[modIndex].tags
  };

  res.json({ success: true, mod: modsData[modIndex] });
});

// 删除模组（管理员）
app.delete('/api/admin/mods/:id', verifyAdminToken, (req, res) => {
  const modId = parseInt(req.params.id);
  const modIndex = modsData.findIndex(m => m.id === modId);
  
  if (modIndex === -1) {
    return res.status(404).json({ success: false, message: '模组未找到' });
  }

  modsData.splice(modIndex, 1);
  res.json({ success: true, message: '模组删除成功' });
});

// 管理员页面路由
app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// GameBanana API 集成

// 获取 GameBanana FNF 模组
app.get('/api/gamebanana/fnf-mods', async (req, res) => {
  try {
    const response = await fetch('https://api.gamebanana.com/Core/Item/Data?itemtype=Mod&gameid=3827&page=1&itemsperpage=20');
    const data = await response.json();
    
    // 转换数据格式
    const mods = data.records.map(record => ({
      id: record._idRow,
      name: record._sName,
      description: record._sDescription || '暂无描述',
      game: 'Friday Night Funkin\'',
      author: record._aSubmitter._sName,
      downloads: record._nDownloadCount,
      likes: record._nLikeCount,
      image: record._sPreviewImageUrl || 'https://picsum.photos/seed/fnf' + record._idRow + '/400/300.jpg',
      fileUrl: record._aDownloadUrl,
      createdAt: new Date(record._tsDateUpdated).toISOString().split('T')[0],
      tags: ['FNF', '模组', '节奏游戏'],
      source: 'GameBanana',
      sourceId: record._idRow
    }));
    
    res.json({
      mods: mods,
      total: data._nTotalItems,
      page: data._nPage,
      totalPages: data._nTotalPages
    });
  } catch (error) {
    console.error('获取 GameBanana 模组失败:', error);
    res.status(500).json({ error: '获取 GameBanana 模组失败' });
  }
});

// 从 GameBanana 导入模组
app.post('/api/gamebanana/import', verifyAdminToken, async (req, res) => {
  const { modId } = req.body;
  
  try {
    // 获取模组详细信息
    const detailResponse = await fetch(`https://api.gamebanana.com/Core/Item/Data?itemtype=Mod&id=${modId}`);
    const detail = await detailResponse.json();
    
    // 获取模组文件信息
    const filesResponse = await fetch(`https://api.gamebanana.com/Core/Item/Files?itemtype=Mod&id=${modId}`);
    const files = await filesResponse.json();
    
    const newMod = {
      name: detail._sName,
      game: 'Friday Night Funkin\'',
      author: detail._aSubmitter._sName,
      description: detail._sDescription || '从 GameBanana 导入的模组',
      version: detail._sVersion || '1.0.0',
      downloads: detail._nDownloadCount || 0,
      likes: detail._nLikeCount || 0,
      image: detail._sPreviewImageUrl || `https://picsum.photos/seed/gamebanana${modId}/400/300.jpg`,
      fileUrl: files.length > 0 ? files[0]._sDownloadUrl : '',
      createdAt: new Date().toISOString().split('T')[0],
      tags: ['FNF', 'GameBanana', '导入'],
      source: 'GameBanana',
      sourceId: modId
    };
    
    // 添加到数据库
    modsData.push(newMod);
    
    res.json({ 
      success: true, 
      mod: newMod,
      message: '成功从 GameBanana 导入模组'
    });
  } catch (error) {
    console.error('从 GameBanana 导入模组失败:', error);
    res.status(500).json({ error: '导入失败' });
  }
});

// 健康检查API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    modsCount: modsData.length
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
