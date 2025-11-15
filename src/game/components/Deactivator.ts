import { Component } from '../core/Component';
import { Tower } from '../entities/Tower';
import { Level } from '../scenes/lib/Level';
import * as Phaser from 'phaser';
import { getDeactivationWaveConfig } from '../config/WaveConfig.ts';
import { createWaveEffect } from '../utils/WaveEffectHelper.ts';
import { SpecialEnemyConfig } from '../config/EnemyConfigs.ts'; // Import SpecialEnemyConfig

/**
 * A component that allows a GameObject to deactivate nearby towers.
 */
export class Deactivator extends Component {
    private deactivationRadius: number = SpecialEnemyConfig.deactivationRadius; // Use config value
    private deactivationInterval: number = SpecialEnemyConfig.deactivationInterval; // Use config value
    private lastDeactivation: number = 0;

    public update(time: number, _deltaTime: number): void {
        if (this.isReady(time)) {
            this.deactivateNearbyTowers();
            this.lastDeactivation = time;
            // Create the visual pulse when deactivating
            createWaveEffect(
                this.gameObject.scene,
                this.gameObject.x,
                this.gameObject.y,
                this.gameObject.width,
                getDeactivationWaveConfig(this.deactivationRadius)
            );
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
}
