// Main Phaser Game Configuration
// Integrates with React Native/Expo Web

import Phaser from 'phaser';
import { GameScene } from './PhaserGameScene';

export class PhaserGame {
  constructor(containerId, levelConfig) {
    this.containerId = containerId;
    this.levelConfig = levelConfig;
    this.game = null;
    this.gameScene = null;
    this.onGameEnd = null;
  }

  init() {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: this.containerId,
      backgroundColor: '#1a1a2e',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: {
        preload: this.preload,
        create: this.create,
        update: this.update
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
          width: 400,
          height: 300
        },
        max: {
          width: 1200,
          height: 900
        }
      }
    };

    this.game = new Phaser.Game(config);
    this.gameScene = new GameScene();
    
    // Add the scene to the game
    this.game.scene.add('GameScene', this.gameScene, true, {
      levelConfig: this.levelConfig
    });

    // Set up event listeners
    this.setupEventListeners();
  }

  preload() {
    // Preload game assets
    this.load.image('gem-ruby', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    this.load.image('gem-sapphire', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    this.load.image('gem-emerald', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    this.load.image('gem-diamond', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    this.load.image('gem-topaz', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  }

  create() {
    // Game creation logic is handled in GameScene
  }

  update() {
    // Game update logic is handled in GameScene
  }

  setupEventListeners() {
    if (this.gameScene) {
      this.gameScene.events.on('gameEnd', (data) => {
        if (this.onGameEnd) {
          this.onGameEnd(data);
        }
      });
    }
  }

  setGameEndCallback(callback) {
    this.onGameEnd = callback;
  }

  destroy() {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
    }
  }

  pause() {
    if (this.game) {
      this.game.scene.pause('GameScene');
    }
  }

  resume() {
    if (this.game) {
      this.game.scene.resume('GameScene');
    }
  }

  restart(levelConfig) {
    if (levelConfig) {
      this.levelConfig = levelConfig;
    }
    
    if (this.game) {
      this.game.scene.restart('GameScene', { levelConfig: this.levelConfig });
    }
  }
}

export default PhaserGame;
