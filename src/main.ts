import * as Phaser from 'phaser';
import { TowerDefenseScene } from './game/scenes/TowerDefenseScene';

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1027, // New width
  height: 768, // New height
  scene: [TowerDefenseScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false // Set to true to see physics bodies
    }
  },
  backgroundColor: '#2d2d2d'
};

// Start the game
new Phaser.Game(gameConfig);
