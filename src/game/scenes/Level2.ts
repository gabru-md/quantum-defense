import * as Phaser from 'phaser';
import {BaseTowerDefenseLevel, GAME_HEIGHT} from './BaseTowerDefenseLevel';

export class Level2 extends BaseTowerDefenseLevel {
    constructor() {
        super('Level 2'); // Unique key for this scene
    }

    private firstPath(): Phaser.Curves.Path {
        const path = new Phaser.Curves.Path(150, -50);
        path.lineTo(150, 200);
        path.lineTo(600, 200);
        path.lineTo(600, 400);
        path.lineTo(150, 400);
        path.lineTo(150, 800);
        path.lineTo(1050, 800);
        path.lineTo(1050, GAME_HEIGHT);
        return path;
    }

    private secondPath(): Phaser.Curves.Path {
        const path = new Phaser.Curves.Path(375, GAME_HEIGHT);
        path.lineTo(375, -50);
        // round-a-bout-curve
        path.lineTo(1050, -50);
        path.lineTo(1050, 150);
        path.lineTo(600, 150);
        path.lineTo(600, -50);
        path.lineTo(825, -50);
        path.lineTo(825, GAME_HEIGHT+50);
        path.lineTo(1275, GAME_HEIGHT+50);
        path.lineTo(1275, -50);
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
        type: string,
        texture: string;
        count: number;
        delay: number;
        health: number;
        speed: number;
        moneyValue: number,
        path: string
    }[] {
        if (wave === 1) {
            return [
                {
                    type: 'enemy',
                    texture: 'enemy1',
                    count: 4,
                    delay: 500,
                    health: 100,
                    speed: 40,
                    moneyValue: 10,
                    path: 'first'
                },
                {
                    type: 'enemy',
                    texture: 'enemy2',
                    count: 5,
                    delay: 750,
                    health: 50,
                    speed: 80,
                    moneyValue: 15,
                    path: 'second'
                }
            ]
        }
        if (wave === 2) {
            return [
                {
                    type: 'enemy',
                    texture: 'enemy2',
                    count: 4,
                    delay: 1000,
                    health: 100,
                    speed: 50,
                    moneyValue: 10,
                    path: 'first'
                },
                {
                    type: 'enemy',
                    texture: 'enemy1',
                    count: 10,
                    delay: 1000,
                    health: 50,
                    speed: 100,
                    moneyValue: 15,
                    path: 'second'
                }
            ]
        }
        return []; // No more waves for this level yet
    }

    protected nextScene(): string {
        return "Level 3";
    }
}
