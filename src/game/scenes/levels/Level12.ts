import {Level} from '../lib/Level.ts';
import {getStoryName, LevelNames} from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import {PathMaker} from "../lib/PathMaker.ts";
import {GAME_WIDTH} from "../../scripts/Util.ts";

export class Level12 extends Level {
    constructor() {
        super(LevelNames.Level12);
    }

    private firstPath(): Phaser.Curves.Path {
        const path = new PathMaker(GAME_WIDTH / 2, 150)
            .down(175)
            .left(600)
            .down(675)
            .reverse()
            .create(this);
        return path;
    }

    private secondPath(): Phaser.Curves.Path {
        const path = new PathMaker(GAME_WIDTH / 2, 150)
            .down(175)
            .right(600)
            .down(675)
            .reverse()
            .create(this);
        return path;
    }

    private thirdPath(): Phaser.Curves.Path {
        const path = new PathMaker(GAME_WIDTH / 2, 150)
            .down(175)
            .right(300)
            .down(675)
            .reverse()
            .create(this);
        return path;
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        return {
            first: this.firstPath(),
            second: this.secondPath(),
            third: this.thirdPath()
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
        return getStoryName(LevelNames.Level13);
    }
}
