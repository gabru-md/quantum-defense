import {GameObject} from '../core/GameObject';
import {Health} from '../components/Health';
import * as Phaser from 'phaser';
import {VisualPulse} from "../components/VisualPulse.ts";

export class Bullet extends GameObject {
    public damage: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);
        this.scene.physics.world.enable(this);
        this.setActive(false);
        this.setVisible(false);
        // this.addComponent(new VisualPulse(Phaser.Display.Color.ValueToColor('0xcf0d0d').color, 200, 800, 1.2, 20))
    }

    public fire(x: number, y: number, targetX: number, targetY: number, speed: number, damage: number): void {
        this.damage = damage;
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);

        const direction = new Phaser.Math.Vector2(targetX - x, targetY - y).normalize();
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(direction.x * speed, direction.y * speed);
    }

    public applyDamage(target: GameObject): void {
        const healthComponent = target.getComponent(Health);
        if (healthComponent) {
            healthComponent.takeDamage(this.damage);
        }
        this.destroyBullet();
    }

    public destroyBullet(): void {
        let visualPulseComponent = this.getComponent(VisualPulse);
        if (visualPulseComponent) {
            visualPulseComponent.destroy();
        }
        this.destroy();
    }
}
