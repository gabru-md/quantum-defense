import {Level} from '../lib/Level.ts';
import {LevelNames} from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import {PathMaker} from "../lib/PathMaker.ts";
import {GAME_WIDTH} from "../../scripts/Util.ts";

export class Gameplay_TheResonanceWave extends Level { // Renamed class
    constructor() {
        super(LevelNames.Gameplay_TheResonanceWave); // Updated super call
    }

    private firstPath(): Phaser.Curves.Path {
        const path = new PathMaker(GAME_WIDTH * 3 / 8, 100)
            .down(250)
            .right(700)
            .down(250)
            .left(1100)
            .down(150)
            .right(550)
            .down(175)
            .right(600)
            .create(this);
        return path;
    }

    private secondPath(): Phaser.Curves.Path {
        const path = new PathMaker(170, 100)
            .down(250)
            .right(400)
            .right(700)
            .down(250)
            .left(1100)
            .down(150)
            .right(550)
            .down(175)
            .right(600)
            .create(this);
        return path;
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        return {first: this.firstPath(), second: this.secondPath()};
    }

    create() {
        super.create();
        this.createRift(1080, 775, 'gradient');
        this.createRift(350, 875, 'static');
        this.createRift(1100, 150, 'player');
        this.createMiniRift(365, 265, 'dormant');
        this.createMiniRift(720, 520, 'dormant');
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
                    { type: 'enemy', texture: 'enemy1', count: 30, delay: 900, health: 280, speed: 135, energyValue: 35, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 15, delay: 1500, health: 230, speed: 150, energyValue: 50, path: 'second' },
                    { type: 'enemy', texture: 'enemy3', count: 8, delay: 2000, health: 450, speed: 115, energyValue: 80, path: 'first' },
                ];
            case 2:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 35, delay: 750, health: 290, speed: 140, energyValue: 38, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 18, delay: 1300, health: 240, speed: 155, energyValue: 52, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 10, delay: 1800, health: 470, speed: 120, energyValue: 85, path: 'second' },
                    { type: 'specialEnemy', texture: 'phantom', count: 2, delay: 2800, health: 1300, speed: 75, energyValue: 130, path: 'first' },
                ];
            case 3:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 32, delay: 650, health: 300, speed: 145, energyValue: 38, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 20, delay: 1100, health: 250, speed: 160, energyValue: 55, path: 'second' },
                    { type: 'enemy', texture: 'enemy3', count: 12, delay: 1600, health: 490, speed: 125, energyValue: 90, path: 'first' },
                    { type: 'specialEnemy', texture: 'phantom', count: 3, delay: 2600, health: 1350, speed: 78, energyValue: 135, path: 'second' },
                ];
            case 4:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 38, delay: 550, health: 310, speed: 150, energyValue: 40, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 22, delay: 900, health: 260, speed: 165, energyValue: 58, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 15, delay: 1400, health: 510, speed: 130, energyValue: 95, path: 'second' },
                    { type: 'specialEnemy', texture: 'phantom', count: 3, delay: 2400, health: 1400, speed: 80, energyValue: 140, path: 'first' },
                ];
            case 5:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 35, delay: 450, health: 320, speed: 155, energyValue: 40, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 25, delay: 800, health: 270, speed: 170, energyValue: 60, path: 'second' },
                    { type: 'enemy', texture: 'enemy3', count: 18, delay: 1200, health: 530, speed: 135, energyValue: 100, path: 'first' },
                    { type: 'specialEnemy', texture: 'phantom', count: 4, delay: 2200, health: 1450, speed: 82, energyValue: 145, path: 'second' },
                ];
            case 6:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 40, delay: 350, health: 330, speed: 160, energyValue: 42, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 28, delay: 700, health: 280, speed: 175, energyValue: 62, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 20, delay: 1000, health: 550, speed: 140, energyValue: 105, path: 'second' },
                    { type: 'specialEnemy', texture: 'phantom', count: 4, delay: 2000, health: 1500, speed: 85, energyValue: 150, path: 'first' },
                ];
            case 7:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 38, delay: 300, health: 340, speed: 165, energyValue: 42, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 30, delay: 600, health: 290, speed: 180, energyValue: 65, path: 'second' },
                    { type: 'enemy', texture: 'enemy3', count: 22, delay: 800, health: 570, speed: 145, energyValue: 110, path: 'first' },
                    { type: 'specialEnemy', texture: 'phantom', count: 5, delay: 1800, health: 1550, speed: 88, energyValue: 155, path: 'second' },
                ];
            case 8:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 45, delay: 250, health: 350, speed: 170, energyValue: 45, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 32, delay: 500, health: 300, speed: 185, energyValue: 68, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 25, delay: 600, health: 590, speed: 150, energyValue: 115, path: 'second' },
                    { type: 'specialEnemy', texture: 'phantom', count: 5, delay: 1600, health: 1600, speed: 90, energyValue: 160, path: 'first' },
                ];
            case 9:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 42, delay: 200, health: 360, speed: 175, energyValue: 45, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 35, delay: 400, health: 310, speed: 190, energyValue: 70, path: 'second' },
                    { type: 'enemy', texture: 'enemy3', count: 28, delay: 500, health: 610, speed: 155, energyValue: 120, path: 'first' },
                    { type: 'specialEnemy', texture: 'phantom', count: 6, delay: 1400, health: 1650, speed: 92, energyValue: 165, path: 'second' },
                ];
            case 10:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 50, delay: 150, health: 370, speed: 180, energyValue: 50, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 40, delay: 300, health: 320, speed: 195, energyValue: 75, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 30, delay: 400, health: 630, speed: 160, energyValue: 125, path: 'second' },
                    { type: 'specialEnemy', texture: 'phantom', count: 7, delay: 1200, health: 1700, speed: 95, energyValue: 170, path: 'first' },
                ];
            default:
                return [];
        }
    }

    nextScene(): LevelNames { // Changed return type to LevelNames
        return LevelNames.MainMenu; // Next scene is the MainMenu after the final level
    }
}
