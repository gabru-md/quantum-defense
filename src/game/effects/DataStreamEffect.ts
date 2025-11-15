import * as Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../scripts/Util.ts';

export class DataStreamEffect {
    private scene: Phaser.Scene;
    private emitter!: Phaser.GameObjects.Particles.ParticleEmitter;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public start(): void {
        // Create a small, white, circular texture for the particles
        const particleGraphics = this.scene.add.graphics();
        particleGraphics.fillStyle(0xffffff, 1);
        particleGraphics.fillCircle(4, 4, 4);
        particleGraphics.generateTexture('data-particle', 8, 8);
        particleGraphics.destroy();

        this.emitter = this.scene.add.particles(0, 0, 'data-particle', {
            x: { min: -50, max: GAME_WIDTH },
            y: { min: 0, max: GAME_HEIGHT },
            lifespan: 15000, // Long lifespan to drift across the screen
            speed: { min: 10, max: 30 },
            angle: { min: 0, max: 360 }, // Move in random directions
            scale: { start: 0.1, end: 0.4 },
            alpha: { start: 0.1, end: 0.25, ease: 'Sine.easeInOut' }, // Start visible
            quantity: 4,
            blendMode: 'ADD',
            // @ts-ignore
            depth: -1, // Ensure it's in the background
        });
    }

    public stop(): void {
        if (this.emitter) {
            this.emitter.stop();
            // We can destroy the texture as well if it's not used elsewhere
            if (this.scene.textures.exists('data-particle')) {
                this.scene.textures.remove('data-particle');
            }
        }
    }
}
