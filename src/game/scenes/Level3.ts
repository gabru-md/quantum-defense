import * as Phaser from 'phaser';
import {BaseTowerDefenseLevel, GAME_HEIGHT, TOWER1_COST, TOWER2_COST} from './BaseTowerDefenseLevel';

export class Level3 extends BaseTowerDefenseLevel {
    constructor() {
        super('Level 3');
    }

    private firstPath(): Phaser.Curves.Path {
        const path = new Phaser.Curves.Path(50, -50);
        path.lineTo(50, 150);
        path.lineTo(700, 150);
        path.lineTo(700, 350);
        path.lineTo(400, 350);
        path.circleTo(10);
        return path;
    }

    private secondPath(): Phaser.Curves.Path {
        const path = new Phaser.Curves.Path(750, GAME_HEIGHT + 50);
        path.lineTo(750, 550);
        path.lineTo(100, 550);
        path.lineTo(100, 350);
        path.lineTo(400, 350);
        path.circleTo(10);
        return path;
    }

    protected definePaths() {
        this.paths = {
            'first': this.firstPath(),
            'second': this.secondPath()
        }
    }

    protected getTowerSlots(): { x: number; y: number }[] {
        return [
            {x: 350, y: 100},
            {x: 550, y: 250},
            {x: 200, y: 450},
            {x: 600, y: 450},
            {x: 400, y: 650},
        ];
    }

    protected getWaveConfig(wave: number): {
        enemyType: string;
        count: number;
        delay: number;
        health: number;
        speed: number;
        moneyValue: number,
        path: string
    }[] {
        if (wave === 1) {
            return [
                {enemyType: 'enemy1', count: 5, delay: 1000, health: 100, speed: 50, moneyValue: 10, path: 'first'},
                {enemyType: 'enemy2', count: 1, delay: 1000, health: 50, speed: 100, moneyValue: 15, path: 'first'},
                {enemyType: 'enemy1', count: 5, delay: 1000, health: 100, speed: 50, moneyValue: 10, path: 'first'},
                {enemyType: 'enemy3', count: 1, delay: 2000, health: 500, speed: 25, moneyValue: 50, path: 'first'}, // Tanky enemy
                {enemyType: 'enemy1', count: 5, delay: 1000, health: 100, speed: 50, moneyValue: 10, path: 'first'},
                {enemyType: 'enemy2', count: 1, delay: 1000, health: 50, speed: 100, moneyValue: 15, path: 'first'},
                {enemyType: 'enemy1', count: 5, delay: 1000, health: 100, speed: 50, moneyValue: 10, path: 'first'},
                {enemyType: 'enemy3', count: 1, delay: 2000, health: 500, speed: 25, moneyValue: 50, path: 'first'}
            ]
        }
        return [];
    }

    protected getTowerCost(towerType: string): number {
        switch (towerType) {
            case 'tower1':
                return TOWER1_COST;
            case 'tower2':
                return TOWER2_COST;
            default:
                return 0;
        }
    }

    protected nextScene(): string {
        return "Level 4";
    }
}
