import * as Phaser from 'phaser';
import {Level} from '../lib/Level.ts';
import {GAME_HEIGHT, GAME_WIDTH} from '../../scripts/Util.ts';
import {LevelNames} from '../lib/LevelNames.ts';
import {GlitchAnnihilationEffect} from "../../effects/GlitchAnnihilationEffect.ts";
import {AppColors, phaserColor} from "../../scripts/Colors.ts";
import {PathMaker} from "../lib/PathMaker.ts";

export class Gameplay_TheGlitchAnnihilation extends Level { // Renamed class
    constructor() {
        super(LevelNames.Gameplay_TheGlitchAnnihilation); // Updated super call
    }

    init() {
        super.init();
        this.glitchManager = new GlitchAnnihilationEffect(this);
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

    getLevelSpecificElements(): Phaser.GameObjects.GameObject[] {
        const riftElements = this.glitchManager.drawRiftElements(GAME_WIDTH / 2, GAME_HEIGHT / 2, 3, Phaser.Math.FloatBetween(0.5, 0.87), phaserColor(AppColors.PLAYER), phaserColor(AppColors.SPECIAL_ENEMY), Phaser.Math.FloatBetween(0, Math.PI * 2));
        this.glitchManager.animateRiftIdle(riftElements);
        this.rifts.push(riftElements);

        return [
            riftElements.core,
            riftElements.innerGlow,
            riftElements.outerGlow,
            ...riftElements.rays,
            ...riftElements.fragments
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
                return [{ type: 'enemy', texture: 'enemy1', count: 10, delay: 1500, health: 100, speed: 50, energyValue: 10, path: 'first' }];
            case 2:
                return [{ type: 'enemy', texture: 'enemy1', count: 15, delay: 1200, health: 110, speed: 55, energyValue: 10, path: 'first' }];
            case 3:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 12, delay: 1000, health: 120, speed: 60, energyValue: 12, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 3, delay: 2000, health: 80, speed: 70, energyValue: 15, path: 'first' },
                ];
            case 4:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 15, delay: 900, health: 130, speed: 65, energyValue: 12, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 5, delay: 1800, health: 90, speed: 75, energyValue: 15, path: 'first' },
                ];
            case 5:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 10, delay: 800, health: 140, speed: 70, energyValue: 15, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 7, delay: 1500, health: 100, speed: 80, energyValue: 18, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 3, delay: 2500, health: 150, speed: 60, energyValue: 20, path: 'first' }, // Introduce enemy3
                ];
            case 6:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 12, delay: 750, health: 150, speed: 75, energyValue: 15, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 8, delay: 1400, health: 110, speed: 85, energyValue: 18, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 5, delay: 2200, health: 160, speed: 65, energyValue: 20, path: 'first' },
                ];
            case 7:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 15, delay: 700, health: 160, speed: 80, energyValue: 18, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 10, delay: 1300, health: 120, speed: 90, energyValue: 20, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 7, delay: 2000, health: 170, speed: 70, energyValue: 22, path: 'first' },
                ];
            case 8:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 10, delay: 650, health: 170, speed: 85, energyValue: 18, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 12, delay: 1200, health: 130, speed: 95, energyValue: 20, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 8, delay: 1800, health: 180, speed: 75, energyValue: 25, path: 'first' },
                ];
            case 9:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 15, delay: 600, health: 180, speed: 90, energyValue: 20, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 15, delay: 1100, health: 140, speed: 100, energyValue: 22, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 10, delay: 1600, health: 190, speed: 80, energyValue: 28, path: 'first' },
                ];
            case 10:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 20, delay: 500, health: 200, speed: 95, energyValue: 22, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 18, delay: 1000, health: 150, speed: 105, energyValue: 25, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 12, delay: 1400, health: 200, speed: 85, energyValue: 30, path: 'first' },
                ];
            default:
                return [];
        }
    }

    nextScene(): LevelNames { // Changed return type to LevelNames
        return LevelNames.Story_HelloGenie; // Next scene is the story for Hello Genie
    }
}
