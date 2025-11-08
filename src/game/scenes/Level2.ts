import * as Phaser from 'phaser';
import {BaseTowerDefenseLevel, GAME_HEIGHT, TOWER1_COST, TOWER2_COST} from './BaseTowerDefenseLevel';

export class Level2 extends BaseTowerDefenseLevel {
    constructor() {
        super('Level 2'); // Unique key for this scene
    }

    private firstPath(): Phaser.Curves.Path {
        const path = new Phaser.Curves.Path(50, -50);
        path.lineTo(50, 200);
        path.lineTo(600, 200);
        path.lineTo(600, 400);
        path.lineTo(150, 400);
        path.lineTo(150, 600);
        path.lineTo(750, 600);
        path.lineTo(750, GAME_HEIGHT + 50);
        path.circleTo(10);
        return path;
    }

    private secondPath(): Phaser.Curves.Path {
        const path = new Phaser.Curves.Path(375, GAME_HEIGHT + 50);
        path.lineTo(375, -50);
        path.circleTo(10);
        return path;
    }

    protected definePaths(): void {
        this.paths = {
            'first': this.firstPath(),
            'second': this.secondPath(),
            // 'third': this.thirdPath()
        }
    }

    protected getTowerSlots(): { x: number; y: number }[] {
        return [
            {x: 300, y: 100},
            {x: 450, y: 300},
            {x: 250, y: 500},
            {x: 650, y: 500},
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
                {enemyType: 'enemy1', count: 4, delay: 1000, health: 100, speed: 50, moneyValue: 10, path: 'first'},
                {enemyType: 'enemy2', count: 5, delay: 1000, health: 50, speed: 100, moneyValue: 15, path: 'second'}
            ]
        }
        if (wave === 2) {
            return [
                {enemyType: 'enemy2', count: 4, delay: 1000, health: 100, speed: 50, moneyValue: 10, path: 'first'},
                {enemyType: 'enemy1', count: 10, delay: 1000, health: 50, speed: 100, moneyValue: 15, path: 'second'}
            ]
        }
        return []; // No more waves for this level yet
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
        return "Level 3";
    }
}
