import {Component} from '../core/Component';
import * as Phaser from 'phaser';
import {WaveManager} from '../scenes/lib/manager/WaveManager.ts';
import {Level} from '../scenes/lib/Level.ts';
import {Enemy} from "../entities/Enemy.ts";

export class PathFollower extends Component {
    private path: Phaser.Curves.Path;
    private baseSpeed: number;
    private pathPosition: number = 0;
    private speedModifiers: Map<number, number> = new Map();
    private playSoundAtRandomInterval: number;
    private lastSoundPlayed: number = 0;


    constructor(path: Phaser.Curves.Path, speed: number) {
        super();
        this.path = path;
        this.baseSpeed = speed;
        this.playSoundAtRandomInterval = Phaser.Math.Between(200, 3000);
    }

    public update(_time: number, deltaTime: number): void {
        if (this.isWaveManagerStopped()) {
            return;
        }

        if (_time - this.lastSoundPlayed > this.playSoundAtRandomInterval) {
            let enemy = this.gameObject as Enemy;
            let soundFxName = this.getSoundFx(enemy);
            this.lastSoundPlayed = _time;
            this.gameObject.level.audioManager.playEnemySound(soundFxName)
        }


        const currentSpeed = this.calculateCurrentSpeed();
        const pathLength = this.path.getLength();
        const distance = (currentSpeed * deltaTime) / 1000;
        this.pathPosition += distance / pathLength;

        if (this.pathPosition >= 1) {
            this.pathPosition = 1;
            this.gameObject.emit('reachedEnd');
            this.gameObject.destroy();
        }

        const point = this.path.getPoint(this.pathPosition);
        if (point) {
            this.gameObject.setPosition(point.x, point.y);
        }
    }

    public applySpeedModifier(modifier: number, sourceId: number): void {
        this.speedModifiers.set(sourceId, modifier);
    }

    public removeSpeedModifier(sourceId: number): void {
        this.speedModifiers.delete(sourceId);
    }

    private calculateCurrentSpeed(): number {
        let finalModifier = 1;
        // Find the strongest slow effect (lowest modifier)
        this.speedModifiers.forEach((modifier) => {
            if (modifier < finalModifier) {
                finalModifier = modifier;
            }
        });
        return this.baseSpeed * finalModifier * this.gameObject.scene.time.timeScale;
    }

    private isWaveManagerStopped() {
        if (this.gameObject) {
            const waveManager: WaveManager = (this.gameObject.scene as Level).waveManager;
            return waveManager && !waveManager.enabled;
        }
        return false;
    }

    private getSoundFx(enemy: Enemy) {
        switch (enemy.type) {
            case 'enemy1':
                return Phaser.Math.RND.pick(['stutter_1', 'stutter_2', 'stutter_3', 'stutter_4'])
            case 'enemy2':
                return Phaser.Math.RND.pick(['surge_1', 'surge_2'])
            case 'enemy3':
                return Phaser.Math.RND.pick(['brute'])
        }
        return '';
    }
}
