import {AppColors, phaserColor} from '../scripts/Colors.ts';

export interface TowerConfigType {
    name: string;
    upgradedName: string;
    texture: string;
    upgradedTexture: string;
    energyCost: number;
    upgradedEnergyCost: number;
    health: number;
    range: number;
    description: string;
    upgradedDescription: string;
    pulse: {
        color: number;
        pulseDelay: number;
        pulseDuration: number;
        pulseTotalPulses: number;
        pulseLineWidth: number;
    };
    attack?: {
        damage: number;
        fireRate: number;
        bulletSpeed?: number;
        aoeRadius?: number;
    };
    slowing?: {
        slowFactor: number;
    };
    upgradedAttack?: {
        damage: number;
        fireRate: number;
        bulletSpeed?: number;
        aoeRadius?: number;
        ricochetTargets?: number;
        ricochetDamage?: number;
        fissureDamage?: number;
        fissureDuration?: number;
    };
    upgradedSlowing?: {
        slowFactor: number;
        damageAmplification: number;
    };
}

export const TowerConfigs: { [key: string]: TowerConfigType } = {
    tower1: {
        name: 'Pulse Cannon',
        upgradedName: 'Chain Pulse Cannon',
        texture: 'tower1',
        upgradedTexture: 'tower1_upgraded',
        energyCost: 100,
        upgradedEnergyCost: 150,
        health: 200,
        range: 100,
        description: 'Pulse Cannon:\nRapid fire, single target damage.',
        upgradedDescription: 'Chain Pulse Cannon:\nRicochets to one additional target.',
        pulse: {
            color: phaserColor(AppColors.PULSE_LASER_TOWER),
            pulseDelay: 250,
            pulseDuration: 1000,
            pulseTotalPulses: 10,
            pulseLineWidth: 0.5,
        },
        attack: {
            damage: 25,
            fireRate: 200, // ms
            bulletSpeed: 300,
        },
        upgradedAttack: {
            damage: 30,
            fireRate: 180,
            bulletSpeed: 350,
            ricochetTargets: 1,
            ricochetDamage: 0.5,
        },
    },
    tower2: {
        name: 'Bomb Tower',
        upgradedName: 'Quantum Fissure Tower',
        texture: 'tower2',
        upgradedTexture: 'tower2_upgraded',
        energyCost: 250,
        upgradedEnergyCost: 350,
        health: 200,
        range: 80,
        description: 'Bomb Tower:\nSlow fire, area of effect damage.',
        upgradedDescription: 'Quantum Fissure Tower:\nLeaves a damaging field.',
        pulse: {
            color: phaserColor(AppColors.PULSE_BOMB_TOWER),
            pulseDelay: 400,
            pulseDuration: 2000,
            pulseTotalPulses: 10,
            pulseLineWidth: 0.5,
        },
        attack: {
            damage: 100,
            fireRate: 1500, // ms
            aoeRadius: 50,
        },
        upgradedAttack: {
            damage: 120,
            fireRate: 1400,
            aoeRadius: 60,
            fissureDamage: 10,
            fissureDuration: 2000,
        },
    },
    tower3: {
        name: 'Slow Tower',
        upgradedName: 'Destabilization Tower',
        texture: 'tower3',
        upgradedTexture: 'tower3_upgraded',
        energyCost: 350,
        upgradedEnergyCost: 450,
        health: 200,
        range: 150,
        description: 'Slowing Tower:\nSlows all enemies within its range.',
        upgradedDescription: 'Destabilization Tower:\nEnemies take more damage.',
        pulse: {
            color: phaserColor(AppColors.TOWER_SLOW),
            pulseDelay: 300,
            pulseDuration: 1500,
            pulseTotalPulses: 10,
            pulseLineWidth: 0.5,
        },
        slowing: {
            slowFactor: 0.5,
        },
        upgradedSlowing: {
            slowFactor: 0.6,
            damageAmplification: 0.15,
        },
    },
    specialTower: {
        name: 'Phantom Killer',
        upgradedName: 'Phantom Killer',
        texture: 'specialTower',
        upgradedTexture: 'specialTower',
        energyCost: 350,
        upgradedEnergyCost: 350,
        health: 200,
        range: 150,
        description: 'Special Tower:\nFinds and nukes the Phantoms',
        upgradedDescription: 'Special Tower:\nFinds and nukes the Phantoms',
        pulse: {
            color: phaserColor(AppColors.TOWER_SLOW),
            pulseDelay: 300,
            pulseDuration: 1500,
            pulseTotalPulses: 10,
            pulseLineWidth: 0.5,
        },
        slowing: {
            slowFactor: 0.5,
        },
    }
}
