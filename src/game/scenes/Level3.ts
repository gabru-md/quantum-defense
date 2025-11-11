import * as Phaser from 'phaser';
import {Level} from './lib/Level.ts';
import {GAME_HEIGHT, GAME_WIDTH} from "../scripts/util.ts";

export class Level3 extends Level {
    constructor() {
        super('Level 3');
    }

    private firstPath(): Phaser.Curves.Path {
        const path = new Phaser.Curves.Path(100, -10);
        path.lineTo(100, 150);
        path.lineTo(GAME_WIDTH - 100, 150);
        path.lineTo(GAME_WIDTH - 100, 350);
        path.lineTo(GAME_WIDTH / 2, 350);
        return path;
    }

    private secondPath(): Phaser.Curves.Path {
        const path = new Phaser.Curves.Path(GAME_WIDTH - 100, GAME_HEIGHT + 10);
        path.lineTo(GAME_WIDTH - 100, GAME_HEIGHT - 150);
        path.lineTo(100, GAME_HEIGHT - 150);
        path.lineTo(100, GAME_HEIGHT - 350);
        path.lineTo(GAME_WIDTH - 100, GAME_HEIGHT - 350);
        path.lineTo(GAME_WIDTH - 100, GAME_HEIGHT - 500);
        path.lineTo(100, GAME_HEIGHT - 500);
        path.lineTo(100, 350);
        path.lineTo(GAME_WIDTH / 2, 350);
        return path;
    }

     definePaths() {
        return {
            'first': this.firstPath(),
            'second': this.secondPath()
        }
    }

     getWaveConfig(wave: number): {
        type: string;
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
                    count: 5,
                    delay: 1000,
                    health: 100,
                    speed: 50,
                    moneyValue: 10,
                    path: 'first'
                },
                {
                    type: 'enemy',
                    texture: 'enemy2',
                    count: 1,
                    delay: 1000,
                    health: 50,
                    speed: 100,
                    moneyValue: 15,
                    path: 'first'
                },
                {
                    type: 'enemy',
                    texture: 'enemy1',
                    count: 5,
                    delay: 1000,
                    health: 100,
                    speed: 50,
                    moneyValue: 10,
                    path: 'first'
                },
                {
                    type: 'enemy',
                    texture: 'enemy3',
                    count: 1,
                    delay: 2000,
                    health: 500,
                    speed: 25,
                    moneyValue: 50,
                    path: 'first'
                }, // Tanky enemy
                {
                    type: 'enemy',
                    texture: 'enemy1',
                    count: 5,
                    delay: 1000,
                    health: 100,
                    speed: 50,
                    moneyValue: 10,
                    path: 'second'
                },
                {
                    type: 'enemy',
                    texture: 'enemy2',
                    count: 1,
                    delay: 1000,
                    health: 50,
                    speed: 100,
                    moneyValue: 15,
                    path: 'second'
                },
                {
                    type: 'enemy',
                    texture: 'enemy1',
                    count: 5,
                    delay: 1000,
                    health: 100,
                    speed: 50,
                    moneyValue: 10,
                    path: 'second'
                },
                {
                    type: 'enemy',
                    texture: 'enemy3',
                    count: 1,
                    delay: 2000,
                    health: 500,
                    speed: 25,
                    moneyValue: 50,
                    path: 'second'
                }
            ]
        }
        return [];
    }

     nextScene(): string {
        return "Level 4";
    }
}
