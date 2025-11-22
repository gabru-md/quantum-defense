import { SlowingAura } from './SlowingAura';
import { Enemy } from '../entities/Enemy';

export class DestabilizationAura extends SlowingAura {
    constructor(range: number, slowFactor: number, private damageAmplification: number) {
        super(range, slowFactor);
    }

    protected applyEffect(enemy: Enemy): void {
        super.applyEffect(enemy);
        enemy.applyDamageAmplification(this.damageAmplification);
    }

    protected removeEffect(enemy: Enemy): void {
        super.removeEffect(enemy);
        enemy.removeDamageAmplification();
    }
}
