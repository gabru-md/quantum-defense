import {Component} from '../core/Component';
import {Level} from '../scenes/lib/Level';
import {Enemy} from '../entities/Enemy';
import {PathFollower} from './PathFollower';
import * as Phaser from 'phaser';
import {Tower} from "../entities/Tower.ts";

export class SlowingAura extends Component {
    private range: number;
    private slowFactor: number;
    private affectedEnemies: Set<Enemy> = new Set();

    constructor(range: number, slowFactor: number) {
        super();
        this.range = range;
        this.slowFactor = slowFactor;
    }

    update(_time: number, _delta: number): void {
        const currentScene = this.gameObject.scene as Level;
        const allEnemies = [
            ...currentScene.waveManager.enemies.getChildren(),
            ...currentScene.waveManager.specialEnemies.getChildren(),
        ];
        const newlyAffected: Set<Enemy> = new Set();

        for (const enemy of allEnemies as Enemy[]) {
            if (!enemy.active) continue;

            const distance = Phaser.Math.Distance.Between(this.gameObject.x, this.gameObject.y, enemy.x, enemy.y);

            if (distance <= this.range) {
                if (!this.affectedEnemies.has(enemy)) {
                    this.applyEffect(enemy);
                }
                newlyAffected.add(enemy);
            }
        }

        this.affectedEnemies.forEach((enemy) => {
            if (!newlyAffected.has(enemy)) {
                this.removeEffect(enemy);
            }
        });

        this.affectedEnemies = newlyAffected;
    }

    protected applyEffect(enemy: Enemy): void {
        const pathFollower = enemy.getComponent(PathFollower);
        if (pathFollower) {
            pathFollower.applySpeedModifier(this.slowFactor, this.gameObject.id);
            const tower = this.gameObject as Tower;
            if (!tower.isSoundPlaying) {
                tower.isSoundPlaying = true;
                tower.level.audioManager.playSound('ShootSlowTower', {
                    volume: 1, onComplete: () => {
                        tower.isSoundPlaying = false;
                    }
                });
            }
        }
    }

    protected removeEffect(enemy: Enemy): void {
        const pathFollower = enemy.getComponent(PathFollower);
        if (pathFollower) {
            pathFollower.removeSpeedModifier(this.gameObject.id);
        }
    }

    destroy(): void {
        this.affectedEnemies.forEach((enemy) => {
            this.removeEffect(enemy);
        });
        this.affectedEnemies.clear();
    }
}
