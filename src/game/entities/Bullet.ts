import {GameObject} from '../core/GameObject';
import {Health} from '../components/Health';
import * as Phaser from 'phaser';
import {GAME_HEIGHT, GAME_WIDTH} from '../scripts/Util.ts';
import {Enemy} from './Enemy';

export class Bullet extends GameObject {
    public damage: number = 0;
    public source?: GameObject;
    private ricochetTargets: number = 0;
    private ricochetDamage: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, source?: GameObject) {
        super(scene, x, y, texture);
        this.source = source;
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
        speed = speed * this.scene.time.timeScale;
        body.setVelocity(direction.x * speed, direction.y * speed);
    }

    public applyDamage(target: GameObject): void {
        const healthComponent = target.getComponent(Health);
        this.level.audioManager.playSfx('laser_hit');
        if (healthComponent) {
            healthComponent.takeDamage(this.damage);
        }

        if (this.ricochetTargets > 0) {
            this.ricochetTargets--;
            this.damage *= this.ricochetDamage;
            const newTarget = this.findNextTarget(target);
            if (newTarget) {
                this.fire(this.x, this.y, newTarget.x, newTarget.y, (this.body as Phaser.Physics.Arcade.Body).velocity.x, this.damage);
            } else {
                this.destroyBullet();
            }
        } else {
            this.destroyBullet();
        }
    }

    private findNextTarget(exclude: GameObject): GameObject | null {
        let closestEnemy: GameObject | null = null;
        let minDistance = Infinity;

        this.level.waveManager.enemies.getChildren().forEach((enemyObject: Phaser.GameObjects.GameObject) => {
            const enemy = enemyObject as Enemy;
            if (enemy !== exclude && enemy.active) {
                const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestEnemy = enemy;
                }
            }
        });

        return closestEnemy;
    }

    public destroyBullet(): void {
        this.destroy();
    }

    update(_time: number, _delta: number) {
        if (this.outOfBounds()) {
            this.destroyBullet();
        }
    }

    private outOfBounds(): boolean {
        if (!this.scene) {
            return true;
        }
        return this.x < 0 || this.x > GAME_WIDTH || this.y < 0 || this.y > GAME_HEIGHT;
    }
}
