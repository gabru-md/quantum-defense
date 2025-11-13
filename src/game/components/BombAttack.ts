import { Component } from '../core/Component';
import { Targeting } from './Targeting';
import { Bomb } from '../entities/Bomb';
import * as Phaser from 'phaser';
import { Health } from './Health.ts';

/**
 * A component that gives a tower a bomb attack, firing AoE bombs at a target.
 */
export class BombAttack extends Component {
    private targetingComponent!: Targeting;
    private readonly fireRate: number; // in milliseconds
    private lastFired: number = 0;
    private bombs: Phaser.GameObjects.Group;
    private readonly damage: number;
    private readonly bombSpeed: number;
    private readonly explosionRadius: number;
    private readonly targetableGroups: Phaser.GameObjects.Group[]; // Need this for AoE damage

    constructor(
        fireRate: number,
        damage: number,
        bombSpeed: number,
        explosionRadius: number,
        bombs: Phaser.GameObjects.Group,
        targetableGroups: Phaser.GameObjects.Group[]
    ) {
        super();
        this.fireRate = fireRate;
        this.damage = damage;
        this.bombSpeed = bombSpeed;
        this.explosionRadius = explosionRadius;
        this.bombs = bombs;
        this.targetableGroups = targetableGroups;
    }

    public start(): void {
        const targeting = this.gameObject.getComponent(Targeting);
        if (!targeting) {
            throw new Error('BombAttack component requires a Targeting component on the same GameObject.');
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

    private fireAt(target: Phaser.GameObjects.Sprite): void {
        // Manually create the bomb instance, ensuring the scene context is correct.
        const bomb = new Bomb(this.gameObject.scene, this.gameObject.x, this.gameObject.y, 'bomb');
        this.bombs.add(bomb, true);

        if (bomb) {
            bomb.fire(
                this.gameObject.x,
                this.gameObject.y,
                target.x,
                target.y,
                this.bombSpeed,
                this.damage,
                this.explosionRadius,
                this.targetableGroups
            );
        }
    }
}
