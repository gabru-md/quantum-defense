import { GameObject } from '../core/GameObject.ts';
import * as Phaser from 'phaser';
import { RiftWave } from './RiftWave.ts';
import { QuantumEcho } from './QuantumEcho.ts';
import { AppColors, phaserColor } from '../scripts/Colors.ts';
import {RiftElements} from "../effects/GlitchAnnihilationEffect.ts";
import {Level} from "../scenes/lib/Level.ts";

export type RiftType = 'static' | 'player' | 'gradient';

export class Rift extends GameObject {
    public riftType: RiftType;
    private waveCooldown: number;
    private lastWaveTime: number = 0;
    private riftColor: number;
    private secondaryColor: number | null = null;
    private riftElements: RiftElements;
    public scaleFactor: number;

    constructor(scene: Level, x: number, y: number, type: RiftType) {
        super(scene, x, y, ''); // No texture needed

        this.riftType = type;
        this.waveCooldown = 10000; // 10 seconds, can be configured
        this.scaleFactor = Phaser.Math.FloatBetween(0.5, 0.87);

        switch (this.riftType) {
            case 'static':
                this.riftColor = phaserColor(AppColors.SPECIAL_ENEMY);
                break;
            case 'player':
                this.riftColor = phaserColor(AppColors.PLAYER);
                break;
            case 'gradient':
                this.riftColor = phaserColor(AppColors.PLAYER);
                this.secondaryColor = phaserColor(AppColors.SPECIAL_ENEMY);
                break;
        }

        this.riftElements = scene.glitchManager.drawRiftElements(x, y, 3, this.scaleFactor, this.riftColor, this.secondaryColor, 0.8);
        scene.glitchManager.animateRiftIdle(this.riftElements);
    }

    update(time: number, delta: number): void {
        super.update(time, delta);
        if (time > this.lastWaveTime + this.waveCooldown) {
            this.emitWave();
            this.lastWaveTime = time;
        }
    }

    private emitWave(): void {
        let waveType = this.riftType;
        if (this.riftType === 'gradient') {
            waveType = Math.random() < 0.5 ? 'static' : 'player';
        }

        const wave = new RiftWave(this.scene, this.x, this.y, waveType, 300, 100, this.riftColor);
        (this.scene as Level).riftWaves.add(wave);

        const echo = new QuantumEcho(this.scene, this.x, this.y, this.riftColor);
        (this.scene as Level).quantumEchoes.add(echo);
    }

    destroy(fromScene?: boolean) {
        this.riftElements.core.destroy();
        this.riftElements.innerGlow.destroy();
        this.riftElements.outerGlow.destroy();
        this.riftElements.rays.forEach(ray => ray.destroy());
        this.riftElements.fragments.forEach(fragment => fragment.destroy());
        super.destroy(fromScene);
    }
}
