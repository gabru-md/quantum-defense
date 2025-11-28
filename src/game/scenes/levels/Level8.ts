import {Level} from '../lib/Level.ts';
import {LevelNames} from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import {PathMaker} from "../lib/PathMaker.ts";
import {GAME_HEIGHT} from "../../scripts/Util.ts";

export class Gameplay_BruteForce extends Level {
    constructor() {
        super(LevelNames.Gameplay_BruteForce);
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
        return {first: path};
    }

    create() {
        super.create();
        this.createRift(950, 200, 'gradient'); // Keep gradient rift
        this.createMiniRift(75, GAME_HEIGHT - 50, 'dormant'); // Keep dormant rift
        this.createMiniRift(530, 530, 'dormant'); // Keep dormant rift

        this.populateQuantumEchoes();
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
                    { type: 'enemy', texture: 'enemy1', count: 15, delay: 1200, health: 160, speed: 75, energyValue: 15, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 5, delay: 1800, health: 120, speed: 90, energyValue: 20, path: 'first' },
                ];
            case 2:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 20, delay: 900, health: 170, speed: 80, energyValue: 18, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 8, delay: 1600, health: 130, speed: 95, energyValue: 22, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 3, delay: 2500, health: 230, speed: 60, energyValue: 28, path: 'first' },
                ];
            case 3:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 18, delay: 800, health: 180, speed: 85, energyValue: 18, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 10, delay: 1400, health: 140, speed: 100, energyValue: 25, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 5, delay: 2200, health: 250, speed: 65, energyValue: 30, path: 'first' },
                ];
            case 4:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 25, delay: 700, health: 190, speed: 90, energyValue: 20, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 12, delay: 1200, health: 150, speed: 105, energyValue: 28, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 7, delay: 2000, health: 270, speed: 70, energyValue: 35, path: 'first' },
                ];
            case 5:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 22, delay: 600, health: 200, speed: 95, energyValue: 20, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 15, delay: 1100, health: 160, speed: 110, energyValue: 30, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 10, delay: 1800, health: 290, speed: 75, energyValue: 40, path: 'first' },
                ];
            case 6:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 28, delay: 550, health: 210, speed: 100, energyValue: 22, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 18, delay: 1000, health: 170, speed: 115, energyValue: 32, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 12, delay: 1600, health: 310, speed: 80, energyValue: 45, path: 'first' },
                ];
            case 7:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 25, delay: 500, health: 220, speed: 105, energyValue: 22, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 20, delay: 900, health: 180, speed: 120, energyValue: 35, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 15, delay: 1400, health: 330, speed: 85, energyValue: 50, path: 'first' },
                ];
            case 8:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 30, delay: 450, health: 230, speed: 110, energyValue: 25, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 22, delay: 800, health: 190, speed: 125, energyValue: 38, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 18, delay: 1200, health: 360, speed: 90, energyValue: 55, path: 'first' },
                ];
            case 9:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 28, delay: 400, health: 240, speed: 115, energyValue: 28, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 25, delay: 700, health: 200, speed: 130, energyValue: 40, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 20, delay: 1000, health: 380, speed: 95, energyValue: 60, path: 'first' },
                ];
            case 10:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 35, delay: 350, health: 250, speed: 120, energyValue: 30, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 28, delay: 600, health: 210, speed: 135, energyValue: 42, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 22, delay: 800, health: 400, speed: 100, energyValue: 65, path: 'first' },
                ];
            default:
                return [];
        }
    }

    nextScene(): LevelNames {
        return LevelNames.Story_ThePhantomArrival;
    }
}
