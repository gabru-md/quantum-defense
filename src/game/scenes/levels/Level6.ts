import {Level} from '../lib/Level.ts';
import {LevelNames} from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import {PathMaker} from "../lib/PathMaker.ts";
import {GAME_HEIGHT, GAME_WIDTH} from "../../scripts/Util.ts";
import {AppColors, phaserColor} from "../../scripts/Colors.ts";

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
            .to(GAME_WIDTH * 7 / 8, 500)
            .to(1140, 500)
            .left(400)
            .up(225)
            .left(500)
            .down(500)
            .create(this)
        return path;
    }

    getLevelSpecificElements(): Phaser.GameObjects.GameObject[] {
        const riftElements = this.glitchManager.drawRiftElements(950, 850, 3, Phaser.Math.FloatBetween(0.5, 0.87), phaserColor(AppColors.PLAYER), phaserColor(AppColors.SPECIAL_ENEMY), Phaser.Math.FloatBetween(0, Math.PI * 2));
        this.glitchManager.animateRiftIdle(riftElements);
        this.rifts.push(riftElements);

        const riftElements2 = this.glitchManager.drawRiftElements(375, 150, 1.25, Phaser.Math.FloatBetween(0.3, 0.5), phaserColor(AppColors.PLAYER), phaserColor(AppColors.SPECIAL_ENEMY), Phaser.Math.FloatBetween(0, Math.PI * 2));
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
                        count: 12,
                        delay: 1400,
                        health: 140,
                        speed: 65,
                        energyValue: 15,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 5,
                        delay: 1800,
                        health: 105,
                        speed: 80,
                        energyValue: 18,
                        path: 'second'
                    },
                ];
            case 2:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 18,
                        delay: 1100,
                        health: 150,
                        speed: 70,
                        energyValue: 18,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 8,
                        delay: 1600,
                        health: 115,
                        speed: 85,
                        energyValue: 20,
                        path: 'second'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy3',
                        count: 3,
                        delay: 2500,
                        health: 210,
                        speed: 55,
                        energyValue: 25,
                        path: 'first'
                    },
                ];
            case 3:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 15,
                        delay: 900,
                        health: 160,
                        speed: 75,
                        energyValue: 18,
                        path: 'second'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 10,
                        delay: 1400,
                        health: 125,
                        speed: 90,
                        energyValue: 22,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy3',
                        count: 5,
                        delay: 2200,
                        health: 230,
                        speed: 60,
                        energyValue: 28,
                        path: 'second'
                    },
                ];
            case 4:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 20,
                        delay: 800,
                        health: 170,
                        speed: 80,
                        energyValue: 20,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 12,
                        delay: 1200,
                        health: 135,
                        speed: 95,
                        energyValue: 25,
                        path: 'second'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy3',
                        count: 7,
                        delay: 2000,
                        health: 250,
                        speed: 65,
                        energyValue: 30,
                        path: 'first'
                    },
                    {
                        type: 'specialEnemy',
                        texture: 'phantom',
                        count: 1,
                        delay: 3000,
                        health: 650,
                        speed: 42,
                        energyValue: 65,
                        path: 'second'
                    },
                ];
            case 5:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 18,
                        delay: 700,
                        health: 180,
                        speed: 85,
                        energyValue: 20,
                        path: 'second'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 15,
                        delay: 1100,
                        health: 145,
                        speed: 100,
                        energyValue: 28,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy3',
                        count: 8,
                        delay: 1800,
                        health: 270,
                        speed: 70,
                        energyValue: 35,
                        path: 'second'
                    },
                    {
                        type: 'specialEnemy',
                        texture: 'phantom',
                        count: 1,
                        delay: 3200,
                        health: 700,
                        speed: 45,
                        energyValue: 70,
                        path: 'first'
                    },
                ];
            case 6:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 22,
                        delay: 600,
                        health: 190,
                        speed: 90,
                        energyValue: 22,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 18,
                        delay: 1000,
                        health: 155,
                        speed: 105,
                        energyValue: 30,
                        path: 'second'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy3',
                        count: 10,
                        delay: 1600,
                        health: 290,
                        speed: 75,
                        energyValue: 40,
                        path: 'first'
                    },
                    {
                        type: 'specialEnemy',
                        texture: 'phantom',
                        count: 2,
                        delay: 2800,
                        health: 750,
                        speed: 48,
                        energyValue: 75,
                        path: 'second'
                    },
                ];
            case 7:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 25,
                        delay: 550,
                        health: 200,
                        speed: 95,
                        energyValue: 22,
                        path: 'second'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 20,
                        delay: 900,
                        health: 165,
                        speed: 110,
                        energyValue: 32,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy3',
                        count: 12,
                        delay: 1400,
                        health: 310,
                        speed: 80,
                        energyValue: 45,
                        path: 'second'
                    },
                    {
                        type: 'specialEnemy',
                        texture: 'phantom',
                        count: 2,
                        delay: 3000,
                        health: 800,
                        speed: 50,
                        energyValue: 80,
                        path: 'first'
                    },
                ];
            case 8:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 20,
                        delay: 500,
                        health: 210,
                        speed: 100,
                        energyValue: 25,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 22,
                        delay: 800,
                        health: 175,
                        speed: 115,
                        energyValue: 35,
                        path: 'second'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy3',
                        count: 15,
                        delay: 1200,
                        health: 330,
                        speed: 85,
                        energyValue: 50,
                        path: 'first'
                    },
                    {
                        type: 'specialEnemy',
                        texture: 'phantom',
                        count: 3,
                        delay: 2800,
                        health: 850,
                        speed: 52,
                        energyValue: 85,
                        path: 'second'
                    },
                ];
            case 9:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 25,
                        delay: 450,
                        health: 220,
                        speed: 105,
                        energyValue: 28,
                        path: 'second'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 25,
                        delay: 700,
                        health: 185,
                        speed: 120,
                        energyValue: 38,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy3',
                        count: 18,
                        delay: 1000,
                        health: 360,
                        speed: 90,
                        energyValue: 55,
                        path: 'second'
                    },
                    {
                        type: 'specialEnemy',
                        texture: 'phantom',
                        count: 3,
                        delay: 2500,
                        health: 900,
                        speed: 55,
                        energyValue: 90,
                        path: 'first'
                    },
                ];
            case 10:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 30,
                        delay: 350,
                        health: 230,
                        speed: 110,
                        energyValue: 30,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 28,
                        delay: 600,
                        health: 195,
                        speed: 125,
                        energyValue: 40,
                        path: 'second'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy3',
                        count: 20,
                        delay: 800,
                        health: 380,
                        speed: 95,
                        energyValue: 60,
                        path: 'first'
                    },
                    {
                        type: 'specialEnemy',
                        texture: 'phantom',
                        count: 4,
                        delay: 2200,
                        health: 950,
                        speed: 58,
                        energyValue: 95,
                        path: 'second'
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
