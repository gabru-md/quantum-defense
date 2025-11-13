import {Component} from "../core/Component.ts";
import {Level} from "../scenes/lib/Level.ts";
import {Tower} from "../entities/Tower.ts";

export class FindNearestTower extends Component {
    public nearestTower: Tower | null = null;

    public update(_time: number, _deltaTime: number): void {
        this.findClosestTower();
    }

    private findClosestTower(): void {
        try {
            let closestTower: Tower | null = null;
            let closestDistance = Number.MAX_VALUE;

            const playerPosition = this.gameObject.getCenter();
            const towers = (this.gameObject.scene as Level).towerManager.towers; // Access towers from the scene

            if (!towers) {
                return;
            }

            for (const tower of towers.getChildren()) {
                const _tower: Tower = tower as Tower;
                const distance = Phaser.Math.Distance.Between(
                    playerPosition.x,
                    playerPosition.y,
                    _tower.x,
                    _tower.y
                );

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestTower = _tower;
                }
            }
            this.nearestTower = closestTower;
        } catch (e) {
            // console.error(e);
        }
    }

}