import {Component} from "../core/Component.ts";

export class FindNearestTower extends Component {
    public nearestTower: any | null = null; // TODO: Replace 'any' with actual Tower type

    public update(_deltaTime: number): void {
        this.findClosestTower();
    }

    private findClosestTower(): void {
        let closestTower: any | null = null; // TODO: Replace 'any' with actual Tower type
        let closestDistance = Number.MAX_VALUE;

        const playerPosition = this.gameObject.getCenter();
        const towers = (this.gameObject.scene as any).towers; // Access towers from the scene

        if (!towers) {
            return;
        }

        for (const tower of towers.getChildren()) {
            const distance = Phaser.Math.Distance.Between(
                playerPosition.x,
                playerPosition.y,
                tower.x,
                tower.y
            );

            if (distance < closestDistance) {
                closestDistance = distance;
                closestTower = tower;
            }
        }
        this.nearestTower = closestTower;
    }

}