import {Level} from '../lib/Level.ts';
import {getStoryName, LevelNames} from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import {PathMaker} from "../lib/PathMaker.ts";
import {GAME_HEIGHT} from "../../scripts/Util.ts";

export class Level14 extends Level {
    constructor() {
        super(LevelNames.Level14);
    }

    private firstPath(): Phaser.Curves.Path {
        const path = new PathMaker(100, GAME_HEIGHT - 200)
            .right(300)
            .down(150)
            .right(400)
            .up(100)
            .right(175)
            .up(325)
            .right(300)
            .down(325)
            .right(100)
            .up(625)
            .create(this);
        return path
    }

    private secondPath(): Phaser.Curves.Path {
        const path = new PathMaker(100, GAME_HEIGHT - 200)
            .right(200)
            .up(400)
            .right(200)
            .down(275)
            .right(300)
            .up(475)
            .left(125)
            .up(150)
            .right(500)
            .down(300)
            .right(200)
            .up(200)
            .create(this);
        return path
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        return {
            first: this.firstPath(),
            second: this.secondPath()
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

    nextScene(): string {
        return getStoryName(LevelNames.Level15);
    }
}
