import {GameObject} from '../core/GameObject';
import {Health} from '../components/Health';
import * as Phaser from 'phaser';
import {VisualPulse} from "../components/VisualPulse.ts";
import {GAME_HEIGHT, GAME_WIDTH} from "../scripts/Util.ts";

export class Bullet extends GameObject {
    public damage: number = 0;
    public source?: GameObject;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, source?: GameObject) {
        super(scene, x, y, texture);
        this.source = source;
        this.scene.physics.world.enable(this);
        this.setActive(false);
        this.setVisible(false);
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
        const visualPulseComponent = this.getComponent(VisualPulse);
        if (visualPulseComponent) {
            visualPulseComponent.destroy();
        }
        this.destroy();
    }

    update(_time: number, _delta: number) {
        if (this.outOfBounds()) {
            this.destroyBullet();
        }
    }

    private outOfBounds(): boolean {
        if (!this.scene) {
            return true;
        }
        return this.x < 0 ||
            this.x > GAME_WIDTH ||
            this.y < 0 ||
            this.y > GAME_HEIGHT;
    }
}
