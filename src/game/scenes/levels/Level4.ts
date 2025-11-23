import {Level} from '../lib/Level.ts';
import {LevelNames} from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import {PathMaker} from "../lib/PathMaker.ts";
import {GAME_HEIGHT, GAME_WIDTH} from "../../scripts/Util.ts";

export class Gameplay_ExpandingFront_4 extends Level {
    constructor() {
        super(LevelNames.Gameplay_ExpandingFront_4);
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        const path = new PathMaker(GAME_WIDTH / 4, 125)
            .down(100)
            .left(250)
            .down(700)
            .right(775)
            .up(400)
            .right(250)
            .up(225)
            .create(this);
        return {first: path};
    }

    create() {
        super.create();
        this.createRift(550, GAME_HEIGHT / 2, 'dormant');
        this.createRift(1200, GAME_HEIGHT * 3 / 4, 'dormant');
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
                return [{ type: 'enemy', texture: 'enemy1', count: 20, delay: 1000, health: 120, speed: 60, energyValue: 10, path: 'first' }];
            case 2:
                return [{ type: 'enemy', texture: 'enemy1', count: 25, delay: 800, health: 130, speed: 65, energyValue: 10, path: 'first' }];
            case 3:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 20, delay: 700, health: 140, speed: 70, energyValue: 12, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 8, delay: 1200, health: 95, speed: 80, energyValue: 15, path: 'first' },
                ];
            case 4:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 25, delay: 600, health: 150, speed: 75, energyValue: 12, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 10, delay: 1000, health: 105, speed: 85, energyValue: 15, path: 'first' },
                ];
            case 5:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 30, delay: 500, health: 160, speed: 80, energyValue: 15, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 12, delay: 900, health: 115, speed: 90, energyValue: 18, path: 'first' },
                ];
            case 6:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 35, delay: 450, health: 170, speed: 85, energyValue: 15, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 15, delay: 800, health: 125, speed: 95, energyValue: 18, path: 'first' },
                ];
            case 7:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 30, delay: 400, health: 180, speed: 90, energyValue: 18, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 18, delay: 700, health: 135, speed: 100, energyValue: 20, path: 'first' },
                ];
            case 8:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 35, delay: 350, health: 190, speed: 95, energyValue: 18, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 20, delay: 600, health: 145, speed: 105, energyValue: 20, path: 'first' },
                ];
            case 9:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 40, delay: 300, health: 200, speed: 100, energyValue: 20, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 25, delay: 500, health: 155, speed: 110, energyValue: 22, path: 'first' },
                ];
            case 10:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 45, delay: 250, health: 210, speed: 105, energyValue: 22, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 30, delay: 400, health: 165, speed: 115, energyValue: 25, path: 'first' },
                ];
            default:
                return [];
        }
    }

    nextScene(): LevelNames {
        return LevelNames.Story_VolatileInterference;
    }
}
