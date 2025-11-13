import { Component } from '../core/Component';
import { Enemy } from '../entities/Enemy';
import * as Phaser from 'phaser';

export class Targeting extends Component {
    public currentTarget: Enemy | null = null;

    private readonly range: number;
    private targetableGroups: Phaser.GameObjects.Group[];

    constructor(range: number, targetableGroups: Phaser.GameObjects.Group[]) {
        super();
        this.range = range;
        this.targetableGroups = targetableGroups;
    }

    public update(_time: number, _deltaTime: number): void {
        this.findClosestEnemy();
    }

    private findClosestEnemy(): void {
        let closestEnemy: Enemy | null = null;
        let closestDistance = this.range;

        const towerPosition = this.gameObject.getCenter();

        for (const targetableGroup of this.targetableGroups) {
            for (const enemy of targetableGroup.getChildren() as Enemy[]) {
                if (enemy.active) {
                    const distance = Phaser.Math.Distance.Between(towerPosition.x, towerPosition.y, enemy.x, enemy.y);

                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestEnemy = enemy;
                    }
                }
            }
        }

        this.currentTarget = closestEnemy;
    }
}
