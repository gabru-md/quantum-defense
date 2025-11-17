import { GameObject } from '../core/GameObject.ts';
import * as Phaser from 'phaser';

export class QuantumEcho extends GameObject {
    public color: number;

    constructor(scene: Phaser.Scene, x: number, y: number, color: number) {
        super(scene, x, y, 'quantum_echo_texture');
        this.color = color;
        this.setTint(this.color);
        this.setAlpha(0.8);
        this.setBlendMode(Phaser.BlendModes.ADD);

        scene.physics.world.enable(this);
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setCircle(12); // Small circular body for collection

        // Add a gentle floating animation
        scene.tweens.add({
            targets: this,
            y: y - 10,
            duration: 1500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
        });
    }
}
