import { GameObject } from '../core/GameObject.ts';
import * as Phaser from 'phaser';
import { RiftType } from './Rift.ts';

export class RiftWave extends GameObject {
    public riftType: RiftType;
    private graphics: Phaser.GameObjects.Graphics;
    private currentRadius: number = 0; // Current visual radius
    private waveColor: number;

    constructor(scene: Phaser.Scene, x: number, y: number, riftType: RiftType, maxRadius: number, waveSpeed: number, color: number) {
        super(scene, x, y, ''); // No texture needed, we'll use graphics
        this.riftType = riftType;
        this.waveColor = color;

        this.graphics = this.scene.add.graphics({ x: this.x, y: this.y });
        this.graphics.setBlendMode(Phaser.BlendModes.ADD);
        this.graphics.setAlpha(0); // Start fully transparent

        scene.physics.world.enable(this);
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setCircle(0); // Start with a tiny collision body
        body.setAllowGravity(false);

        const totalDuration = (maxRadius / waveSpeed) * 1000; // Time to reach max radius in ms

        // Tween for visual radius expansion
        this.scene.tweens.add({
            targets: this,
            currentRadius: maxRadius,
            duration: totalDuration,
            ease: 'Linear',
            onUpdate: () => {
                this.drawGlow();
                // Update collision body to match current visual radius
                body.setCircle(this.currentRadius);
                body.setOffset(-this.currentRadius, -this.currentRadius); // Adjust offset for circle origin
            },
            onComplete: () => {
                this.destroy(); // Destroy the object once the radius tween completes
            }
        });

        this.scene.tweens.add({
            targets: this.graphics,
            alpha: { from: 0.1, to: 0.25 },
            duration: totalDuration / 2, // Peak at half duration
            ease: 'Sine.easeIn',
            yoyo: true, // Go back to 0
            hold: 0, // No hold at peak
            repeat: 0,
        });
    }

    private drawGlow(): void {
        this.graphics.clear();
        this.graphics.fillStyle(this.waveColor, this.graphics.alpha); // Use graphics.alpha from tween
        this.graphics.fillCircle(0, 0, this.currentRadius);
    }

    destroy(fromScene?: boolean) {
        this.graphics.destroy();
        super.destroy(fromScene);
    }
}
