// Phaser-based Match-3 Game Scene
// Integrates with the 100-level roadmap system

import Phaser from 'phaser';
import { getLevelById } from '../data/levelRoadmap';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    
    // Game state
    this.levelConfig = null;
    this.grid = [];
    this.gems = [];
    this.selectedGem = null;
    this.isAnimating = false;
    this.score = 0;
    this.moves = 0;
    this.timeLeft = 0;
    this.objectives = [];
    this.powerUps = [];
    this.obstacles = [];
    
    // Game settings
    this.cellSize = 64;
    this.gridOffsetX = 0;
    this.gridOffsetY = 0;
    this.gemTypes = ['ruby', 'sapphire', 'emerald', 'diamond', 'topaz'];
    this.gemColors = [0xff0000, 0x0000ff, 0x00ff00, 0xffff00, 0xff00ff];
    
    // Animation settings
    this.swapSpeed = 200;
    this.fallSpeed = 300;
    this.matchSpeed = 150;
  }

  init(data) {
    // Initialize with level configuration
    this.levelConfig = data.levelConfig || getLevelById(1);
    this.score = 0;
    this.moves = 0;
    this.timeLeft = this.levelConfig.timeLimit || 0;
    this.objectives = [...this.levelConfig.objectives];
    
    // Initialize grid
    this.initializeGrid();
  }

  create() {
    // Create background
    this.createBackground();
    
    // Create grid
    this.createGrid();
    
    // Create gems
    this.createGems();
    
    // Create obstacles
    this.createObstacles();
    
    // Create UI
    this.createUI();
    
    // Set up input
    this.setupInput();
    
    // Start timers
    this.startTimers();
    
    // Initial match check
    this.checkForMatches();
  }

  createBackground() {
    // Create gradient background
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x1a1a2e, 0x16213e, 0x0f3460, 0x533483);
    graphics.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
    
    // Add subtle pattern
    for (let i = 0; i < 20; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, this.cameras.main.width),
        Phaser.Math.Between(0, this.cameras.main.height),
        Phaser.Math.Between(1, 3),
        0xffffff,
        0.3
      );
      this.tweens.add({
        targets: star,
        alpha: 0.1,
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true,
        repeat: -1
      });
    }
  }

  createGrid() {
    const { width, height } = this.levelConfig.gridSize;
    this.grid = [];
    
    // Calculate grid position (centered)
    this.gridOffsetX = (this.cameras.main.width - width * this.cellSize) / 2;
    this.gridOffsetY = (this.cameras.main.height - height * this.cellSize) / 2;
    
    // Initialize grid array
    for (let y = 0; y < height; y++) {
      this.grid[y] = [];
      for (let x = 0; x < width; x++) {
        this.grid[y][x] = {
          gem: null,
          obstacle: null,
          powerUp: null,
          x: x,
          y: y,
          worldX: this.gridOffsetX + x * this.cellSize,
          worldY: this.gridOffsetY + y * this.cellSize
        };
      }
    }
    
    // Create grid visual
    this.createGridVisual();
  }

  createGridVisual() {
    const { width, height } = this.levelConfig.gridSize;
    
    // Create grid lines
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0xffffff, 0.2);
    
    // Vertical lines
    for (let x = 0; x <= width; x++) {
      graphics.moveTo(this.gridOffsetX + x * this.cellSize, this.gridOffsetY);
      graphics.lineTo(this.gridOffsetX + x * this.cellSize, this.gridOffsetY + height * this.cellSize);
    }
    
    // Horizontal lines
    for (let y = 0; y <= height; y++) {
      graphics.moveTo(this.gridOffsetX, this.gridOffsetY + y * this.cellSize);
      graphics.lineTo(this.gridOffsetX + width * this.cellSize, this.gridOffsetY + y * this.cellSize);
    }
    
    graphics.strokePath();
  }

  createGems() {
    const { width, height } = this.levelConfig.gridSize;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (!this.grid[y][x].obstacle) {
          this.createGem(x, y);
        }
      }
    }
  }

  createGem(x, y) {
    const gemType = this.getRandomGemType();
    const gemColor = this.gemColors[this.gemTypes.indexOf(gemType)];
    
    // Create gem sprite
    const gem = this.add.circle(
      this.grid[y][x].worldX + this.cellSize / 2,
      this.grid[y][x].worldY + this.cellSize / 2,
      this.cellSize / 2 - 4,
      gemColor
    );
    
    // Add gem properties
    gem.setData('type', gemType);
    gem.setData('gridX', x);
    gem.setData('gridY', y);
    gem.setData('isSelected', false);
    gem.setData('isAnimating', false);
    
    // Add selection indicator
    const selectionRing = this.add.circle(
      gem.x, gem.y,
      this.cellSize / 2 - 2,
      0xffffff,
      0
    );
    selectionRing.setStrokeStyle(3, 0xffffff, 0.8);
    gem.setData('selectionRing', selectionRing);
    
    // Make gem interactive
    gem.setInteractive();
    gem.on('pointerdown', () => this.onGemClick(gem));
    gem.on('pointerover', () => this.onGemHover(gem));
    gem.on('pointerout', () => this.onGemUnhover(gem));
    
    // Store gem reference
    this.grid[y][x].gem = gem;
    this.gems.push(gem);
    
    return gem;
  }

  createObstacles() {
    const { obstacles } = this.levelConfig;
    
    obstacles.forEach(obstacleType => {
      switch (obstacleType) {
        case 'locked_tiles':
          this.createLockedTiles();
          break;
        case 'ice_tiles':
          this.createIceTiles();
          break;
        case 'stone_blockers':
          this.createStoneBlockers();
          break;
        case 'two_step_blockers':
          this.createTwoStepBlockers();
          break;
        case 'multi_layer_blockers':
          this.createMultiLayerBlockers();
          break;
        case 'fog_tiles':
          this.createFogTiles();
          break;
        case 'portals':
          this.createPortals();
          break;
        case 'row_blockers':
          this.createRowBlockers();
          break;
      }
    });
  }

  createLockedTiles() {
    const { width, height } = this.levelConfig.gridSize;
    const count = Math.min(8, Math.floor(width * height * 0.1));
    
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(0, width - 1);
      const y = Phaser.Math.Between(0, height - 1);
      
      if (!this.grid[y][x].obstacle) {
        const lock = this.add.rectangle(
          this.grid[y][x].worldX + this.cellSize / 2,
          this.grid[y][x].worldY + this.cellSize / 2,
          this.cellSize - 8,
          this.cellSize - 8,
          0x8B4513
        );
        lock.setStrokeStyle(2, 0x654321);
        
        // Add lock icon
        const lockIcon = this.add.text(
          lock.x, lock.y, '🔒',
          { fontSize: '24px', align: 'center' }
        ).setOrigin(0.5);
        
        this.grid[y][x].obstacle = {
          type: 'locked_tile',
          sprite: lock,
          icon: lockIcon,
          hits: 1
        };
      }
    }
  }

  createIceTiles() {
    const { width, height } = this.levelConfig.gridSize;
    const count = Math.min(12, Math.floor(width * height * 0.15));
    
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(0, width - 1);
      const y = Phaser.Math.Between(0, height - 1);
      
      if (!this.grid[y][x].obstacle) {
        const ice = this.add.rectangle(
          this.grid[y][x].worldX + this.cellSize / 2,
          this.grid[y][x].worldY + this.cellSize / 2,
          this.cellSize - 8,
          this.cellSize - 8,
          0x87CEEB
        );
        ice.setStrokeStyle(2, 0x4682B4);
        ice.setAlpha(0.7);
        
        this.grid[y][x].obstacle = {
          type: 'ice_tile',
          sprite: ice,
          hits: 2
        };
      }
    }
  }

  createStoneBlockers() {
    const { width, height } = this.levelConfig.gridSize;
    const count = Math.min(10, Math.floor(width * height * 0.12));
    
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(0, width - 1);
      const y = Phaser.Math.Between(0, height - 1);
      
      if (!this.grid[y][x].obstacle) {
        const stone = this.add.rectangle(
          this.grid[y][x].worldX + this.cellSize / 2,
          this.grid[y][x].worldY + this.cellSize / 2,
          this.cellSize - 8,
          this.cellSize - 8,
          0x696969
        );
        stone.setStrokeStyle(2, 0x2F4F4F);
        
        this.grid[y][x].obstacle = {
          type: 'stone_blocker',
          sprite: stone,
          hits: 1
        };
      }
    }
  }

  createTwoStepBlockers() {
    const { width, height } = this.levelConfig.gridSize;
    const count = Math.min(8, Math.floor(width * height * 0.1));
    
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(0, width - 1);
      const y = Phaser.Math.Between(0, height - 1);
      
      if (!this.grid[y][x].obstacle) {
        const blocker = this.add.rectangle(
          this.grid[y][x].worldX + this.cellSize / 2,
          this.grid[y][x].worldY + this.cellSize / 2,
          this.cellSize - 8,
          this.cellSize - 8,
          0x8B4513
        );
        blocker.setStrokeStyle(2, 0x654321);
        
        // Add "2" indicator
        const twoIcon = this.add.text(
          blocker.x, blocker.y, '2',
          { fontSize: '20px', color: '#ffffff', align: 'center' }
        ).setOrigin(0.5);
        
        this.grid[y][x].obstacle = {
          type: 'two_step_blocker',
          sprite: blocker,
          icon: twoIcon,
          hits: 2
        };
      }
    }
  }

  createMultiLayerBlockers() {
    const { width, height } = this.levelConfig.gridSize;
    const count = Math.min(15, Math.floor(width * height * 0.15));
    
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(0, width - 1);
      const y = Phaser.Math.Between(0, height - 1);
      
      if (!this.grid[y][x].obstacle) {
        const blocker = this.add.rectangle(
          this.grid[y][x].worldX + this.cellSize / 2,
          this.grid[y][x].worldY + this.cellSize / 2,
          this.cellSize - 8,
          this.cellSize - 8,
          0x2F4F4F
        );
        blocker.setStrokeStyle(3, 0x000000);
        
        this.grid[y][x].obstacle = {
          type: 'multi_layer_blocker',
          sprite: blocker,
          hits: 3
        };
      }
    }
  }

  createFogTiles() {
    const { width, height } = this.levelConfig.gridSize;
    const count = Math.min(20, Math.floor(width * height * 0.2));
    
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(0, width - 1);
      const y = Phaser.Math.Between(0, height - 1);
      
      if (!this.grid[y][x].obstacle) {
        const fog = this.add.rectangle(
          this.grid[y][x].worldX + this.cellSize / 2,
          this.grid[y][x].worldY + this.cellSize / 2,
          this.cellSize - 8,
          this.cellSize - 8,
          0x708090
        );
        fog.setAlpha(0.8);
        
        this.grid[y][x].obstacle = {
          type: 'fog_tile',
          sprite: fog,
          hits: 1
        };
      }
    }
  }

  createPortals() {
    const { width, height } = this.levelConfig.gridSize;
    const count = Math.min(4, Math.floor(width * height * 0.05));
    
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(0, width - 1);
      const y = Phaser.Math.Between(0, height - 1);
      
      if (!this.grid[y][x].obstacle) {
        const portal = this.add.circle(
          this.grid[y][x].worldX + this.cellSize / 2,
          this.grid[y][x].worldY + this.cellSize / 2,
          this.cellSize / 2 - 4,
          0x8A2BE2
        );
        portal.setStrokeStyle(3, 0x4B0082);
        
        // Add portal effect
        this.tweens.add({
          targets: portal,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 1000,
          yoyo: true,
          repeat: -1
        });
        
        this.grid[y][x].obstacle = {
          type: 'portal',
          sprite: portal,
          hits: 0
        };
      }
    }
  }

  createRowBlockers() {
    const { width, height } = this.levelConfig.gridSize;
    const count = Math.min(5, Math.floor(height * 0.3));
    
    for (let i = 0; i < count; i++) {
      const y = Phaser.Math.Between(0, height - 1);
      
      for (let x = 0; x < width; x++) {
        if (!this.grid[y][x].obstacle) {
          const blocker = this.add.rectangle(
            this.grid[y][x].worldX + this.cellSize / 2,
            this.grid[y][x].worldY + this.cellSize / 2,
            this.cellSize - 8,
            this.cellSize - 8,
            0x696969
          );
          blocker.setStrokeStyle(2, 0x2F4F4F);
          
          this.grid[y][x].obstacle = {
            type: 'row_blocker',
            sprite: blocker,
            hits: 1
          };
        }
      }
    }
  }

  createUI() {
    // Score display
    this.scoreText = this.add.text(20, 20, `Score: ${this.score}`, {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial'
    });
    
    // Moves display
    if (this.levelConfig.moveLimit) {
      this.movesText = this.add.text(20, 50, `Moves: ${this.moves}/${this.levelConfig.moveLimit}`, {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'Arial'
      });
    }
    
    // Time display
    if (this.levelConfig.timeLimit) {
      this.timeText = this.add.text(20, 80, `Time: ${this.timeLeft}`, {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'Arial'
      });
    }
    
    // Objectives display
    this.createObjectivesUI();
    
    // Power-ups display
    this.createPowerUpsUI();
  }

  createObjectivesUI() {
    const startY = this.cameras.main.height - 200;
    
    this.objectivesText = this.add.text(20, startY, 'Objectives:', {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'Arial'
    });
    
    this.objectiveItems = [];
    this.objectives.forEach((objective, index) => {
      const text = this.add.text(20, startY + 30 + index * 25, 
        `${objective.description}: 0/${objective.target}`, {
        fontSize: '16px',
        color: '#ffffff',
        fontFamily: 'Arial'
      });
      this.objectiveItems.push(text);
    });
  }

  createPowerUpsUI() {
    const startX = this.cameras.main.width - 200;
    
    this.powerUpsText = this.add.text(startX, 20, 'Power-ups:', {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'Arial'
    });
    
    // Create power-up buttons
    this.powerUpButtons = [];
    const powerUpTypes = ['line_clear', 'bomb', 'color_bomb'];
    
    powerUpTypes.forEach((type, index) => {
      const button = this.add.rectangle(
        startX + 50,
        60 + index * 40,
        80, 30,
        0x4a4a4a
      );
      button.setStrokeStyle(2, 0xffffff);
      button.setInteractive();
      
      const text = this.add.text(button.x, button.y, type.replace('_', ' '), {
        fontSize: '12px',
        color: '#ffffff',
        fontFamily: 'Arial'
      }).setOrigin(0.5);
      
      button.on('pointerdown', () => this.usePowerUp(type));
      
      this.powerUpButtons.push({ button, text, type });
    });
  }

  setupInput() {
    // Keyboard input
    this.input.keyboard.on('keydown', (event) => {
      switch (event.code) {
        case 'Space':
          this.checkForMatches();
          break;
        case 'KeyR':
          this.restartLevel();
          break;
      }
    });
  }

  startTimers() {
    // Game timer
    if (this.levelConfig.timeLimit) {
      this.timeEvent = this.time.addEvent({
        delay: 1000,
        callback: this.updateTimer,
        callbackScope: this,
        loop: true
      });
    }
  }

  updateTimer() {
    this.timeLeft--;
    this.timeText.setText(`Time: ${this.timeLeft}`);
    
    if (this.timeLeft <= 0) {
      this.endGame(false, 'Time\'s up!');
    }
  }

  getRandomGemType() {
    const availableTypes = this.gemTypes.slice(0, this.levelConfig.gemColors);
    return Phaser.Utils.Array.GetRandom(availableTypes);
  }

  onGemClick(gem) {
    if (this.isAnimating) return;
    
    const x = gem.getData('gridX');
    const y = gem.getData('gridY');
    
    if (this.selectedGem) {
      if (this.selectedGem === gem) {
        // Deselect
        this.deselectGem();
      } else {
        // Try to swap
        this.trySwap(this.selectedGem, gem);
      }
    } else {
      // Select gem
      this.selectGem(gem);
    }
  }

  onGemHover(gem) {
    if (!gem.getData('isSelected')) {
      gem.setAlpha(0.8);
    }
  }

  onGemUnhover(gem) {
    if (!gem.getData('isSelected')) {
      gem.setAlpha(1);
    }
  }

  selectGem(gem) {
    this.deselectGem();
    this.selectedGem = gem;
    gem.setData('isSelected', true);
    gem.getData('selectionRing').setAlpha(1);
  }

  deselectGem() {
    if (this.selectedGem) {
      this.selectedGem.setData('isSelected', false);
      this.selectedGem.getData('selectionRing').setAlpha(0);
      this.selectedGem = null;
    }
  }

  trySwap(gem1, gem2) {
    const x1 = gem1.getData('gridX');
    const y1 = gem1.getData('gridY');
    const x2 = gem2.getData('gridX');
    const y2 = gem2.getData('gridY');
    
    // Check if gems are adjacent
    const dx = Math.abs(x1 - x2);
    const dy = Math.abs(y1 - y2);
    
    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      this.swapGems(gem1, gem2);
    } else {
      this.deselectGem();
    }
  }

  swapGems(gem1, gem2) {
    this.isAnimating = true;
    this.moves++;
    
    if (this.levelConfig.moveLimit) {
      this.movesText.setText(`Moves: ${this.moves}/${this.levelConfig.moveLimit}`);
    }
    
    const x1 = gem1.getData('gridX');
    const y1 = gem1.getData('gridY');
    const x2 = gem2.getData('gridX');
    const y2 = gem2.getData('gridY');
    
    // Animate swap
    this.tweens.add({
      targets: gem1,
      x: gem2.x,
      y: gem2.y,
      duration: this.swapSpeed,
      ease: 'Power2'
    });
    
    this.tweens.add({
      targets: gem2,
      x: gem1.x,
      y: gem1.y,
      duration: this.swapSpeed,
      ease: 'Power2',
      onComplete: () => {
        // Update grid positions
        this.grid[y1][x1].gem = gem2;
        this.grid[y2][x2].gem = gem1;
        
        gem1.setData('gridX', x2);
        gem1.setData('gridY', y2);
        gem2.setData('gridX', x1);
        gem2.setData('gridY', y1);
        
        // Check for matches
        const matches = this.findMatches();
        
        if (matches.length > 0) {
          this.processMatches(matches);
        } else {
          // Swap back
          this.swapGems(gem2, gem1);
        }
        
        this.deselectGem();
        this.isAnimating = false;
      }
    });
  }

  findMatches() {
    const matches = [];
    const { width, height } = this.levelConfig.gridSize;
    
    // Check horizontal matches
    for (let y = 0; y < height; y++) {
      let count = 1;
      let currentType = null;
      
      for (let x = 0; x < width; x++) {
        const gem = this.grid[y][x].gem;
        if (gem && gem.getData('type') === currentType) {
          count++;
        } else {
          if (count >= 3) {
            for (let i = x - count; i < x; i++) {
              matches.push({ x: i, y: y, gem: this.grid[y][i].gem });
            }
          }
          count = 1;
          currentType = gem ? gem.getData('type') : null;
        }
      }
      
      if (count >= 3) {
        for (let i = width - count; i < width; i++) {
          matches.push({ x: i, y: y, gem: this.grid[y][i].gem });
        }
      }
    }
    
    // Check vertical matches
    for (let x = 0; x < width; x++) {
      let count = 1;
      let currentType = null;
      
      for (let y = 0; y < height; y++) {
        const gem = this.grid[y][x].gem;
        if (gem && gem.getData('type') === currentType) {
          count++;
        } else {
          if (count >= 3) {
            for (let i = y - count; i < y; i++) {
              matches.push({ x: x, y: i, gem: this.grid[i][x].gem });
            }
          }
          count = 1;
          currentType = gem ? gem.getData('type') : null;
        }
      }
      
      if (count >= 3) {
        for (let i = height - count; i < height; i++) {
          matches.push({ x: x, y: i, gem: this.grid[i][x].gem });
        }
      }
    }
    
    return matches;
  }

  processMatches(matches) {
    // Remove duplicate matches
    const uniqueMatches = [];
    const processed = new Set();
    
    matches.forEach(match => {
      const key = `${match.x},${match.y}`;
      if (!processed.has(key)) {
        processed.add(key);
        uniqueMatches.push(match);
      }
    });
    
    // Calculate score
    const baseScore = uniqueMatches.length * 10;
    const bonusScore = this.calculateMatchBonus(uniqueMatches);
    this.score += baseScore + bonusScore;
    this.scoreText.setText(`Score: ${this.score}`);
    
    // Remove matched gems
    uniqueMatches.forEach(match => {
      if (match.gem) {
        this.removeGem(match.x, match.y);
      }
    });
    
    // Check for power-up creation
    this.checkForPowerUpCreation(uniqueMatches);
    
    // Drop gems
    this.dropGems();
    
    // Check for cascades
    this.time.delayedCall(500, () => {
      this.checkForMatches();
    });
  }

  calculateMatchBonus(matches) {
    let bonus = 0;
    
    // Length bonus
    const lengths = this.getMatchLengths(matches);
    lengths.forEach(length => {
      if (length >= 4) bonus += 50;
      if (length >= 5) bonus += 100;
      if (length >= 6) bonus += 200;
    });
    
    // Pattern bonus (L-shape, T-shape)
    if (this.isLShape(matches)) bonus += 100;
    if (this.isTShape(matches)) bonus += 100;
    
    return bonus;
  }

  getMatchLengths(matches) {
    // Group matches by type and calculate lengths
    const groups = {};
    matches.forEach(match => {
      const type = match.gem.getData('type');
      if (!groups[type]) groups[type] = [];
      groups[type].push(match);
    });
    
    return Object.values(groups).map(group => group.length);
  }

  isLShape(matches) {
    // Check for L-shaped pattern (5+ gems)
    if (matches.length < 5) return false;
    
    // Simple L-shape detection
    const positions = matches.map(m => ({ x: m.x, y: m.y }));
    const minX = Math.min(...positions.map(p => p.x));
    const maxX = Math.max(...positions.map(p => p.x));
    const minY = Math.min(...positions.map(p => p.y));
    const maxY = Math.max(...positions.map(p => p.y));
    
    return (maxX - minX >= 2 && maxY - minY >= 2);
  }

  isTShape(matches) {
    // Check for T-shaped pattern (5+ gems)
    if (matches.length < 5) return false;
    
    // Simple T-shape detection
    const positions = matches.map(m => ({ x: m.x, y: m.y }));
    const minX = Math.min(...positions.map(p => p.x));
    const maxX = Math.max(...positions.map(p => p.x));
    const minY = Math.min(...positions.map(p => p.y));
    const maxY = Math.max(...positions.map(p => p.y));
    
    return (maxX - minX >= 2 && maxY - minY >= 1);
  }

  checkForPowerUpCreation(matches) {
    const lengths = this.getMatchLengths(matches);
    
    lengths.forEach(length => {
      if (length >= 4) {
        // Create line clear power-up
        this.createPowerUp('line_clear');
      }
      if (length >= 5) {
        // Create color bomb
        this.createPowerUp('color_bomb');
      }
    });
  }

  createPowerUp(type) {
    // Add power-up to inventory
    this.powerUps.push(type);
    this.updatePowerUpsUI();
  }

  updatePowerUpsUI() {
    // Update power-up button states
    this.powerUpButtons.forEach(button => {
      const count = this.powerUps.filter(p => p === button.type).length;
      button.text.setText(`${button.type.replace('_', ' ')} (${count})`);
    });
  }

  usePowerUp(type) {
    if (this.isAnimating) return;
    
    const index = this.powerUps.indexOf(type);
    if (index === -1) return;
    
    this.powerUps.splice(index, 1);
    this.updatePowerUpsUI();
    
    switch (type) {
      case 'line_clear':
        this.useLineClear();
        break;
      case 'bomb':
        this.useBomb();
        break;
      case 'color_bomb':
        this.useColorBomb();
        break;
    }
  }

  useLineClear() {
    if (this.selectedGem) {
      const x = this.selectedGem.getData('gridX');
      const y = this.selectedGem.getData('gridY');
      
      // Clear entire row
      for (let i = 0; i < this.levelConfig.gridSize.width; i++) {
        this.removeGem(i, y);
      }
      
      this.dropGems();
    }
  }

  useBomb() {
    if (this.selectedGem) {
      const x = this.selectedGem.getData('gridX');
      const y = this.selectedGem.getData('gridY');
      
      // Clear 3x3 area
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const newX = x + dx;
          const newY = y + dy;
          if (newX >= 0 && newX < this.levelConfig.gridSize.width &&
              newY >= 0 && newY < this.levelConfig.gridSize.height) {
            this.removeGem(newX, newY);
          }
        }
      }
      
      this.dropGems();
    }
  }

  useColorBomb() {
    if (this.selectedGem) {
      const type = this.selectedGem.getData('type');
      
      // Remove all gems of the same type
      this.gems.forEach(gem => {
        if (gem.getData('type') === type) {
          const x = gem.getData('gridX');
          const y = gem.getData('gridY');
          this.removeGem(x, y);
        }
      });
      
      this.dropGems();
    }
  }

  removeGem(x, y) {
    const gem = this.grid[y][x].gem;
    if (gem) {
      // Animate removal
      this.tweens.add({
        targets: gem,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        duration: this.matchSpeed,
        onComplete: () => {
          gem.destroy();
        }
      });
      
      this.grid[y][x].gem = null;
    }
  }

  dropGems() {
    const { width, height } = this.levelConfig.gridSize;
    
    // Drop gems down
    for (let x = 0; x < width; x++) {
      let writeIndex = height - 1;
      
      for (let y = height - 1; y >= 0; y--) {
        if (this.grid[y][x].gem) {
          if (writeIndex !== y) {
            // Move gem down
            const gem = this.grid[y][x].gem;
            this.grid[writeIndex][x].gem = gem;
            this.grid[y][x].gem = null;
            
            gem.setData('gridY', writeIndex);
            
            // Animate drop
            this.tweens.add({
              targets: gem,
              y: this.grid[writeIndex][x].worldY + this.cellSize / 2,
              duration: this.fallSpeed,
              ease: 'Power2'
            });
          }
          writeIndex--;
        }
      }
      
      // Fill empty spaces with new gems
      for (let y = 0; y <= writeIndex; y++) {
        this.createGem(x, y);
      }
    }
  }

  checkForMatches() {
    const matches = this.findMatches();
    if (matches.length > 0) {
      this.processMatches(matches);
    } else {
      this.checkObjectives();
    }
  }

  checkObjectives() {
    let allCompleted = true;
    
    this.objectives.forEach((objective, index) => {
      let current = 0;
      
      switch (objective.type) {
        case 'score':
          current = this.score;
          break;
        case 'collect':
          current = this.getCollectedGems(objective.gemType);
          break;
        case 'clear':
          current = this.getClearedObstacles();
          break;
        case 'combo':
          current = this.getComboCount();
          break;
        case 'special':
          current = this.getSpecialItems();
          break;
      }
      
      if (current >= objective.target) {
        this.objectiveItems[index].setColor('#00ff00');
      } else {
        allCompleted = false;
        this.objectiveItems[index].setColor('#ffffff');
      }
      
      this.objectiveItems[index].setText(
        `${objective.description}: ${current}/${objective.target}`
      );
    });
    
    if (allCompleted) {
      this.endGame(true, 'Level Complete!');
    } else if (this.levelConfig.moveLimit && this.moves >= this.levelConfig.moveLimit) {
      this.endGame(false, 'Out of moves!');
    }
  }

  getCollectedGems(gemType) {
    // Count collected gems of specific type
    return this.gems.filter(gem => gem.getData('type') === gemType).length;
  }

  getClearedObstacles() {
    // Count cleared obstacles
    let count = 0;
    const { width, height } = this.levelConfig.gridSize;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (this.grid[y][x].obstacle && this.grid[y][x].obstacle.hits <= 0) {
          count++;
        }
      }
    }
    
    return count;
  }

  getComboCount() {
    // Return combo count (simplified)
    return Math.floor(this.score / 1000);
  }

  getSpecialItems() {
    // Count special items (simplified)
    return this.powerUps.length;
  }

  endGame(success, message) {
    this.isAnimating = true;
    
    // Stop timers
    if (this.timeEvent) {
      this.timeEvent.destroy();
    }
    
    // Show result
    const resultText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      message,
      {
        fontSize: '32px',
        color: success ? '#00ff00' : '#ff0000',
        fontFamily: 'Arial'
      }
    ).setOrigin(0.5);
    
    // Calculate performance
    const performance = this.calculatePerformance();
    
    // Emit game end event
    this.events.emit('gameEnd', {
      success,
      score: this.score,
      performance,
      levelConfig: this.levelConfig
    });
  }

  calculatePerformance() {
    let stars = 1;
    
    // Calculate stars based on objectives completion
    const completedObjectives = this.objectives.filter((objective, index) => {
      let current = 0;
      switch (objective.type) {
        case 'score':
          current = this.score;
          break;
        case 'collect':
          current = this.getCollectedGems(objective.gemType);
          break;
        case 'clear':
          current = this.getClearedObstacles();
          break;
        case 'combo':
          current = this.getComboCount();
          break;
        case 'special':
          current = this.getSpecialItems();
          break;
      }
      return current >= objective.target;
    }).length;
    
    const completionRate = completedObjectives / this.objectives.length;
    
    if (completionRate >= 1.0) stars = 3;
    else if (completionRate >= 0.75) stars = 2;
    
    return {
      stars,
      completionRate,
      score: this.score,
      moves: this.moves,
      timeLeft: this.timeLeft
    };
  }

  restartLevel() {
    this.scene.restart();
  }
}

export default GameScene;
