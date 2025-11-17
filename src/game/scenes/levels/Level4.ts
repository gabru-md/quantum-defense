import {Level} from '../lib/Level.ts';
import {LevelNames} from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import {PathMaker} from "../lib/PathMaker.ts";
import {GAME_WIDTH} from "../../scripts/Util.ts";

export class Gameplay_ThePhantomArrival extends Level { // Renamed class
    constructor() {
        super(LevelNames.Gameplay_ThePhantomArrival); // Updated super call
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
        return LevelNames.Story_VolatileInterference; // Next scene is the story for Volatile Interference
    }
}
