import { Component } from '../core/Component';
import { Level } from '../scenes/lib/Level';
import { Enemy } from '../entities/Enemy';
import { PathFollower } from './PathFollower';
import * as Phaser from 'phaser';

export class SlowingAura extends Component {
    private range: number;
    private slowFactor: number;
    private affectedEnemies: Set<PathFollower> = new Set();

    constructor(range: number, slowFactor: number) {
        super();
        this.range = range;
        this.slowFactor = slowFactor;
    }

    update(_time: number, _delta: number): void {
        const currentScene = this.gameObject.scene as Level;
        const allEnemies = [
            ...currentScene.waveManager.enemies.getChildren(),
            ...currentScene.waveManager.specialEnemies.getChildren()
        ];

        const newlyAffected: Set<PathFollower> = new Set();

        for (const enemy of allEnemies as Enemy[]) {
            if (!enemy.active) continue;

            const distance = Phaser.Math.Distance.Between(
                this.gameObject.x,
                this.gameObject.y,
                enemy.x,
                enemy.y
            );

            const pathFollower = enemy.getComponent(PathFollower);
            if (!pathFollower) continue;

            if (distance <= this.range) {
                // Enemy is in range, apply slow
                console.log(this.gameObject.id)
                pathFollower.applySpeedModifier(this.slowFactor, this.gameObject.id);
                newlyAffected.add(pathFollower);
            }
        }

        // Remove slow effect from enemies that are no longer in range
        this.affectedEnemies.forEach(follower => {
            if (!newlyAffected.has(follower)) {
                follower.removeSpeedModifier(this.gameObject.id);
            }
        });

        this.affectedEnemies = newlyAffected;
    }

    destroy(): void {
        // When the tower is destroyed, remove its slow effect from all affected enemies
        this.affectedEnemies.forEach(follower => {
            follower.removeSpeedModifier(this.gameObject.id);
        });
        this.affectedEnemies.clear();
    }
}
