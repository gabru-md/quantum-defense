import { BombAttack } from './BombAttack';
import { GameObject } from '../core/GameObject';
import { Enemy } from '../entities/Enemy';
import { Bomb } from '../entities/Bomb';
import Phaser from 'phaser';
import { QuantumFissure } from '../entities/QuantumFissure';

export class QuantumFissureAttack extends BombAttack {
    constructor(
        fireRate: number,
        damage: number,
        range: number,
        aoeRadius: number,
        private bombs: Phaser.GameObjects.Group,
        private enemies: Phaser.GameObjects.Group[],
        private fissureDamage: number,
        private fissureDuration: number
    ) {
        super(fireRate, damage, range, aoeRadius, bombs, enemies);
    }

    protected fire(target: GameObject): void {
        super.fire(target);
        const bomb = this.bombs.getLast(true);
        if (bomb) {
            bomb.on('exploded', (x: number, y: number) => {
                const fissure = new QuantumFissure(this.gameObject.scene, x, y, this.aoeRadius, this.fissureDamage, this.fissureDuration);
                this.gameObject.scene.add.existing(fissure);
            });
        }
    }
}
