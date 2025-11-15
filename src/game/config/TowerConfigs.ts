import { AppColors, phaserColor } from '../scripts/Colors.ts';

export interface TowerConfigType {
    texture: string;
    cost: number;
    health: number;
    range: number;
    description: string;
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
}

export const TowerConfigs: { [key: string]: TowerConfigType } = {
    tower1: {
        texture: 'tower1',
        cost: 100,
        health: 300,
        range: 150,
        description: 'Laser Tower:\nRapid fire, single target damage.',
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
    },
    tower2: {
        texture: 'tower2',
        cost: 150,
        health: 500,
        range: 133,
        description: 'Bomb Tower:\nSlow fire, area of effect damage.',
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
            aoeRadius: 75,
        },
    },
    tower3: {
        texture: 'tower3',
        cost: 120,
        health: 200,
        range: 175,
        description: 'Slowing Tower:\nSlows all enemies within its range.',
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
    },
};
