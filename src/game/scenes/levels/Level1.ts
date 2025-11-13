import * as Phaser from 'phaser';
import { Level } from '../lib/Level.ts';
import { GAME_HEIGHT, GAME_WIDTH } from '../../scripts/Util.ts';
import { getStoryName, LevelNames } from '../lib/LevelNames.ts';

export class Level1 extends Level {
    constructor() {
        super(LevelNames.HelloGenie);
    }

    private firstPath(): Phaser.Curves.Path {
        const path = new Phaser.Curves.Path(50, -10);
        path.lineTo(50, 150);
        path.lineTo(450, 150);
        path.lineTo(450, 875);
        path.lineTo(950, 875);
        path.lineTo(950, 275);
        path.lineTo(GAME_WIDTH - 100, 275);
        path.lineTo(GAME_WIDTH - 100, GAME_HEIGHT + 10);
        return path;
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        return { first: this.firstPath() };
    }

    getWaveConfig(wave: number): {
        type: string;
        texture: string;
        count: number;
        delay: number;
        health: number;
        speed: number;
        moneyValue: number;
        path: string;
    }[] {
        switch (wave) {
            case 1:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 10,
                        delay: 1500,
                        health: 100,
                        speed: 50,
                        moneyValue: 10,
                        path: 'first',
                    },
                ];
            case 2:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 15,
                        delay: 1200,
                        health: 100,
                        speed: 55,
                        moneyValue: 10,
                        path: 'first',
                    },
                ];
            case 3:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 10,
                        delay: 1000,
                        health: 110,
                        speed: 60,
                        moneyValue: 12,
                        path: 'first',
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 5,
                        delay: 2000,
                        health: 75,
                        speed: 80,
                        moneyValue: 15,
                        path: 'first',
                    },
                ];
            default:
                return [];
        }
    }

    nextScene(): string {
        return getStoryName(LevelNames.TrustMe);
    }
}
