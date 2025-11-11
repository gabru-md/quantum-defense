import * as Phaser from 'phaser';
import {Level} from './lib/Level.ts';
import {GAME_HEIGHT, GAME_WIDTH} from "../scripts/Util.ts";

export class Level5 extends Level {
    constructor() {
        super('Level 5');
    }

    private firstPath(): Phaser.Curves.Path {
        const path = new Phaser.Curves.Path(100, -10); // Start top-left
        path.lineTo(100, 200);
        path.lineTo(GAME_WIDTH - 300, 200);
        path.lineTo(GAME_WIDTH - 300, 400);
        path.lineTo(100, 400);
        path.lineTo(100, 600);
        path.lineTo(GAME_WIDTH - 600, 600);
        path.lineTo(GAME_WIDTH - 600, GAME_HEIGHT + 10); // End bottom-right
        return path;
    }

    private secondPath(): Phaser.Curves.Path {
        const path = new Phaser.Curves.Path(GAME_WIDTH - 100, -10); // Start top-right
        path.lineTo(GAME_WIDTH - 100, 200);
        path.lineTo(300, 200);
        path.lineTo(300, 400);
        path.lineTo(GAME_WIDTH - 100, 400);
        path.lineTo(GAME_WIDTH - 100, 600);
        path.lineTo(600, 600);
        path.lineTo(600, GAME_HEIGHT + 10); // End bottom-left
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
                    count: 10,
                    delay: 500,
                    health: 100,
                    speed: 50,
                    moneyValue: 10,
                    path: 'first'
                },
                {
                    type: 'enemy',
                    texture: 'enemy2',
                    count: 5,
                    delay: 500,
                    health: 50,
                    speed: 100,
                    moneyValue: 15,
                    path: 'second'
                },
                {
                    type: 'enemy',
                    texture: 'enemy3',
                    count: 2,
                    delay: 1000,
                    health: 500,
                    speed: 25,
                    moneyValue: 50,
                    path: 'first'
                }
            ]
        }
        if (wave === 2) {
            return [
                {
                    type: 'enemy',
                    texture: 'enemy1',
                    count: 10,
                    delay: 500,
                    health: 100,
                    speed: 50,
                    moneyValue: 10,
                    path: 'second'
                },
                {
                    type: 'enemy',
                    texture: 'enemy2',
                    count: 5,
                    delay: 500,
                    health: 50,
                    speed: 100,
                    moneyValue: 15,
                    path: 'first'
                },
                {
                    type: 'enemy',
                    texture: 'enemy3',
                    count: 2,
                    delay: 1000,
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
        return "Level 1"; // Loop back to Level1 for now, or a dedicated WinScene
    }
}
