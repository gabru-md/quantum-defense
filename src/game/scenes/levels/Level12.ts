import {Level} from '../lib/Level.ts';
import {LevelNames} from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import {PathMaker} from "../lib/PathMaker.ts";
import {GAME_WIDTH} from "../../scripts/Util.ts";

export class Gameplay_EchoesOfAncientLore extends Level { // Renamed class
    constructor() {
        super(LevelNames.Gameplay_EchoesOfAncientLore); // Updated super call
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
                    { type: 'enemy', texture: 'enemy1', count: 15, delay: 1200, health: 200, speed: 95, energyValue: 22, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 8, delay: 1800, health: 160, speed: 110, energyValue: 30, path: 'second' },
                ];
            case 2:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 20, delay: 900, health: 210, speed: 100, energyValue: 25, path: 'third' },
                    { type: 'enemy', texture: 'enemy2', count: 10, delay: 1600, health: 170, speed: 115, energyValue: 32, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 5, delay: 2500, health: 300, speed: 80, energyValue: 45, path: 'second' },
                ];
            case 3:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 18, delay: 800, health: 220, speed: 105, energyValue: 25, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 12, delay: 1400, health: 180, speed: 120, energyValue: 35, path: 'third' },
                    { type: 'enemy', texture: 'enemy3', count: 7, delay: 2200, health: 320, speed: 85, energyValue: 50, path: 'second' },
                ];
            case 4:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 22, delay: 700, health: 230, speed: 110, energyValue: 28, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 15, delay: 1200, health: 190, speed: 125, energyValue: 38, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 9, delay: 2000, health: 340, speed: 90, energyValue: 55, path: 'third' },
                    { type: 'specialEnemy', texture: 'phantom', count: 1, delay: 3000, health: 950, speed: 58, energyValue: 95, path: 'second' },
                ];
            case 5:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 20, delay: 600, health: 240, speed: 115, energyValue: 28, path: 'third' },
                    { type: 'enemy', texture: 'enemy2', count: 18, delay: 1100, health: 200, speed: 130, energyValue: 40, path: 'second' },
                    { type: 'enemy', texture: 'enemy3', count: 11, delay: 1800, health: 360, speed: 95, energyValue: 60, path: 'first' },
                    { type: 'specialEnemy', texture: 'phantom', count: 2, delay: 3200, health: 1000, speed: 60, energyValue: 100, path: 'third' },
                ];
            case 6:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 25, delay: 550, health: 250, speed: 120, energyValue: 30, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 20, delay: 1000, health: 210, speed: 135, energyValue: 42, path: 'third' },
                    { type: 'enemy', texture: 'enemy3', count: 13, delay: 1600, health: 380, speed: 100, energyValue: 65, path: 'second' },
                    { type: 'specialEnemy', texture: 'phantom', count: 2, delay: 2800, health: 1050, speed: 62, energyValue: 105, path: 'first' },
                ];
            case 7:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 22, delay: 500, health: 260, speed: 125, energyValue: 30, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 22, delay: 900, health: 220, speed: 140, energyValue: 45, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 16, delay: 1400, health: 400, speed: 105, energyValue: 70, path: 'third' },
                    { type: 'specialEnemy', texture: 'phantom', count: 3, delay: 2600, health: 1100, speed: 65, energyValue: 110, path: 'second' },
                ];
            case 8:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 28, delay: 450, health: 270, speed: 130, energyValue: 32, path: 'third' },
                    { type: 'enemy', texture: 'enemy2', count: 25, delay: 800, health: 230, speed: 145, energyValue: 48, path: 'second' },
                    { type: 'enemy', texture: 'enemy3', count: 18, delay: 1200, health: 420, speed: 110, energyValue: 75, path: 'first' },
                    { type: 'specialEnemy', texture: 'phantom', count: 3, delay: 2400, health: 1150, speed: 68, energyValue: 115, path: 'third' },
                ];
            case 9:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 25, delay: 400, health: 280, speed: 135, energyValue: 32, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 28, delay: 700, health: 240, speed: 150, energyValue: 50, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 20, delay: 1000, health: 440, speed: 115, energyValue: 80, path: 'second' },
                    { type: 'specialEnemy', texture: 'phantom', count: 4, delay: 2200, health: 1200, speed: 70, energyValue: 120, path: 'first' },
                ];
            case 10:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 30, delay: 350, health: 290, speed: 140, energyValue: 35, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 30, delay: 600, health: 250, speed: 155, energyValue: 52, path: 'third' },
                    { type: 'enemy', texture: 'enemy3', count: 22, delay: 800, health: 460, speed: 120, energyValue: 85, path: 'first' },
                    { type: 'specialEnemy', texture: 'phantom', count: 4, delay: 2000, health: 1250, speed: 72, energyValue: 125, path: 'second' },
                ];
            default:
                return [];
        }
    }

    nextScene(): LevelNames { // Changed return type to LevelNames
        return LevelNames.Story_DesigningTheBane; // Next scene is the story for Designing The Bane
    }
}
