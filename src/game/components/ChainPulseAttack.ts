import { LaserAttack } from './LaserAttack';
import { GameObject } from '../core/GameObject';
import Phaser from 'phaser';

export class ChainPulseAttack extends LaserAttack {
    constructor(
        fireRate: number,
        damage: number,
        bulletSpeed: number,
        bullets: Phaser.GameObjects.Group,
        private ricochetTargets: number,
        private ricochetDamage: number
    ) {
        super(fireRate, damage, bulletSpeed, bullets);
    }

    protected fireAt(target: GameObject): void {
        super.fireAt(target);
        const bullet = this.bullets.getLast(true);
        if (bullet) {
            bullet.setData('ricochetTargets', this.ricochetTargets);
            bullet.setData('ricochetDamage', this.ricochetDamage);
        }
    }
}
