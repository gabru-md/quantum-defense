import * as Phaser from 'phaser';
import {GAME_HEIGHT, WIDTH} from '../scripts/Util.ts';

export class DataStreamEffect {
    private scene: Phaser.Scene;
    private emitter!: Phaser.GameObjects.Particles.ParticleEmitter;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public start(flowType: 'chaos' | 'laminar' = 'chaos'): void {
        if (!this.scene.textures.exists('data-particle')) {
            const particleGraphics = this.scene.add.graphics();
            particleGraphics.fillStyle(0xffffff, 1);
            particleGraphics.fillCircle(4, 4, 4);
            particleGraphics.generateTexture('data-particle', 8, 8);
            particleGraphics.destroy();
        }

        this.emitter = this.scene.add.particles(0, 0, 'data-particle', {});
        this.setFlow(flowType);
    }

    public setFlow(flowType: 'chaos' | 'laminar'): void {
        if (!this.emitter) {
            return;
        }

        if (flowType === 'laminar') {
            this.emitter.setConfig({
                x: -10,
                y: { min: 0, max: GAME_HEIGHT },
                lifespan: 10000,
                speed: { min: 50, max: 200 },
                angle: { min: -5, max: 5 },
                scale: { start: 0.1, end: 0.3 },
                alpha: { start: 0.3, end: 0.2, ease: 'Sine.easeInOut' },
                quantity: 2,
                blendMode: 'ADD',
                // @ts-ignore
                depth: -1,
            });
        } else { // Chaos flow
            this.emitter.setConfig({
                x: { min: -50, max: WIDTH },
                y: { min: 0, max: GAME_HEIGHT },
                lifespan: 15000,
                speed: { min: 10, max: 30 },
                angle: { min: 0, max: 360 },
                scale: { start: 0.1, end: 0.4 },
                alpha: { start: 0.15, end: 0.25, ease: 'Sine.easeInOut' },
                quantity: 2,
                blendMode: 'ADD',
                // @ts-ignore
                depth: -1,
            });
        }
    }

    public stop(): void {
        if (this.emitter) {
            this.emitter.destroy();
        }
    }
}
