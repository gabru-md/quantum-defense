import {GameObject} from '../core/GameObject.ts';
import * as Phaser from 'phaser';
import {RiftType} from './Rift.ts';

export class RiftWave extends GameObject {
    public riftType: RiftType;
    private waveRadius: number = 0;
    private maxRadius: number;
    private waveSpeed: number;
    private color: number;
    private graphics: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, x: number, y: number, riftType: RiftType, maxRadius: number, waveSpeed: number, color: number) {
        super(scene, x, y, ''); // No texture needed, we'll use graphics
        this.riftType = riftType;
        this.maxRadius = maxRadius;
        this.waveSpeed = waveSpeed;
        this.color = color;
        this.graphics = this.scene.add.graphics({x: this.x, y: this.y});
        this.graphics.lineStyle(0.25, color, 1);
        this.graphics.setAlpha(0.8);
        this.graphics.setBlendMode(Phaser.BlendModes.ADD);

        scene.physics.world.enable(this);
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setCircle(this.waveRadius);
        body.setAllowGravity(false);

        this.scene.tweens.add({
            targets: this,
            waveRadius: this.maxRadius,
            duration: (this.maxRadius / this.waveSpeed) * 1000,
            onUpdate: () => {
                this.updateWave();
            },
            onComplete: () => {
                this.destroy();
            }
        });
    }

    private updateWave(): void {
        this.graphics.clear();
        this.graphics.lineStyle(4, this.color, 1);
        this.graphics.strokeCircle(0, 0, this.waveRadius);
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setCircle(this.waveRadius);
    }

    destroy(fromScene?: boolean) {
        this.graphics.destroy();
        super.destroy(fromScene);
    }
}
