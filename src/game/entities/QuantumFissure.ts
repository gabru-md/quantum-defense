import Phaser from 'phaser';
import { Enemy } from './Enemy';

export class QuantumFissure extends Phaser.GameObjects.Zone {
    private fissureDamage: number;
    private enemies: Phaser.GameObjects.Group;

    constructor(scene: Phaser.Scene, x: number, y: number, radius: number, damage: number, duration: number) {
        super(scene, x, y, radius * 2, radius * 2);
        this.fissureDamage = damage;
        this.enemies = (scene as any).waveManager.enemies;

        scene.physics.world.enable(this);
        (this.body as Phaser.Physics.Arcade.Body).setCircle(radius);

        scene.time.delayedCall(duration, () => {
            this.destroy();
        });
    }

    update() {
        this.scene.physics.overlap(this, this.enemies, (fissure, enemy) => {
            (enemy as Enemy).takeDamage(this.fissureDamage);
        });
    }
}
