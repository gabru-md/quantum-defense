import * as Phaser from 'phaser';
import {Level} from '../lib/Level.ts';
import {GAME_HEIGHT, GAME_WIDTH} from "../../scripts/Util.ts";
import {getStoryName, LevelNames} from "./LevelNames.ts";

export class Level2 extends Level {
    constructor() {
        super(LevelNames.HelloGenie);
    }

    private firstPath(): Phaser.Curves.Path {
        const path = new Phaser.Curves.Path(100, -10);
        path.lineTo(100, GAME_HEIGHT / 2);
        path.lineTo(GAME_WIDTH - 100, GAME_HEIGHT / 2);
        path.lineTo(GAME_WIDTH - 100, GAME_HEIGHT + 10);
        return path;
    }

    private secondPath(): Phaser.Curves.Path {
        const path = new Phaser.Curves.Path(GAME_WIDTH / 2, -10);
        path.lineTo(GAME_WIDTH / 2, GAME_HEIGHT + 10);
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
        switch (wave) {
            case 1:
                return [
                    {type: 'enemy', texture: 'enemy1', count: 10, delay: 1000, health: 110, speed: 55, moneyValue: 10, path: 'first'},
                    {type: 'enemy', texture: 'enemy2', count: 5, delay: 1500, health: 80, speed: 90, moneyValue: 15, path: 'second'},
                ];
            case 2:
                return [
                    {type: 'enemy', texture: 'enemy2', count: 10, delay: 800, health: 80, speed: 100, moneyValue: 15, path: 'first'},
                    {type: 'enemy', texture: 'enemy1', count: 10, delay: 1200, health: 120, speed: 60, moneyValue: 12, path: 'second'},
                ];
            case 3:
                return [
                    {type: 'enemy', texture: 'enemy1', count: 15, delay: 1000, health: 120, speed: 60, moneyValue: 12, path: 'first'},
                    {type: 'enemy', texture: 'enemy2', count: 10, delay: 800, health: 85, speed: 110, moneyValue: 18, path: 'second'},
                ];
            default:
                return [];
        }
    }

    nextScene(): string {
        return getStoryName(LevelNames.ThePhantom)
    }
}
