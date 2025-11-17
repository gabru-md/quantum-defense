import {Level} from '../lib/Level.ts';
import {LevelNames} from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import {PathMaker} from "../lib/PathMaker.ts";
import {GAME_HEIGHT, GAME_WIDTH} from "../../scripts/Util.ts";

export class Gameplay_SamplingTheEchoes extends Level { // Renamed class
    constructor() {
        super(LevelNames.Gameplay_SamplingTheEchoes); // Updated super call
    }

    private getFirstPath(): Phaser.Curves.Path {
        const path = new PathMaker(GAME_WIDTH * 3 / 4, 100)
            .down(400)
            .left(400)
            .up(225)
            .left(500)
            .down(500)
            .create(this)
        return path;
    }

    private getSecondPath(): Phaser.Curves.Path {
        const path = new PathMaker(GAME_WIDTH * 7 / 8, GAME_HEIGHT - 150)
            .to(GAME_WIDTH * 7 / 8,500)
            .to(1140, 500)
            .left(400)
            .up(225)
            .left(500)
            .down(500)
            .create(this)
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
        return LevelNames.Story_InitialBreakthrough; // Next scene is the story for Initial Breakthrough
    }
}
