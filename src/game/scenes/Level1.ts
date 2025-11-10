import * as Phaser from 'phaser';
import {BaseTowerDefenseLevel, GAME_HEIGHT, GAME_WIDTH} from './BaseTowerDefenseLevel';

export class Level1 extends BaseTowerDefenseLevel {
    constructor() {
        super('Level 1'); // Unique key for this scene
    }

    private firstPath(): Phaser.Curves.Path {
        const path = new Phaser.Curves.Path(50, -50); // Start off-screen top
        path.lineTo(50, 150);
        path.lineTo(450, 150);
        path.lineTo(450, 875);
        path.lineTo(950, 875);
        path.lineTo(950, 275);
        path.lineTo(GAME_WIDTH - 100, 275);
        path.lineTo(GAME_WIDTH - 100, GAME_HEIGHT+50);
        return path;
    }

    private secondPath(): Phaser.Curves.Path {
        const path = new Phaser.Curves.Path(GAME_WIDTH - 400, -50); // Start off-screen top
        path.lineTo(GAME_WIDTH - 400, 675);
        path.lineTo(750, 675);
        path.lineTo(450, 675);
        path.lineTo(200, 675);
        path.lineTo(200, GAME_HEIGHT+50);
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
            {x: 150, y: 250},
            {x: 350, y: 250},
            {x: 350, y: 450},
            {x: 550, y: 450},
        ];
    }

    protected getWaveConfig(wave: number): {
        type: string;
        texture: string;
        count: number;
        delay: number;
        health: number;
        speed: number;
        moneyValue: number;
        path: string;
    }[] {
        if (wave === 1) {
            return [
                {type: 'enemy', texture: 'enemy1', count: 15, delay: 1000, health: 100, speed: 50, moneyValue: 10, path: 'second'},
                {type: 'healer', texture: 'healer', count: 3, delay: 500, health: 50, speed: 100, moneyValue: 50, path: 'first'},
                {type: 'enemy', texture: 'enemy2', count: 10, delay: 1200, health: 50, speed: 100, moneyValue: 50, path: 'first'}
            ];
        }
        if (wave === 2) {
            return [
                {type: 'enemy', texture: 'enemy1', count: 10, delay: 1500, health: 100, speed: 50, moneyValue: 10, path: 'first'}
            ]
        }
        if (wave === 3) {
            return [
                {type: 'enemy', texture: 'enemy1', count: 15, delay: 1000, health: 100, speed: 40, moneyValue: 10, path: 'second'},
                {type: 'enemy', texture: 'enemy1', count: 10, delay: 1500, health: 100, speed: 60, moneyValue: 10, path: 'first'}
            ]
        }
        return []; // No more waves for this level yet
    }

    protected nextScene(): string {
        return "Level 2";
    }
}
