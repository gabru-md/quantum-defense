import {Component} from "../core/Component.ts";
import {Targeting} from "./Targeting.ts";
import Phaser from "phaser";
import {Health} from "./Health.ts";
import {SpecialBullet} from "../entities/SpecialBullet.ts";


export class PhantomKillerAttack extends Component {
    private targetingComponent!: Targeting;
    private readonly fireRate: number; // in milliseconds
    private lastFired: number = 0;
    protected specialBullets: Phaser.GameObjects.Group;
    private readonly damage: number;
    private readonly bulletSpeed: number;

    constructor(fireRate: number, damage: number, bulletSpeed: number, bullets: Phaser.GameObjects.Group) {
        super();
        this.fireRate = fireRate;
        this.damage = damage;
        this.bulletSpeed = bulletSpeed;
        this.specialBullets = bullets;
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
        const healthComponent = this.gameObject.getComponent(Health);
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

    protected fireAt(target: Phaser.GameObjects.Sprite): void {
        this.gameObject.level.audioManager.playTowerSfx('laser_shoot', false, this.gameObject);
        // console.log('Shooting Phantom Attack tower')
        const bullet = new SpecialBullet(
            this.gameObject.scene,
            this.gameObject.x,
            this.gameObject.y,
            'specialBullet',
            this.gameObject
        );
        this.specialBullets.add(bullet, true);

        if (bullet) {
            bullet.fire(this.gameObject.x, this.gameObject.y, target.x, target.y, this.bulletSpeed, this.damage);
        }
    }
}