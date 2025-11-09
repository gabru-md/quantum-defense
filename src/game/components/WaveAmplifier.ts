import {Component} from '../core/Component';
import {Health} from './Health';
import * as Phaser from 'phaser';
import {Healer} from "../entities/Healer.ts";

/**
 * A component that allows the player to activate a wave of damage around them.
 */
export class WaveAmplifier extends Component {
    private keys!: { e: Phaser.Input.Keyboard.Key };
    private cooldownTime: number = 3000; // 3 seconds cooldown
    private lastActivated: number = 0;
    private waveRadius: number = 75; // Radius of the damage wave
    private waveDamage: number = 50; // Damage dealt by the wave
    private enemiesGroup!: Phaser.GameObjects.Group; // Reference to the enemies group

    constructor(enemiesGroup: Phaser.GameObjects.Group) {
        super();
        this.enemiesGroup = enemiesGroup;
    }

    public start(): void {
        if (this.gameObject.scene.input.keyboard) {
            this.keys = this.gameObject.scene.input.keyboard.addKeys({
                e: Phaser.Input.Keyboard.KeyCodes.E,
            }) as { e: Phaser.Input.Keyboard.Key };
        }
    }

    public update(_deltaTime: number): void {
        const time = this.gameObject.scene.time.now;

        if (this.keys.e.isDown && time > this.lastActivated + this.cooldownTime) {
            this.activateWave();
            this.lastActivated = time;
        }
    }

    private activateWave(): void {
        // --- RIPPLE EFFECT CONFIGURATION ---
        const totalPulses = 4; // How many circles in the ripple
        const pulseDelay = 150; // Delay between each pulse (in ms)
        const pulseDuration = 1000; // Duration of each individual circle animation

        // --- VISUAL EFFECT: CREATING THE RIPPLE ---
        for (let i = 0; i < totalPulses; i++) {
            // Use a delayed call to stagger the start of each pulse
            this.gameObject.scene.time.delayedCall(i * pulseDelay, () => {
                const graphics = this.gameObject.scene.add.graphics({
                    fillStyle: {color: 0xffa500, alpha: 0.3},
                    lineStyle: {width: 1, color: 0xffa500, alpha: 0.8}
                });

                graphics.setDepth(10); // Above player, below UI
                graphics.x = this.gameObject.x;
                graphics.y = this.gameObject.y;

                this.gameObject.scene.tweens.add({
                    targets: graphics,
                    scale: 2.5, // Scale to reach desired radius
                    alpha: 0,
                    duration: pulseDuration,
                    ease: 'Sine.easeOut',
                    onUpdate: (_tween, target) => {
                        // Draw expanding circle
                        graphics.clear();
                        graphics.lineStyle(1, 0xffa500, target.alpha * 0.8);
                        graphics.fillStyle(0xffa500, target.alpha * 0.3);
                        const radius = (this.gameObject.width / 2) * target.scale;
                        graphics.fillCircle(0, 0, radius);
                        graphics.strokeCircle(0, 0, radius);
                    },
                    onComplete: () => {
                        graphics.destroy();
                    }
                });
            });
        }

        // Deal damage to enemies (This only runs once when E is pressed, which is correct for damage application)
        this.enemiesGroup.children.each((enemyObject: Phaser.GameObjects.GameObject) => {
            if (enemyObject instanceof Healer) {
                const enemy = enemyObject as Healer;
                const distance = Phaser.Math.Distance.Between(this.gameObject.x, this.gameObject.y, enemy.x, enemy.y);
                if (distance <= this.waveRadius) {
                    const healthComponent = enemy.getComponent(Health);
                    if (healthComponent) {
                        healthComponent.takeDamage(this.waveDamage);
                    }
                }
            }
            return null;
        });
    }
}