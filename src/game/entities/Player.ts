import { GameObject } from '../core/GameObject';
import { PlayerController } from '../scripts/PlayerController';
import * as Phaser from 'phaser';

export interface PlayerConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string;
}

export class Player extends GameObject {
  constructor(config: PlayerConfig) {
    super(config.scene, config.x, config.y, config.texture);

    // Enable physics for the player
    config.scene.physics.world.enable(this);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true); // Keep player within game bounds
    body.setDrag(500); // Add some drag for smoother movement

    // Add the PlayerController component
    this.addComponent(new PlayerController());
  }
}
