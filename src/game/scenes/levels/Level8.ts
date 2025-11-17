import { Level } from '../lib/Level.ts';
import { LevelNames } from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import {PathMaker} from "../lib/PathMaker.ts";

export class Gameplay_VolatileFrontierPart1 extends Level { // Renamed class
    constructor() {
        super(LevelNames.Gameplay_VolatileFrontierPart1); // Updated super call
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        const path = new PathMaker(1325, 75)
            .down(800)
            .left(975)
            .up(650)
            .right(400)
            .down(225)
            .right(325)
            .create(this);
        return { first: path };
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
        return LevelNames.Story_VolatileFrontierPart2; // Next scene is the story for Volatile Frontier (Part 2)
    }
}
