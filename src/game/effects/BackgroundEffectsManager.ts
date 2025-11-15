import * as Phaser from 'phaser';
import { GhostlyClashEffect } from './GhostlyClashEffect.ts';
import { DataStreamEffect } from './DataStreamEffect.ts';
import { GlitchAnnihilationEffect } from './GlitchAnnihilationEffect.ts';
import { EnergyRippleEffect } from './EnergyRippleEffect.ts'; // Import the new effect

export class BackgroundEffectsManager {
    private scene: Phaser.Scene;
    private activeEffects: (GhostlyClashEffect | DataStreamEffect | GlitchAnnihilationEffect | EnergyRippleEffect)[] = []; // Add other effect types here

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public start(): void {
        const ghostlyClash = new GhostlyClashEffect(this.scene);
        ghostlyClash.start();
        this.activeEffects.push(ghostlyClash);

        const dataStreams = new DataStreamEffect(this.scene);
        dataStreams.start();
        this.activeEffects.push(dataStreams);

        const glitchAnnihilation = new GlitchAnnihilationEffect(this.scene);
        glitchAnnihilation.start();
        this.activeEffects.push(glitchAnnihilation);

        const energyRipples = new EnergyRippleEffect(this.scene);
        energyRipples.start();
        this.activeEffects.push(energyRipples);
    }

    public stop(): void {
        this.activeEffects.forEach(effect => effect.stop());
        this.activeEffects = [];
    }
}
