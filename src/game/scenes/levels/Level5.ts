import * as Phaser from 'phaser';
import { Level } from '../lib/Level.ts';
import { GAME_HEIGHT, GAME_WIDTH } from '../../scripts/Util.ts';
import {getStoryName, LevelNames} from '../lib/LevelNames.ts';

export class Level5 extends Level {
    constructor() {
        super(LevelNames.Breakthrough);
    }

    private firstPath(): Phaser.Curves.Path {
        const path = new Phaser.Curves.Path(100, -10);
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
        const path = new Phaser.Curves.Path(GAME_WIDTH - 100, -10);
        path.lineTo(GAME_WIDTH - 100, 200);
        path.lineTo(300, 200);
        path.lineTo(300, 400);
        path.lineTo(GAME_WIDTH - 100, 400);
        path.lineTo(GAME_WIDTH - 100, 600);
        path.lineTo(600, 600);
        path.lineTo(600, GAME_HEIGHT + 10); // End bottom-left
        return path;
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        return {
            first: this.firstPath(),
            second: this.secondPath(),
        };
    }

    getWaveConfig(wave: number): {
        type: string;
        texture: string;
        count: number;
        delay: number;
        health: number;
        speed: number;
        energyValue: number;
        path: string;
    }[] {
        switch (wave) {
            case 1:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 20,
                        delay: 500,
                        health: 150,
                        speed: 70,
                        energyValue: 15,
                        path: 'first',
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 10,
                        delay: 400,
                        health: 100,
                        speed: 130,
                        energyValue: 20,
                        path: 'second',
                    },
                ];
            case 2:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy3',
                        count: 5,
                        delay: 1000,
                        health: 800,
                        speed: 40,
                        energyValue: 75,
                        path: 'first',
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 15,
                        delay: 500,
                        health: 150,
                        speed: 70,
                        energyValue: 15,
                        path: 'second',
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 10,
                        delay: 400,
                        health: 100,
                        speed: 130,
                        energyValue: 20,
                        path: 'first',
                    },
                ];
            case 3:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 25,
                        delay: 300,
                        health: 160,
                        speed: 75,
                        energyValue: 18,
                        path: 'first',
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 15,
                        delay: 250,
                        health: 110,
                        speed: 140,
                        energyValue: 25,
                        path: 'second',
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy3',
                        count: 8,
                        delay: 800,
                        health: 900,
                        speed: 45,
                        energyValue: 90,
                        path: 'first',
                    },
                    {
                        type: 'specialEnemy',
                        texture: 'specialEnemy',
                        count: 2,
                        delay: 5000,
                        health: 300,
                        speed: 90,
                        energyValue: 150,
                        path: 'second',
                    },
                ];
            default:
                return [];
        }
    }

    nextScene(): string {
        return getStoryName(LevelNames.TheCliffhanger);
    }
}
