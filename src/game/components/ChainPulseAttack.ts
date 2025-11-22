import { LaserAttack } from './LaserAttack';
import { GameObject } from '../core/GameObject';
import { Enemy } from '../entities/Enemy';
import { Bullet } from '../entities/Bullet';
import Phaser from 'phaser';

export class ChainPulseAttack extends LaserAttack {
    constructor(
        fireRate: number,
        damage: number,
        bulletSpeed: number,
        private bullets: Phaser.GameObjects.Group,
        private ricochetTargets: number,
        private ricochetDamage: number
    ) {
        super(fireRate, damage, bulletSpeed, bullets);
    }

    protected fire(target: GameObject): void {
        super.fire(target);
        const bullet = this.bullets.getLast(true);
        if (bullet) {
            bullet.setData('ricochetTargets', this.ricochetTargets);
            bullet.setData('ricochetDamage', this.ricochetDamage);
        }
    }
}
