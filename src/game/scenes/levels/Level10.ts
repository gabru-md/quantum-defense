import {Level} from '../lib/Level.ts';
import {LevelNames} from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import {PathMaker} from "../lib/PathMaker.ts";
import {GAME_WIDTH} from "../../scripts/Util.ts";

export class Gameplay_StaticNewGlitches extends Level { // Renamed class
    constructor() {
        super(LevelNames.Gameplay_StaticNewGlitches); // Updated super call
    }

    private firstPath(): Phaser.Curves.Path {
        const path = new PathMaker(GAME_WIDTH * 7 / 8, 150)
            .down(800)
            .left(250)
            .up(175)
            .left(175)
            .up(200)
            .left(600)
            .up(350)
            .create(this);
        return path;
    }

    private secondPath(): Phaser.Curves.Path {
        const path = new PathMaker(200, 950)
            .right(530)
            .up(175)
            .right(175)
            .up(200)
            .left(600)
            .up(350)
            .create(this);
        return path;
    }

    create() {
        super.create();
        this.createRift(1080, 350, 'gradient');
        this.createRift(625, 550, 'static');
        this.createRift(500, 775, 'player');
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
                    { type: 'enemy', texture: 'enemy1', count: 20, delay: 1100, health: 180, speed: 85, energyValue: 20, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 8, delay: 1700, health: 140, speed: 100, energyValue: 25, path: 'second' },
                ];
            case 2:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 25, delay: 850, health: 190, speed: 90, energyValue: 22, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 10, delay: 1500, health: 150, speed: 105, energyValue: 28, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 5, delay: 2300, health: 250, speed: 70, energyValue: 35, path: 'second' },
                ];
            case 3:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 22, delay: 750, health: 200, speed: 95, energyValue: 22, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 12, delay: 1300, health: 160, speed: 110, energyValue: 30, path: 'second' },
                    { type: 'enemy', texture: 'enemy3', count: 7, delay: 2100, health: 270, speed: 75, energyValue: 40, path: 'first' },
                ];
            case 4:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 28, delay: 650, health: 210, speed: 100, energyValue: 25, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 15, delay: 1100, health: 170, speed: 115, energyValue: 32, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 9, delay: 1900, health: 290, speed: 80, energyValue: 45, path: 'second' },
                    { type: 'specialEnemy', texture: 'phantom', count: 1, delay: 2800, health: 850, speed: 52, energyValue: 85, path: 'first' },
                ];
            case 5:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 25, delay: 550, health: 220, speed: 105, energyValue: 25, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 18, delay: 1000, health: 180, speed: 120, energyValue: 35, path: 'second' },
                    { type: 'enemy', texture: 'enemy3', count: 11, delay: 1700, health: 310, speed: 85, energyValue: 50, path: 'first' },
                    { type: 'specialEnemy', texture: 'phantom', count: 2, delay: 3000, health: 900, speed: 55, energyValue: 90, path: 'second' },
                ];
            case 6:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 30, delay: 500, health: 230, speed: 110, energyValue: 28, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 20, delay: 900, health: 190, speed: 125, energyValue: 38, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 13, delay: 1500, health: 330, speed: 90, energyValue: 55, path: 'second' },
                    { type: 'specialEnemy', texture: 'phantom', count: 2, delay: 2800, health: 950, speed: 58, energyValue: 95, path: 'first' },
                ];
            case 7:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 28, delay: 450, health: 240, speed: 115, energyValue: 28, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 22, delay: 800, health: 200, speed: 130, energyValue: 40, path: 'second' },
                    { type: 'enemy', texture: 'enemy3', count: 16, delay: 1300, health: 350, speed: 95, energyValue: 60, path: 'first' },
                    { type: 'specialEnemy', texture: 'phantom', count: 3, delay: 2600, health: 1000, speed: 60, energyValue: 100, path: 'second' },
                ];
            case 8:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 32, delay: 400, health: 250, speed: 120, energyValue: 30, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 25, delay: 700, health: 210, speed: 135, energyValue: 42, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 18, delay: 1100, health: 370, speed: 100, energyValue: 65, path: 'second' },
                    { type: 'specialEnemy', texture: 'phantom', count: 3, delay: 2400, health: 1050, speed: 62, energyValue: 105, path: 'first' },
                ];
            case 9:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 35, delay: 350, health: 260, speed: 125, energyValue: 30, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 28, delay: 600, health: 220, speed: 140, energyValue: 45, path: 'second' },
                    { type: 'enemy', texture: 'enemy3', count: 20, delay: 900, health: 390, speed: 105, energyValue: 70, path: 'first' },
                    { type: 'specialEnemy', texture: 'phantom', count: 4, delay: 2200, health: 1100, speed: 65, energyValue: 110, path: 'second' },
                ];
            case 10:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 40, delay: 300, health: 270, speed: 130, energyValue: 32, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 30, delay: 500, health: 230, speed: 145, energyValue: 48, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 22, delay: 700, health: 410, speed: 110, energyValue: 75, path: 'second' },
                    { type: 'specialEnemy', texture: 'phantom', count: 4, delay: 2000, health: 1150, speed: 68, energyValue: 115, path: 'first' },
                ];
            default:
                return [];
        }
    }

    nextScene(): LevelNames { // Changed return type to LevelNames
        return LevelNames.Story_AdvancedCountermeasures; // Next scene is the story for Advanced Countermeasures
    }
}
