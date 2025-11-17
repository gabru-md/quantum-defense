import {Level} from '../lib/Level.ts';
import {LevelNames} from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import {PathMaker} from "../lib/PathMaker.ts";
import {GAME_WIDTH} from "../../scripts/Util.ts";
import {AppColors, phaserColor} from "../../scripts/Colors.ts";

export class Gameplay_VolatileFrontierPart2 extends Level { // Renamed class
    constructor() {
        super(LevelNames.Gameplay_VolatileFrontierPart2); // Updated super call
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        const path = new PathMaker(GAME_WIDTH * 5 / 8, 100)
            .down(600)
            .right(200)
            .down(150)
            .left(775)
            .up(500)
            .create(this);
        return {first: path};
    }

    getLevelSpecificElements(): Phaser.GameObjects.GameObject[] {
        const riftElements = this.glitchManager.drawRiftElements(1250, 350, 3, Phaser.Math.FloatBetween(0.5, 0.87), phaserColor(AppColors.PLAYER), phaserColor(AppColors.SPECIAL_ENEMY), Phaser.Math.FloatBetween(0, Math.PI * 2));
        this.glitchManager.animateRiftIdle(riftElements);
        this.rifts.push(riftElements);

        const riftElements2 = this.glitchManager.drawRiftElements(625, 550, 1.25, Phaser.Math.FloatBetween(0.3, 0.5), phaserColor(AppColors.PLAYER), phaserColor(AppColors.SPECIAL_ENEMY), Phaser.Math.FloatBetween(0, Math.PI * 2));
        this.glitchManager.animateRiftIdle(riftElements2);
        this.rifts.push(riftElements2);

        return [
            riftElements.core,
            riftElements.innerGlow,
            riftElements.outerGlow,
            ...riftElements.rays,
            ...riftElements.fragments,
            riftElements2.core,
            riftElements2.innerGlow,
            riftElements2.outerGlow,
            ...riftElements2.rays,
            ...riftElements2.fragments
        ];
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
                    { type: 'enemy', texture: 'enemy1', count: 20, delay: 1100, health: 170, speed: 80, energyValue: 18, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 8, delay: 1700, health: 130, speed: 95, energyValue: 22, path: 'first' },
                ];
            case 2:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 25, delay: 850, health: 180, speed: 85, energyValue: 20, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 10, delay: 1500, health: 140, speed: 100, energyValue: 25, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 5, delay: 2300, health: 240, speed: 65, energyValue: 30, path: 'first' },
                ];
            case 3:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 22, delay: 750, health: 190, speed: 90, energyValue: 20, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 12, delay: 1300, health: 150, speed: 105, energyValue: 28, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 7, delay: 2100, health: 260, speed: 70, energyValue: 35, path: 'first' },
                ];
            case 4:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 28, delay: 650, health: 200, speed: 95, energyValue: 22, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 15, delay: 1100, health: 160, speed: 110, energyValue: 30, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 9, delay: 1900, health: 280, speed: 75, energyValue: 40, path: 'first' },
                    { type: 'specialEnemy', texture: 'phantom', count: 1, delay: 2800, health: 800, speed: 50, energyValue: 80, path: 'first' },
                ];
            case 5:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 25, delay: 550, health: 210, speed: 100, energyValue: 22, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 18, delay: 1000, health: 170, speed: 115, energyValue: 32, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 11, delay: 1700, health: 300, speed: 80, energyValue: 45, path: 'first' },
                    { type: 'specialEnemy', texture: 'phantom', count: 2, delay: 3000, health: 850, speed: 52, energyValue: 85, path: 'first' },
                ];
            case 6:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 30, delay: 500, health: 220, speed: 105, energyValue: 25, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 20, delay: 900, health: 180, speed: 120, energyValue: 35, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 13, delay: 1500, health: 320, speed: 85, energyValue: 50, path: 'first' },
                    { type: 'specialEnemy', texture: 'phantom', count: 2, delay: 2800, health: 900, speed: 55, energyValue: 90, path: 'first' },
                ];
            case 7:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 28, delay: 450, health: 230, speed: 110, energyValue: 25, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 22, delay: 800, health: 190, speed: 125, energyValue: 38, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 16, delay: 1300, health: 340, speed: 90, energyValue: 55, path: 'first' },
                    { type: 'specialEnemy', texture: 'phantom', count: 3, delay: 2600, health: 950, speed: 58, energyValue: 95, path: 'first' },
                ];
            case 8:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 32, delay: 400, health: 240, speed: 115, energyValue: 28, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 25, delay: 700, health: 200, speed: 130, energyValue: 40, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 18, delay: 1100, health: 360, speed: 95, energyValue: 60, path: 'first' },
                    { type: 'specialEnemy', texture: 'phantom', count: 3, delay: 2400, health: 1000, speed: 60, energyValue: 100, path: 'first' },
                ];
            case 9:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 35, delay: 350, health: 250, speed: 120, energyValue: 28, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 28, delay: 600, health: 210, speed: 135, energyValue: 42, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 20, delay: 900, health: 380, speed: 100, energyValue: 65, path: 'first' },
                    { type: 'specialEnemy', texture: 'phantom', count: 4, delay: 2200, health: 1050, speed: 62, energyValue: 105, path: 'first' },
                ];
            case 10:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 40, delay: 300, health: 260, speed: 125, energyValue: 30, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 30, delay: 500, health: 220, speed: 140, energyValue: 45, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 22, delay: 700, health: 400, speed: 105, energyValue: 70, path: 'first' },
                    { type: 'specialEnemy', texture: 'phantom', count: 4, delay: 2000, health: 1100, speed: 65, energyValue: 110, path: 'first' },
                ];
            default:
                return [];
        }
    }

    nextScene(): LevelNames { // Changed return type to LevelNames
        return LevelNames.Story_StaticNewGlitches; // Next scene is the story for Static's New Glitches
    }
}
