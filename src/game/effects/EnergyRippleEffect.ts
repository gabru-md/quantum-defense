import * as Phaser from 'phaser';
import { AppColors, phaserColor } from '../scripts/Colors.ts';
import { createWaveEffect } from '../utils/WaveEffectHelper.ts';
import { getResonanceWaveConfig } from '../config/WaveConfig.ts';
import { Tower } from '../entities/Tower.ts';

export class EnergyRippleEffect {
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public start(): void {
        this.scene.events.on('towerPlaced', this.onTowerPlaced, this);
        this.scene.events.on('resonanceWave', this.onResonanceWave, this);
        this.scene.events.on('nexusHit', this.onNexusHit, this);
    }

    public stop(): void {
        this.scene.events.off('towerPlaced', this.onTowerPlaced, this);
        // this.scene.events.off('resonanceWave', this.onResonanceWave, this); // Will maybe enable in future
        this.scene.events.off('nexusHit', this.onNexusHit, this);
    }

    private onTowerPlaced(tower: Tower): void {
        const config = getResonanceWaveConfig(tower.width * 2, phaserColor(AppColors.PLAYER_WAVE_PULSE));
        config.totalPulses = 1;
        config.duration = 500;
        createWaveEffect(this.scene, tower.x, tower.y, tower.width, config);
    }

    private onResonanceWave(x: number, y: number, range: number): void {
        const config = getResonanceWaveConfig(range, phaserColor(AppColors.PLAYER_WAVE_PULSE));
        config.totalPulses = 2;
        config.duration = 800;
        createWaveEffect(this.scene, x, y, 32, config); // Assuming player width of 32
    }

    private onNexusHit(x: number, y: number): void {
        const config = getResonanceWaveConfig(100, phaserColor(AppColors.UI_MESSAGE_ERROR));
        config.totalPulses = 3;
        config.duration = 1000;
        createWaveEffect(this.scene, x, y, 64, config); // Assuming nexus width of 64
    }
}
