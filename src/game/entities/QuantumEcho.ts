import {GameObject} from '../core/GameObject.ts';
import * as Phaser from 'phaser';

export class QuantumEcho extends GameObject {
    public color: number;

    constructor(scene: Phaser.Scene, x: number, y: number, color: number) {
        super(scene, x, y, 'quantum_echo_texture');
        this.color = color;
        this.setTint(this.color);
        this.setScale(Phaser.Math.FloatBetween(0.5, 1));
        this.setBlendMode(Phaser.BlendModes.ADD);

        scene.physics.world.enable(this);
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setCircle(12); // Small circular body for collection
        body.setAllowGravity(false); // Ensure it doesn't fall
        scene.add.existing(this);

        // // Drift away and fade out over time
        const driftDuration = Phaser.Math.Between(5000, 8000);
        const driftAngle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        const driftDistance = Phaser.Math.Between(30, 100);

        scene.tweens.add({
            targets: this,
            x: x + Math.cos(driftAngle) * driftDistance,
            y: y + Math.sin(driftAngle) * driftDistance,
            alpha: {start: 0, end: 0.8, ease: 'Sine.easeInOut'},
            duration: driftDuration / 2,
            ease: 'Power1', // A gentle ease out
            onComplete: () => {
                this.destroy();
            },
        });
    }
}
