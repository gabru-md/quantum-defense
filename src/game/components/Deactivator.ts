import { Component } from '../core/Component';
import { Tower } from '../entities/Tower';
import { Level } from '../scenes/lib/Level';
import * as Phaser from 'phaser';
import {AppColors, phaserColor} from "../scripts/Colors.ts";

/**
 * A component that allows a GameObject to deactivate nearby towers.
 */
export class Deactivator extends Component {
    private deactivationRadius: number = 75; // Radius to deactivate towers
    private deactivationInterval: number = 2000; // Deactivate every 2 seconds
    private lastDeactivation: number = 0;

    public update(time: number, _deltaTime: number): void {
        if (this.isReady(time)) {
            this.deactivateNearbyTowers();
            this.lastDeactivation = time;
            this.createDeactivationPulse(); // Create the visual pulse when deactivating
        }
    }

    public isReady(time: number = this.gameObject.scene.time.now): boolean {
        return time > this.lastDeactivation + this.deactivationInterval;
    }

    private deactivateNearbyTowers(): void {
        const towers = (this.gameObject.scene as Level).towerManager.towers;
        if (!towers) {
            return;
        }

        for (const tower of towers.getChildren() as Tower[]) {
            if (tower.active) {
                const distance = Phaser.Math.Distance.Between(this.gameObject.x, this.gameObject.y, tower.x, tower.y);

                if (distance <= this.deactivationRadius) {
                    // Emit an event from the tower to be deactivated
                    tower.deactivateTower();
                    this.gameObject.scene.events.emit('towerDeactivated');
                }
            }
        }
    }

    private createDeactivationPulse(): void {
        const totalPulses = 2; // Fewer pulses than ResonanceWave for distinction
        const pulseDelay = 100;
        const pulseDuration = 800; // Slightly shorter duration
        const pulseColor = phaserColor(AppColors.SPECIAL_ENEMY_WAVE_PULSE);
        const pulseScale = this.deactivationRadius / (this.gameObject.width / 2); // Scale to cover deactivation radius

        for (let i = 0; i < totalPulses; i++) {
            this.gameObject.scene.time.delayedCall(i * pulseDelay, () => {
                const graphics = this.gameObject.scene.add.graphics({
                    fillStyle: { color: pulseColor, alpha: 0.3 },
                    lineStyle: { width: 0.5, color: pulseColor, alpha: 0.8 },
                });

                graphics.setDepth(this.gameObject.depth - 1); // Render behind the enemy
                graphics.x = this.gameObject.x;
                graphics.y = this.gameObject.y;

                this.gameObject.scene.tweens.add({
                    targets: graphics,
                    scale: pulseScale,
                    alpha: 0,
                    duration: pulseDuration,
                    ease: 'Sine.easeOut',
                    onUpdate: (_tween, target) => {
                        graphics.clear();
                        graphics.lineStyle(1, pulseColor, target.alpha * 0.8);
                        graphics.fillStyle(pulseColor, target.alpha * 0.3);
                        const radius = (this.gameObject.width / 2) * target.scale;
                        graphics.fillCircle(0, 0, radius);
                        graphics.strokeCircle(0, 0, radius);
                    },
                    onComplete: () => {
                        graphics.destroy();
                    },
                });
            });
        }
    }
}
