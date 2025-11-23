import {GameObject} from '../core/GameObject.ts';
import * as Phaser from 'phaser';
import {Hoverable} from "../components/Hoverable.ts";

export class QuantumEcho extends GameObject {
    public color: number;
    public energyValue: number;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'quantum_echo_texture');
        this.setScale(Phaser.Math.FloatBetween(0.5, 1));
        this.setBlendMode(Phaser.BlendModes.ADD);

        scene.physics.world.enable(this);
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setCircle(12); // Small circular body for collection
        body.setAllowGravity(false); // Ensure it doesn't fall
        scene.add.existing(this);
        this.setAlpha(0.85);

        // // Drift away and fade out over time
        const driftDuration = Phaser.Math.Between(5000, 8000);
        const driftAngle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        const driftDistance = Phaser.Math.Between(50, 300);

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

        this.addComponentOverriding(new Hoverable('Quantum Echoes'))

        this.energyValue = Phaser.Math.Between(10, 25);
    }
}
