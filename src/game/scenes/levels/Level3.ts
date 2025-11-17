import { Level } from '../lib/Level.ts';
import { LevelNames } from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import {PathMaker} from "../lib/PathMaker.ts";
import {GAME_HEIGHT, GAME_WIDTH} from "../../scripts/Util.ts";

export class Gameplay_TheDormantScars extends Level { // Renamed class
    constructor() {
        super(LevelNames.Gameplay_TheDormantScars); // Updated super call
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        const path = new PathMaker(GAME_WIDTH - 175, GAME_HEIGHT - 225)
            .left(825)
            .up(250)
            .left(100)
            .up(100)
            .right(100)
            .up(250)
            .right(825)
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
        return LevelNames.Story_ThePhantomArrival; // Next scene is the story for The Phantom's Arrival
    }
}
