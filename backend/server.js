
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 数据文件
const DATA_FILE = path.join(process.cwd(), 'data.json');

// 初始化数据
const initData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({
      users: [],
      characters: [],
      battles: [],
      equipment: [],
      guilds: []
    }, null, 2));
  }
};

initData();

// 读取数据
const readData = () => {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
};

// 写入数据
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// 欢迎路由
app.get('/', (req, res) => {
  res.json({
    name: '🦐 小聋虾链游 API',
    version: '1.0.0',
    status: 'running'
  });
});

// 用户路由
app.get('/api/users/:address', (req, res) => {
  const data = readData();
  const user = data.users.find(u => u.address.toLowerCase() === req.params.address.toLowerCase());
  res.json(user || null);
});

app.post('/api/users', (req, res) => {
  const data = readData();
  const newUser = {
    id: Date.now(),
    address: req.body.address,
    shrimpBalance: 1000,
    createdAt: new Date().toISOString()
  };
  data.users.push(newUser);
  writeData(data);
  res.json(newUser);
});

// 角色路由
app.get('/api/characters/:address', (req, res) => {
  const data = readData();
  const character = data.characters.find(c => c.owner.toLowerCase() === req.params.address.toLowerCase());
  res.json(character || null);
});

app.post('/api/characters', (req, res) => {
  const data = readData();
  const newCharacter = {
    id: Date.now(),
    owner: req.body.address,
    name: req.body.name || '小聋虾',
    level: 1,
    exp: 0,
    class: req.body.class || '战士',
    stats: {
      strength: 10,
      intelligence: 10,
      agility: 10
    },
    equipment: {
      weapon: null,
      armor: null,
      accessory: null
    },
    createdAt: new Date().toISOString()
  };
  data.characters.push(newCharacter);
  writeData(data);
  res.json(newCharacter);
});

app.put('/api/characters/:address', (req, res) => {
  const data = readData();
  const index = data.characters.findIndex(c => c.owner.toLowerCase() === req.params.address.toLowerCase());
  if (index !== -1) {
    data.characters[index] = { ...data.characters[index], ...req.body };
    writeData(data);
    res.json(data.characters[index]);
  } else {
    res.status(404).json({ error: 'Character not found' });
  }
});

// 战斗路由
app.post('/api/battles', (req, res) => {
  const data = readData();
  const newBattle = {
    id: Date.now(),
    player: req.body.player,
    enemy: req.body.enemy,
    result: req.body.result,
    expGain: req.body.expGain,
    shrimpGain: req.body.shrimpGain,
    createdAt: new Date().toISOString()
  };
  data.battles.push(newBattle);
  writeData(data);
  res.json(newBattle);
});

// 公会路由
app.get('/api/guilds', (req, res) => {
  const data = readData();
  res.json(data.guilds);
});

app.post('/api/guilds', (req, res) => {
  const data = readData();
  const newGuild = {
    id: Date.now(),
    name: req.body.name,
    leader: req.body.leader,
    members: [req.body.leader],
    createdAt: new Date().toISOString()
  };
  data.guilds.push(newGuild);
  writeData(data);
  res.json(newGuild);
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🦐 小聋虾链游 API 运行在 http://localhost:${PORT}`);
});
