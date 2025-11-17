import {Level} from '../lib/Level.ts';
import {LevelNames} from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import {PathMaker} from "../lib/PathMaker.ts";
import {GAME_WIDTH} from "../../scripts/Util.ts";

export class Gameplay_VolatileFrontierPart2 extends Level { // Renamed class
    constructor() {
        super(LevelNames.Gameplay_VolatileFrontierPart2); // Updated super call
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        const path = new PathMaker(GAME_WIDTH * 5 / 8, 100)
            .down(600)
            .right(200)
            .down(150)
            .left(775)
            .up(500)
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
        return LevelNames.Story_StaticNewGlitches; // Next scene is the story for Static's New Glitches
    }
}
