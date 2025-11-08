import { GameObject } from '../core/GameObject';
import * as Phaser from 'phaser';

export interface TowerConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string;
}

export class Tower extends GameObject {
  constructor(config: TowerConfig) {
    super(config.scene, config.x, config.y, config.texture);
  }
}
