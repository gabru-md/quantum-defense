import {Level} from '../lib/Level.ts';
import {getStoryName, LevelNames} from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import {PathMaker} from "../lib/PathMaker.ts";

export class Level11 extends Level {
    constructor() {
        super(LevelNames.Level11);
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        const path = new PathMaker(100, 100)
            .right(600)
            .down(750)
            .right(400)
            .up(675)
            .right(200)
            .down(450)
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

    nextScene(): string {
        return getStoryName(LevelNames.Level12);
    }
}
