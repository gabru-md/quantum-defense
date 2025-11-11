import {Component} from '../core/Component';
import {Tower} from '../entities/Tower';
import {Level} from '../scenes/lib/Level';
import * as Phaser from 'phaser';

/**
 * A component that allows a GameObject to deactivate nearby towers.
 */
export class Deactivator extends Component {
    private deactivationRadius: number = 75; // Radius to deactivate towers
    private deactivationInterval: number = 2000; // Deactivate every 2 seconds
    private lastDeactivation: number = 0;

    public update(time: number, _deltaTime: number): void {
        if (time > this.lastDeactivation + this.deactivationInterval) {
            this.deactivateNearbyTowers();
            this.lastDeactivation = time;
        }
    }

    private deactivateNearbyTowers(): void {
        const towers = (this.gameObject.scene as Level).towerManager.towers;
        if (!towers) {
            return;
        }

        for (const tower of towers.getChildren() as Tower[]) {
            if (tower.active) {
                const distance = Phaser.Math.Distance.Between(
                    this.gameObject.x,
                    this.gameObject.y,
                    tower.x,
                    tower.y
                );

                if (distance <= this.deactivationRadius) {
                    // Emit an event from the tower to be deactivated
                    console.log('tower deactivated')
                    tower.deactivateTower();
                    this.gameObject.scene.events.emit('towerDeactivated');
                }
            }
        }
    }
}
