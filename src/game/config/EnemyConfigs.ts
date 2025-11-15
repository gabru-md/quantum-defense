import { AppColors, phaserColor } from '../scripts/Colors.ts';

export interface EnemyConfigType {
    texture: string;
    health: number;
    speed: number;
    moneyValue: number;
    color: number;
}

export interface SpecialEnemyConfigType extends EnemyConfigType {
    deactivationRadius: number;
    deactivationInterval: number;
    pulseColor: number;
}

export const EnemyConfigs: { [key: string]: EnemyConfigType } = {
    enemy1: {
        texture: 'enemy1',
        health: 50,
        speed: 50,
        moneyValue: 10,
        color: phaserColor(AppColors.ENEMY_NORMAL),
    },
    enemy2: {
        texture: 'enemy2',
        health: 40,
        speed: 80,
        moneyValue: 15,
        color: phaserColor(AppColors.ENEMY_FAST),
    },
    enemy3: {
        texture: 'enemy3',
        health: 200,
        speed: 40,
        moneyValue: 25,
        color: phaserColor(AppColors.ENEMY_TANK),
    },
};

export const SpecialEnemyConfig: SpecialEnemyConfigType = {
    texture: 'specialEnemy',
    health: 50,
    speed: 60,
    moneyValue: 100,
    color: phaserColor(AppColors.SPECIAL_ENEMY),
    deactivationRadius: 75,
    deactivationInterval: 2000,
    pulseColor: phaserColor(AppColors.ENEMY_SPECIAL_IDLE),
};
