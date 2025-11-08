import { GameObject } from '../core/GameObject';
import { Health } from '../components/Health';
import { PathFollower } from '../components/PathFollower';
import * as Phaser from 'phaser';

export interface EnemyConfig {
  scene: Phaser.Scene;
  path: Phaser.Curves.Path;
  texture: string;
  health: number;
  speed: number;
  moneyValue: number;
}

export class Enemy extends GameObject {
  public moneyValue: number;

  constructor(config: EnemyConfig) {
    const startPoint = config.path.getStartPoint();
    super(config.scene, startPoint.x, startPoint.y, config.texture);

    config.scene.physics.world.enable(this);

    this.moneyValue = config.moneyValue;

    this.addComponent(new Health(config.health));
    this.addComponent(new PathFollower(config.path, config.speed));

    this.on('died', () => {
      this.scene.events.emit('enemyDied', this.moneyValue);
      this.destroy();
    });
  }
}
