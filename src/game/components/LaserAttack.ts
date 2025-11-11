import {Component} from '../core/Component';
import {Targeting} from './Targeting';
import {Bullet} from '../entities/Bullet';
import * as Phaser from 'phaser';
import {Health} from "./Health.ts";

export class LaserAttack extends Component {
    private targetingComponent!: Targeting;
    private readonly fireRate: number; // in milliseconds
    private lastFired: number = 0;
    private bullets: Phaser.GameObjects.Group;
    private readonly damage: number;
    private readonly bulletSpeed: number;

    constructor(fireRate: number, damage: number, bulletSpeed: number, bullets: Phaser.GameObjects.Group) {
        super();
        this.fireRate = fireRate;
        this.damage = damage;
        this.bulletSpeed = bulletSpeed;
        this.bullets = bullets;
    }

    public start(): void {
        const targeting = this.gameObject.getComponent(Targeting);
        if (!targeting) {
            throw new Error('LaserAttack component requires a Targeting component on the same GameObject.');
        }
        this.targetingComponent = targeting;
    }

    public update(time: number, _deltaTime: number): void {
        const target = this.targetingComponent.currentTarget;

        let healthComponent = this.gameObject.getComponent(Health);
        if (healthComponent) {
            if (healthComponent.isDead()) {
                return;
            }
        }
        if (target && target.active && time > this.lastFired + this.fireRate) {
            this.fireAt(target);
            this.lastFired = time;
        }
    }

    private fireAt(target: Phaser.GameObjects.Sprite): void {
        const bullet = new Bullet(this.gameObject.scene, this.gameObject.x, this.gameObject.y, 'bullet', this.gameObject);
        this.bullets.add(bullet, true);

        if (bullet) {
            bullet.fire(this.gameObject.x, this.gameObject.y, target.x, target.y, this.bulletSpeed, this.damage);
        }
    }
}
