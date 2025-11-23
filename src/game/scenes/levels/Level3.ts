import {Level} from '../lib/Level.ts';
import {LevelNames} from '../lib/LevelNames.ts';
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
        return {first: path};
    }

    create() {
        super.create();
        this.createRift(GAME_WIDTH / 2 + 200, GAME_HEIGHT / 2, 'dormant');
        this.createMiniRift(150, GAME_HEIGHT / 2 + 225, 'dormant');
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
                    { type: 'enemy', texture: 'enemy1', count: 15, delay: 1500, health: 110, speed: 55, energyValue: 12, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 5, delay: 2000, health: 80, speed: 80, energyValue: 18, path: 'first' },
                ];
            case 2:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 20, delay: 1200, health: 110, speed: 55, energyValue: 12, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 10, delay: 1800, health: 80, speed: 80, energyValue: 18, path: 'first' },
                ];
            case 3:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 25, delay: 1000, health: 120, speed: 60, energyValue: 15, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 15, delay: 1500, health: 90, speed: 85, energyValue: 20, path: 'first' },
                ];
            case 4:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 30, delay: 800, health: 120, speed: 60, energyValue: 15, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 20, delay: 1200, health: 90, speed: 85, energyValue: 20, path: 'first' },
                ];
            case 5:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 35, delay: 600, health: 130, speed: 65, energyValue: 18, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 25, delay: 1000, health: 100, speed: 90, energyValue: 22, path: 'first' },
                ];
            default:
                return [];
        }
    }

    nextScene(): LevelNames { // Changed return type to LevelNames
        return LevelNames.Gameplay_ExpandingFront_4; // Next scene is the story for The Phantom's Arrival
    }
}
