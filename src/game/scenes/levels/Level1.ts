import * as Phaser from 'phaser';
import {Level} from '../lib/Level.ts';
import {GAME_HEIGHT, GAME_WIDTH} from '../../scripts/Util.ts';
import {LevelNames} from '../lib/LevelNames.ts';
import {PathMaker} from "../lib/PathMaker.ts";

export class Gameplay_TheGlitchAnnihilation extends Level { // Renamed class
    constructor() {
        super(LevelNames.Gameplay_TheGlitchAnnihilation); // Updated super call
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        const path = new PathMaker(50, 250)
            .right(400)
            .down(550)
            .right(550)
            .up(550)
            .create(this);
        return {first: path};
    }

    create() {
        super.create();
        this.createRift(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'dormant');
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
                return [{ type: 'enemy', texture: 'enemy1', count: 5, delay: 2000, health: 100, speed: 50, energyValue: 10, path: 'first' }];
            case 2:
                return [{ type: 'enemy', texture: 'enemy1', count: 8, delay: 1800, health: 100, speed: 50, energyValue: 10, path: 'first' }];
            case 3:
                return [{ type: 'enemy', texture: 'enemy1', count: 12, delay: 1500, health: 100, speed: 50, energyValue: 10, path: 'first' }];
            case 4:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 10, delay: 1500, health: 100, speed: 50, energyValue: 10, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 3, delay: 2500, health: 70, speed: 75, energyValue: 15, path: 'first' },
                ];
            case 5:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 15, delay: 1200, health: 100, speed: 50, energyValue: 10, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 5, delay: 2000, health: 70, speed: 75, energyValue: 15, path: 'first' },
                ];
            default:
                return [];
        }
    }

    nextScene(): LevelNames { // Changed return type to LevelNames
        return LevelNames.Story_TheDormantScars; // Next scene is the story for Hello Genie
    }
}
