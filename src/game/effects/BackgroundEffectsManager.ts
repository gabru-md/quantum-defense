import * as Phaser from 'phaser';
import {GhostlyClashEffect} from './GhostlyClashEffect.ts';
import {DataStreamEffect} from './DataStreamEffect.ts';
import {GlitchAnnihilationEffect} from './GlitchAnnihilationEffect.ts';
import {EnergyRippleEffect} from './EnergyRippleEffect.ts'; // Import the new effect

export class BackgroundEffectsManager {
    private readonly scene: Phaser.Scene;
    private activeEffects: (GhostlyClashEffect | DataStreamEffect | GlitchAnnihilationEffect | EnergyRippleEffect)[] = []; // Add other effect types here

    constructor(scene: Phaser.Scene, effects: (GhostlyClashEffect | DataStreamEffect | GlitchAnnihilationEffect | EnergyRippleEffect)[] = []) {
        this.scene = scene;
        this.activeEffects = effects;
    }

    public start(): void {
        this.enable_all()
        this.activeEffects.forEach(effect => {
            // @ts-ignore
            effect.start();
        });
    }

    public enableGhostlyClashEffect(scene: Phaser.Scene) {
        const effect = new GhostlyClashEffect(scene);
        effect.start();
        this.activeEffects.push(effect);
    }

    public enableDataStreamEffect(scene: Phaser.Scene, flowType: 'chaos' | 'laminar' = 'chaos') {
        const existingEffect = this.activeEffects.find(effect => effect instanceof DataStreamEffect);

        if (existingEffect && existingEffect instanceof DataStreamEffect) {
            existingEffect.setFlow(flowType);
        } else {
            const newEffect = new DataStreamEffect(scene);
            newEffect.start(flowType);
            this.activeEffects.push(newEffect);
        }
    }

    public enableGlitchAnnihilationEffect(scene: Phaser.Scene) {
        const effect = new GlitchAnnihilationEffect(scene);
        effect.start();
        this.activeEffects.push(effect);
    }

    public enableEnergyRippleEffect(scene: Phaser.Scene) {
        const effect = new EnergyRippleEffect(scene);
        effect.start();
        this.activeEffects.push(effect);
    }

    public enable_all(): void {
        this.activeEffects.push(new GhostlyClashEffect(this.scene));
        this.activeEffects.push(new DataStreamEffect(this.scene));
        this.activeEffects.push(new GlitchAnnihilationEffect(this.scene));
        this.activeEffects.push(new EnergyRippleEffect(this.scene));
    }

    public stop(): void {
        this.activeEffects.forEach(effect => effect.stop());
        this.activeEffects = [];
    }
}
