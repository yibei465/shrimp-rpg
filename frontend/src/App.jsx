
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [wallet, setWallet] = useState(null);
  const [character, setCharacter] = useState(null);
  const [balance, setBalance] = useState('0');

  // 钱包连接
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        setWallet({ address, provider, signer });
        
        // 获取 SHRIMP 余额（模拟）
        setBalance('1000');
        
        // 创建默认角色
        if (!character) {
          setCharacter({
            name: '小聋虾',
            level: 1,
            exp: 0,
            class: '战士',
            stats: {
              strength: 10,
              intelligence: 10,
              agility: 10
            },
            equipment: {
              weapon: null,
              armor: null,
              accessory: null
            }
          });
        }
      } catch (error) {
        alert('钱包连接失败！');
      }
    } else {
      alert('请安装 MetaMask！');
    }
  };

  // 战斗系统
  const battle = async () => {
    if (!character) return;

    // 简单的战斗模拟
    const enemyPower = Math.floor(Math.random() * 50) + 30;
    const playerPower = character.stats.strength + character.stats.agility + character.level * 5;

    const victory = playerPower > enemyPower;
    const expGain = Math.floor(Math.random() * 50) + 20;
    const shrimpGain = Math.floor(Math.random() * 50) + 10;

    if (victory) {
      const newExp = character.exp + expGain;
      const newLevel = newExp >= character.level * 100 ? character.level + 1 : character.level;
      const expRemaining = newLevel > character.level ? newExp - character.level * 100 : newExp;

      setCharacter({
        ...character,
        level: newLevel,
        exp: expRemaining,
        stats: {
          ...character.stats,
          strength: character.stats.strength + (newLevel > character.level ? 2 : 0),
          intelligence: character.stats.intelligence + (newLevel > character.level ? 2 : 0),
          agility: character.stats.agility + (newLevel > character.level ? 2 : 0)
        }
      });

      setBalance(prev => (parseInt(prev) + shrimpGain).toString());

      alert(`🎉 胜利！获得 ${expGain} 经验和 ${shrimpGain} SHRIMP！`);
    } else {
      alert(`💀 战败了...敌人战力 ${enemyPower}，你的战力 ${playerPower}`);
    }
  };

  // 选择职业
  const selectClass = (className) => {
    setCharacter({
      ...character,
      class: className,
      stats: {
        strength: className === '战士' ? 15 : className === '法师' ? 5 : 10,
        intelligence: className === '法师' ? 15 : className === '射手' ? 5 : 10,
        agility: className === '射手' ? 15 : className === '战士' ? 5 : 10
      }
    });
  };

  return (
    <div className="container">
      {/* 头部 */}
      <div className="header">
        <h1>🦐 小聋虾链游 - Shrimp RPG</h1>
        <div className="wallet-info">
          {wallet ? (
            <>
              <div>
                <strong>钱包地址：</strong>
                {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
              </div>
              <div>
                <strong>SHRIMP 余额：</strong>
                {balance}
              </div>
            </>
          ) : (
            <button className="btn btn-primary" onClick={connectWallet}>
              连接钱包
            </button>
          )}
        </div>
      </div>

      {/* 导航栏 */}
      {wallet && (
        <div className="navbar">
          <div
            className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentPage('home')}
          >
            🏠 首页
          </div>
          <div
            className={`nav-item ${currentPage === 'character' ? 'active' : ''}`}
            onClick={() => setCurrentPage('character')}
          >
            🦐 角色
          </div>
          <div
            className={`nav-item ${currentPage === 'battle' ? 'active' : ''}`}
            onClick={() => setCurrentPage('battle')}
          >
            ⚔️ 战斗
          </div>
          <div
            className={`nav-item ${currentPage === 'equipment' ? 'active' : ''}`}
            onClick={() => setCurrentPage('equipment')}
          >
            🛡️ 装备
          </div>
          <div
            className={`nav-item ${currentPage === 'guild' ? 'active' : ''}`}
            onClick={() => setCurrentPage('guild')}
          >
            🏰 公会
          </div>
        </div>
      )}

      {/* 页面内容 */}
      {!wallet ? (
        <div className="game-grid">
          <div className="game-card">
            <h3>🎮 欢迎来到小聋虾链游！</h3>
            <p>
              在加密海洋深处，有一个神秘的虾王国。你是一只勇敢的小聋虾，
              为了保卫虾王国，你需要不断成长、战斗、收集装备！
            </p>
            <button className="btn btn-primary" onClick={connectWallet}>
              开始冒险！
            </button>
          </div>

          <div className="game-card">
            <h3>⭐ 游戏特色</h3>
            <ul style={{ textAlign: 'left', color: '#666', lineHeight: '2' }}>
              <li>🦐 角色养成系统</li>
              <li>⚔️ PVE 和 PVP 战斗</li>
              <li>🛡️ 装备升级强化</li>
              <li>🏰 公会系统</li>
              <li>💰 Play-to-Earn</li>
            </ul>
          </div>

          <div className="game-card">
            <h3>🎯 游戏目标</h3>
            <p>
              升级你的小聋虾角色，收集强力装备，加入或创建强大的公会，
              成为虾王国的最强者！
            </p>
          </div>
        </div>
      ) : currentPage === 'home' && character ? (
        <div className="character-card">
          <div className="character-avatar">🦐</div>
          <h2>{character.name} - Lv.{character.level}</h2>
          <p style={{ color: '#764ba2', fontSize: '1.2rem', margin: '15px 0' }}>
            职业：{character.class}
          </p>
          <p>经验值：{character.exp} / {character.level * 100}</p>

          <div className="stats-grid">
            <div className="stat-item">
              <strong>💪 {character.stats.strength}</strong>
              力量
            </div>
            <div className="stat-item">
              <strong>🧠 {character.stats.intelligence}</strong>
              智力
            </div>
            <div className="stat-item">
              <strong>⚡ {character.stats.agility}</strong>
              敏捷
            </div>
          </div>

          <div style={{ marginTop: '25px' }}>
            <button className="btn btn-primary" onClick={() => setCurrentPage('battle')}>
              ⚔️ 开始战斗！
            </button>
          </div>
        </div>
      ) : currentPage === 'character' && character ? (
        <div className="character-card">
          <h2>🎭 选择职业</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
            <div
              className="game-card"
              style={{ cursor: 'pointer', border: character.class === '战士' ? '3px solid #764ba2' : 'none' }}
              onClick={() => selectClass('战士')}
            >
              <h3>⚔️ 战士</h3>
              <p>高力量，擅长近战</p>
              <p style={{ color: '#764ba2' }}>力量+5</p>
            </div>
            <div
              className="game-card"
              style={{ cursor: 'pointer', border: character.class === '法师' ? '3px solid #764ba2' : 'none' }}
              onClick={() => selectClass('法师')}
            >
              <h3>🔮 法师</h3>
              <p>高智力，擅长魔法</p>
              <p style={{ color: '#764ba2' }}>智力+5</p>
            </div>
            <div
              className="game-card"
              style={{ cursor: 'pointer', border: character.class === '射手' ? '3px solid #764ba2' : 'none' }}
              onClick={() => selectClass('射手')}
            >
              <h3>🏹 射手</h3>
              <p>高敏捷，擅长远程</p>
              <p style={{ color: '#764ba2' }}>敏捷+5</p>
            </div>
          </div>
        </div>
      ) : currentPage === 'battle' && character ? (
        <div className="battle-arena">
          <h2>⚔️ 战斗竞技场</h2>
          <div className="battle-grid">
            <div className="battle-character">
              <div className="battle-avatar">🦐</div>
              <h3>{character.name}</h3>
              <p>Lv.{character.level}</p>
              <p>战力：{character.stats.strength + character.stats.agility + character.level * 5}</p>
            </div>
            <div style={{ fontSize: '3rem' }}>⚡</div>
            <div className="battle-character enemy">
              <div className="battle-avatar">👾</div>
              <h3>随机怪物</h3>
              <p>战力：???</p>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <button className="btn btn-primary" onClick={battle} style={{ fontSize: '1.2rem', padding: '15px 40px' }}>
              ⚔️ 开始战斗！
            </button>
          </div>
        </div>
      ) : currentPage === 'equipment' ? (
        <div className="game-card">
          <h2>🛡️ 装备系统</h2>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            收集强力装备，提升你的战斗力！
          </p>
          <div className="equipment-grid">
            <div className="equipment-item">
              <h4>⚔️ 武器</h4>
              <p>{character?.equipment?.weapon || '未装备'}</p>
            </div>
            <div className="equipment-item">
              <h4>🛡️ 盔甲</h4>
              <p>{character?.equipment?.armor || '未装备'}</p>
            </div>
            <div className="equipment-item">
              <h4>💍 饰品</h4>
              <p>{character?.equipment?.accessory || '未装备'}</p>
            </div>
          </div>
          <p style={{ marginTop: '20px', color: '#999', fontSize: '0.9rem' }}>
            * 装备功能开发中，敬请期待！
          </p>
        </div>
      ) : currentPage === 'guild' ? (
        <div className="game-card">
          <h2>🏰 公会系统</h2>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            创建或加入公会，和其他玩家一起冒险！
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            <div className="game-card">
              <h3>🏗️ 创建公会</h3>
              <p>创建你自己的公会，招募成员！</p>
              <button className="btn btn-primary" style={{ marginTop: '15px' }}>
                创建公会 (100 SHRIMP)
              </button>
            </div>
            <div className="game-card">
              <h3>🔍 加入公会</h3>
              <p>查找并加入其他公会！</p>
              <button className="btn btn-primary" style={{ marginTop: '15px' }}>
                查找公会
              </button>
            </div>
          </div>
          <p style={{ marginTop: '20px', color: '#999', fontSize: '0.9rem' }}>
            * 公会功能开发中，敬请期待！
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default App;
