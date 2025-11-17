import { Level } from '../lib/Level.ts';
import { LevelNames } from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import {PathMaker} from "../lib/PathMaker.ts";
import {GAME_HEIGHT} from "../../scripts/Util.ts";

export class Gameplay_HelloGenie extends Level { // Renamed class
    constructor() {
        super(LevelNames.Gameplay_HelloGenie); // Updated super call
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        const path = new PathMaker(150, GAME_HEIGHT - 150)
            .up(200)
            .right(500)
            .down(75)
            .right(300)
            .up(600)
            .left(300)
            .down(75)
            .left(500)
            .up(200)
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
        return LevelNames.Story_TheDormantScars; // Next scene is the story for The Dormant Scars
    }
}
