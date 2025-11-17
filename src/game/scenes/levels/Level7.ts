import {Level} from '../lib/Level.ts';
import {LevelNames} from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import {PathMaker} from "../lib/PathMaker.ts";

export class Gameplay_InitialBreakthrough extends Level { // Renamed class
    constructor() {
        super(LevelNames.Gameplay_InitialBreakthrough); // Updated super call
    }

    private getFirstPath(): Phaser.Curves.Path {
        const path = new PathMaker(100, 100)
            .right(1000)
            .down(750)
            .left(850)
            .create(this)
        return path;
    }

    private getSecondPath(): Phaser.Curves.Path {
        const path = new PathMaker(100, 250)
            .right(850)
            .down(75)
            .left(425)
            .down(525)
            .left(275)
            .create(this);
        return path;
    }


    definePaths(): { [key: string]: Phaser.Curves.Path } {
        return {
            first: this.getFirstPath(),
            second: this.getSecondPath()
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
        return LevelNames.Story_VolatileFrontierPart1; // Next scene is the story for Volatile Frontier (Part 1)
    }
}
