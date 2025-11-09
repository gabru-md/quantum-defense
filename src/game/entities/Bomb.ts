import {GameObject} from '../core/GameObject';
import {Health} from '../components/Health';
import {Enemy} from './Enemy'; // Import Enemy to check instance type
import * as Phaser from 'phaser';
import {Healer} from "./Healer.ts";

/**
 * Represents a bomb projectile that deals Area of Effect (AoE) damage.
 */
export class Bomb extends GameObject {
    public damage: number = 0;
    public explosionRadius: number = 0;
    private targetableGroups!: Phaser.GameObjects.Group[]; // Reference to the enemies group

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);
        this.scene.physics.world.enable(this);
        this.setActive(false); // Start inactive
        this.setVisible(false); // Start invisible
    }

    /**
     * Fires the bomb from a starting point towards a target point.
     * @param x The starting x position.
     * @param y The starting y position.
     * @param targetX The target x position.
     * @param targetY The target y position.
     * @param speed The speed of the bomb.
     * @param damage The damage this bomb will deal.
     * @param explosionRadius The radius of the AoE explosion.
     * @param targetableGroups
     */
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

    /**
     * Triggers the explosion effect and deals AoE damage.
     */
    public explode(): void {
        // Visual effect for explosion (e.g., a temporary circle)
        const graphics = this.scene.add.graphics({fillStyle: {color: 0xff8800, alpha: 0.5}});
        graphics.fillCircle(this.x, this.y, this.explosionRadius);
        this.scene.time.delayedCall(100, () => graphics.destroy()); // Remove explosion graphic after a short delay

        // Deal damage to all enemies within the explosion radius
        for (var i = 0; i < this.targetableGroups.length; i++) {
            const targetableGroup = this.targetableGroups[i];
            targetableGroup.children.each((targetableObject: Phaser.GameObjects.GameObject) => {
                if (targetableObject instanceof Enemy) { // Ensure it's our custom Enemy type
                    const enemy = targetableObject as Enemy;
                    const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
                    if (distance <= this.explosionRadius) {
                        const healthComponent = enemy.getComponent(Health);
                        if (healthComponent) {
                            healthComponent.takeDamage(this.damage);
                        }
                    }
                }
                if (targetableObject instanceof Healer) {
                    // Ensure it's our custom Enemy type
                    const healer = targetableObject as Healer;
                    console.log(healer);
                    const distance = Phaser.Math.Distance.Between(this.x, this.y, healer.x, healer.y);
                    if (distance <= this.explosionRadius) {
                        const healthComponent = healer.getComponent(Health);
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
}
