import * as Phaser from 'phaser';
import {BaseLevel, GAME_HEIGHT, GAME_WIDTH} from './BaseLevel.ts';

export class Level1 extends BaseLevel {
    constructor() {
        super('Level 1'); // Unique key for this scene
    }

    private firstPath(): Phaser.Curves.Path {
        const path = new Phaser.Curves.Path(50, -10); // Start off-screen top
        path.lineTo(50, 150);
        path.lineTo(450, 150);
        path.lineTo(450, 875);
        path.lineTo(950, 875);
        path.lineTo(950, 275);
        path.lineTo(GAME_WIDTH - 100, 275);
        path.lineTo(GAME_WIDTH - 100, GAME_HEIGHT+10);
        return path;
    }

    protected definePaths() {
        this.paths = {
            'first': this.firstPath()
        }
    }

    protected getTowerSlots(): { x: number; y: number }[] {
        return [
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
                {type: 'enemy', texture: 'enemy1', count: 15, delay: 1000, health: 100, speed: 50, moneyValue: 10, path: 'first'},
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
                {type: 'enemy', texture: 'enemy1', count: 15, delay: 1000, health: 100, speed: 40, moneyValue: 10, path: 'first'},
                {type: 'enemy', texture: 'enemy1', count: 10, delay: 1500, health: 100, speed: 60, moneyValue: 10, path: 'first'}
            ]
        }
        return []; // No more waves for this level yet
    }

    protected nextScene(): string {
        return "Level 2";
    }
}
