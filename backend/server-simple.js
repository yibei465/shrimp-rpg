
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 内存数据存储
let data = {
  users: [],
  characters: [],
  battles: [],
  equipment: [],
  guilds: []
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
  const user = data.users.find(u => u.address.toLowerCase() === req.params.address.toLowerCase());
  res.json(user || null);
});

app.post('/api/users', (req, res) => {
  const newUser = {
    id: Date.now(),
    address: req.body.address,
    shrimpBalance: 1000,
    createdAt: new Date().toISOString()
  };
  data.users.push(newUser);
  res.json(newUser);
});

// 角色路由
app.get('/api/characters/:address', (req, res) => {
  const character = data.characters.find(c => c.owner.toLowerCase() === req.params.address.toLowerCase());
  res.json(character || null);
});

app.post('/api/characters', (req, res) => {
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
  res.json(newCharacter);
});

app.put('/api/characters/:address', (req, res) => {
  const index = data.characters.findIndex(c => c.owner.toLowerCase() === req.params.address.toLowerCase());
  if (index !== -1) {
    data.characters[index] = { ...data.characters[index], ...req.body };
    res.json(data.characters[index]);
  } else {
    res.status(404).json({ error: 'Character not found' });
  }
});

// 战斗路由
app.post('/api/battles', (req, res) => {
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
  res.json(newBattle);
});

// 公会路由
app.get('/api/guilds', (req, res) => {
  res.json(data.guilds);
});

app.post('/api/guilds', (req, res) => {
  const newGuild = {
    id: Date.now(),
    name: req.body.name,
    leader: req.body.leader,
    members: [req.body.leader],
    createdAt: new Date().toISOString()
  };
  data.guilds.push(newGuild);
  res.json(newGuild);
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🦐 小聋虾链游 API 运行在 http://localhost:${PORT}`);
});
