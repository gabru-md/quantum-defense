import * as Phaser from 'phaser';
import {Level} from './lib/Level.ts';
import {GAME_HEIGHT, GAME_WIDTH} from "../scripts/util.ts";


export class Level2 extends Level {
    constructor() {
        super('Level 2'); // Unique key for this scene
    }

    private firstPath(): Phaser.Curves.Path {
        const path = new Phaser.Curves.Path(100, -10); // Start top-left
        path.lineTo(100, GAME_HEIGHT / 2);
        path.lineTo(GAME_WIDTH - 100, GAME_HEIGHT / 2);
        path.lineTo(GAME_WIDTH - 100, GAME_HEIGHT + 10); // End bottom-right
        return path;
    }

    private secondPath(): Phaser.Curves.Path {
        const path = new Phaser.Curves.Path(GAME_WIDTH / 2, -10); // Start top-center
        path.lineTo(GAME_WIDTH / 2, GAME_HEIGHT + 10); // End bottom-center
        return path;
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        return {
            'first': this.firstPath(),
            'second': this.secondPath(),
        }
    }

    getWaveConfig(wave: number): {
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

    nextScene(): string {
        return "Level 3";
    }
}
