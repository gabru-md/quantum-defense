import {AppColors, phaserColor} from '../scripts/Colors.ts';

export interface EnemyConfigType {
    name: string;
    texture: string;
    health: number;
    speed: number;
    energyValue: number; // Renamed: Money value to energy value
    color: number;
}

export interface SpecialEnemyConfigType extends EnemyConfigType {
    deactivationRadius: number;
    deactivationInterval: number;
    pulseColor: number;
}

export const EnemyConfigs: { [key: string]: EnemyConfigType } = {
    enemy1: {
        name: 'Stutters',
        texture: 'enemy1',
        health: 50,
        speed: 50,
        energyValue: 10,
        color: phaserColor(AppColors.ENEMY_NORMAL),
    },
    enemy2: {
        name: 'Surges',
        texture: 'enemy2',
        health: 40,
        speed: 80,
        energyValue: 15,
        color: phaserColor(AppColors.ENEMY_FAST),
    },
    enemy3: {
        name: 'Brutes',
        texture: 'enemy3',
        health: 200,
        speed: 40,
        energyValue: 25,
        color: phaserColor(AppColors.ENEMY_TANK),
    },
    upgradedEnemy: {
        name: 'Brutus',
        texture: 'upgradedEnemy',
        health: 200,
        speed: 80,
        energyValue: 30,
        color: phaserColor(AppColors.ENEMY_FAST_TANK),
    },
};

export const SpecialEnemyConfig: SpecialEnemyConfigType = {
    name: 'Phantom',
    texture: 'specialEnemy',
    health: 50,
    speed: 60,
    energyValue: 100, // Renamed: Money value to energy value
    color: phaserColor(AppColors.SPECIAL_ENEMY),
    deactivationRadius: 75,
    deactivationInterval: 2000,
    pulseColor: phaserColor(AppColors.SPECIAL_ENEMY_WAVE_PULSE),
};
