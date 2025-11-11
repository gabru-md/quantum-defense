import {GameObject} from '../core/GameObject';
import {Health} from '../components/Health';
import {Enemy} from './Enemy';
import {SpecialEnemy} from './SpecialEnemy'; // Import SpecialEnemy
import * as Phaser from 'phaser';

/**
 * Represents a bomb projectile that deals Area of Effect (AoE) damage.
 */
export class Bomb extends GameObject {
    public damage: number = 0;
    public explosionRadius: number = 0;
    private targetableGroups!: Phaser.GameObjects.Group[];

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);
        this.scene.physics.world.enable(this);
        this.setActive(false);
        this.setVisible(false);
    }

    public fire(x: number, y: number, targetX: number, targetY: number, speed: number, damage: number, explosionRadius: number, targetableGroups: Phaser.GameObjects.Group[]): void {
        this.damage = damage;
        this.explosionRadius = explosionRadius;
        this.targetableGroups = targetableGroups;
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);

        const direction = new Phaser.Math.Vector2(targetX - x, targetY - y).normalize();
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(direction.x * speed, direction.y * speed);
    }

    public explode(): void {
        const graphics = this.scene.add.graphics({fillStyle: {color: 0x9b59b6, alpha: 0.2}});
        graphics.fillCircle(this.x, this.y, this.explosionRadius);
        this.scene.time.delayedCall(100, () => graphics.destroy());

        for (var i = 0; i < this.targetableGroups.length; i++) {
            const targetableGroup = this.targetableGroups[i];
            targetableGroup.children.each((targetableObject: Phaser.GameObjects.GameObject) => {
                if (targetableObject instanceof Enemy || targetableObject instanceof SpecialEnemy) { // Check for both Enemy and SpecialEnemy
                    const target = targetableObject as (Enemy | SpecialEnemy);
                    const distance = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);
                    if (distance <= this.explosionRadius) {
                        const healthComponent = target.getComponent(Health);
                        if (healthComponent) {
                            healthComponent.takeDamage(this.damage);
                        }
                    }
                }
                return null;
            });
        }

        this.destroy();
    }

    public destroy() {
        super.destroy();
    }

    public update(_time: number, _delta: number): void {
        super.update(_time, _delta);
        if (this.outOfBounds()) {
            this.destroy();
        }
    }

    private outOfBounds(): boolean {
        if (!this.scene) {
            return true;
        }

        const gameWidth = this.scene.game.config.width as number;
        const gameHeight = this.scene.game.config.height as number;

        if (this.x < 0 ||
            this.x > gameWidth ||
            this.y < 0 ||
            this.y > gameHeight) {
            return true;
        }

        return false;
    }
}
