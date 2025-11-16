import { Level } from '../lib/Level.ts';
import { getStoryName, LevelNames } from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import {PathMaker} from "../lib/PathMaker.ts";

export class Level8 extends Level {
    constructor() {
        super(LevelNames.Level8);
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

    nextScene(): string {
        return getStoryName(LevelNames.Level9);
    }
}
