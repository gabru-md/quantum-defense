import {Level} from '../lib/Level.ts';
import {LevelNames} from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import {PathMaker} from "../lib/PathMaker.ts";
import {GAME_WIDTH} from "../../scripts/Util.ts";

export class Gameplay_TheResonanceWave extends Level { // Renamed class
    constructor() {
        super(LevelNames.Gameplay_TheResonanceWave); // Updated super call
    }

    private firstPath(): Phaser.Curves.Path {
        const path = new PathMaker(GAME_WIDTH * 3 / 8, 100)
            .down(250)
            .right(700)
            .down(250)
            .left(1100)
            .down(150)
            .right(550)
            .down(175)
            .right(600)
            .create(this);
        return path;
    }

    private secondPath(): Phaser.Curves.Path {
        const path = new PathMaker(170, 100)
            .down(250)
            .right(400)
            .right(700)
            .down(250)
            .left(1100)
            .down(150)
            .right(550)
            .down(175)
            .right(600)
            .create(this);
        return path;
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        return {first: this.firstPath(), second: this.secondPath()};
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
                        count: 10,
                        delay: 1500,
                        health: 100,
                        speed: 50,
                        energyValue: 10,
                        path: 'first',
                    },
                ];
            default:
                return [];
        }
    }

    nextScene(): LevelNames { // Changed return type to LevelNames
        return LevelNames.MainMenu; // Next scene is the MainMenu after the final level
    }
}
