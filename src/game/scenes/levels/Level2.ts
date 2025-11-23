import {Level} from '../lib/Level.ts';
import {LevelNames} from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import {PathMaker} from "../lib/PathMaker.ts";
import {GAME_HEIGHT, GAME_WIDTH} from "../../scripts/Util.ts";

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
                return [{ type: 'enemy', texture: 'enemy1', count: 10, delay: 1800, health: 100, speed: 50, energyValue: 10, path: 'first' }];
            case 2:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 8, delay: 1500, health: 100, speed: 50, energyValue: 10, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 4, delay: 2200, health: 70, speed: 75, energyValue: 15, path: 'first' },
                ];
            case 3:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 12, delay: 1200, health: 100, speed: 50, energyValue: 10, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 6, delay: 1800, health: 70, speed: 75, energyValue: 15, path: 'first' },
                ];
            case 4:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 15, delay: 1000, health: 110, speed: 55, energyValue: 12, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 8, delay: 1600, health: 80, speed: 80, energyValue: 18, path: 'first' },
                ];
            case 5:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 20, delay: 800, health: 110, speed: 55, energyValue: 12, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 10, delay: 1400, health: 80, speed: 80, energyValue: 18, path: 'first' },
                ];
            default:
                return [];
        }
    }

    nextScene(): LevelNames { // Changed return type to LevelNames
        return LevelNames.Gameplay_TheDormantScars; // Next scene is the story for The Dormant Scars
    }
}
