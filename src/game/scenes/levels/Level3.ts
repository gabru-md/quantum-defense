import * as Phaser from 'phaser';
import {Level} from '../lib/Level.ts';
import {GAME_HEIGHT, GAME_WIDTH} from "../../scripts/Util.ts";
import {getStoryName, LevelNames} from "./LevelNames.ts";

export class Level3 extends Level {
    constructor() {
        super(LevelNames.ThePhantom);
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
        switch (wave) {
            case 1:
                return [
                    {type: 'enemy', texture: 'enemy1', count: 10, delay: 1000, health: 120, speed: 60, moneyValue: 12, path: 'first'},
                    {type: 'enemy', texture: 'enemy2', count: 5, delay: 800, health: 85, speed: 110, moneyValue: 18, path: 'second'},
                ];
            case 2:
                return [
                    {type: 'enemy', texture: 'enemy3', count: 3, delay: 2000, health: 600, speed: 30, moneyValue: 50, path: 'first'},
                    {type: 'enemy', texture: 'enemy1', count: 10, delay: 1000, health: 120, speed: 60, moneyValue: 12, path: 'second'},
                ];
            case 3:
                return [
                    {type: 'enemy', texture: 'enemy1', count: 10, delay: 1000, health: 130, speed: 65, moneyValue: 15, path: 'first'},
                    {type: 'enemy', texture: 'enemy2', count: 10, delay: 700, health: 90, speed: 120, moneyValue: 20, path: 'second'},
                    {type: 'specialEnemy', texture: 'specialEnemy', count: 1, delay: 5000, health: 200, speed: 70, moneyValue: 100, path: 'first'},
                ];
            default:
                return [];
        }
    }

     nextScene(): string {
         return getStoryName(LevelNames.RiseOfStatic);
    }
}
