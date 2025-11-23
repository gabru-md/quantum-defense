import { Component } from '../core/Component.ts';
import { GameObject } from '../core/GameObject.ts';
// import { AppColors } from '../scripts/Colors.ts';

export class GravitationalPull extends Component {
    private target: GameObject;
    private strength: number;
    private particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

    constructor(target: GameObject, strength: number) {
        super();
        this.target = target;
        this.strength = strength;
    }

    init(): void {
        // this.particleEmitter = this.gameObject.scene.add.particles('player').createEmitter({
        //     speed: { min: 50, max: 150 },
        //     angle: { min: 0, max: 360 },
        //     scale: { start: 0.3, end: 0 },
        //     blendMode: 'ADD',
        //     lifespan: 300,
        //     tint: [AppColors.ENEMY_TANK],
        // });
        // this.particleEmitter.stop();
    }

    update(_time: number, delta: number): void {
        if (!this.target.active) {
            this.gameObject.destroy();
            return;
        }

        const body = this.gameObject.body as Phaser.Physics.Arcade.Body;
        const direction = new Phaser.Math.Vector2(this.target.x - this.gameObject.x, this.target.y - this.gameObject.y);
        const distance = direction.length();
        
        if (distance < this.target.width / 2) {
            // this.particleEmitter.explode(20, this.gameObject.x, this.gameObject.y);
            this.gameObject.destroy();
            return;
        }

        direction.normalize();
        const acceleration = this.strength / (distance * distance);
        body.velocity.x += direction.x * acceleration * (delta / 1000);
        body.velocity.y += direction.y * acceleration * (delta / 1000);
    }

    destroy(): void {
        this.particleEmitter.destroy();
    }
}
