import { GameObject } from '../core/GameObject';
import { Health } from '../components/Health';
import * as Phaser from 'phaser';

export class Bullet extends GameObject {
  public damage: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    this.scene.physics.world.enable(this);
    this.setActive(false);
    this.setVisible(false);
  }

  public fire(x: number, y: number, targetX: number, targetY: number, speed: number, damage: number): void {
    this.damage = damage;
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);

    const direction = new Phaser.Math.Vector2(targetX - x, targetY - y).normalize();
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(direction.x * speed, direction.y * speed);
  }

  public applyDamage(target: GameObject): void {
    const healthComponent = target.getComponent(Health);
    if (healthComponent) {
      healthComponent.takeDamage(this.damage);
    }
    this.destroyBullet();
  }

  public destroyBullet(): void {
    this.destroy(); 
  }
}
