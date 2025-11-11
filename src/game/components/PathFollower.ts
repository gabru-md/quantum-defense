import {Component} from '../core/Component';
import * as Phaser from 'phaser';
import {WaveManager} from "../scenes/lib/manager/WaveManager.ts";
import {Level} from "../scenes/lib/Level.ts";

export class PathFollower extends Component {
    private path: Phaser.Curves.Path;
    private baseSpeed: number;
    private pathPosition: number = 0;
    private speedModifiers: Map<number, number> = new Map();

    constructor(path: Phaser.Curves.Path, speed: number) {
        super();
        this.path = path;
        this.baseSpeed = speed;
    }

    public update(_time: number, deltaTime: number): void {
        if (this.isWaveManagerStopped()) {
            return;
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
        this.speedModifiers.forEach(modifier => {
            if (modifier < finalModifier) {
                finalModifier = modifier;
            }
        });
        return this.baseSpeed * finalModifier;
    }

    private isWaveManagerStopped() {
        if (this.gameObject) {
            let waveManager: WaveManager = (this.gameObject.scene as Level).waveManager;
            return waveManager && !waveManager.enabled;
        }
        return false;
    }
}
