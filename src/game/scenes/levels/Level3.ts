import {Level} from '../lib/Level.ts';
import {LevelNames} from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import {PathMaker} from "../lib/PathMaker.ts";
import {GAME_HEIGHT, GAME_WIDTH} from "../../scripts/Util.ts";
import {AppColors, phaserColor} from "../../scripts/Colors.ts";
import {RiftElements} from "../../effects/GlitchAnnihilationEffect.ts";

export class Gameplay_TheDormantScars extends Level { // Renamed class
    public rifts: RiftElements[] = [];

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

    getLevelSpecificElements(): Phaser.GameObjects.GameObject[] {
        const riftElements = this.glitchManager.drawRiftElements(GAME_WIDTH / 2 + 200, GAME_HEIGHT / 2, 4.25, Phaser.Math.FloatBetween(0.5, 0.87), phaserColor(AppColors.PLAYER), phaserColor(AppColors.SPECIAL_ENEMY), Phaser.Math.FloatBetween(0, Math.PI * 2));
        this.glitchManager.animateRiftIdle(riftElements);
        this.rifts.push(riftElements);

        const riftElements2 = this.glitchManager.drawRiftElements(150, GAME_HEIGHT / 2 + 225, 3.75, Phaser.Math.FloatBetween(0.5, 0.87), phaserColor(AppColors.PLAYER), phaserColor(AppColors.SPECIAL_ENEMY), Phaser.Math.FloatBetween(Math.PI / 2, Math.PI * 2));
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
                return [{
                    type: 'enemy',
                    texture: 'enemy1',
                    count: 15,
                    delay: 1300,
                    health: 110,
                    speed: 55,
                    energyValue: 10,
                    path: 'first'
                }];
            case 2:
                return [{
                    type: 'enemy',
                    texture: 'enemy1',
                    count: 20,
                    delay: 1000,
                    health: 120,
                    speed: 60,
                    energyValue: 10,
                    path: 'first'
                }];
            case 3:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 18,
                        delay: 800,
                        health: 130,
                        speed: 65,
                        energyValue: 12,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 5,
                        delay: 1600,
                        health: 90,
                        speed: 75,
                        energyValue: 15,
                        path: 'first'
                    },
                ];
            case 4:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 22,
                        delay: 700,
                        health: 140,
                        speed: 70,
                        energyValue: 12,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 7,
                        delay: 1400,
                        health: 100,
                        speed: 80,
                        energyValue: 15,
                        path: 'first'
                    },
                ];
            case 5:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 18,
                        delay: 600,
                        health: 150,
                        speed: 75,
                        energyValue: 15,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 10,
                        delay: 1200,
                        health: 110,
                        speed: 85,
                        energyValue: 18,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy3',
                        count: 5,
                        delay: 2000,
                        health: 170,
                        speed: 70,
                        energyValue: 20,
                        path: 'first'
                    },
                ];
            case 6:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 20,
                        delay: 550,
                        health: 160,
                        speed: 80,
                        energyValue: 15,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 12,
                        delay: 1100,
                        health: 120,
                        speed: 90,
                        energyValue: 18,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy3',
                        count: 7,
                        delay: 1800,
                        health: 180,
                        speed: 75,
                        energyValue: 20,
                        path: 'first'
                    },
                ];
            case 7:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 25,
                        delay: 500,
                        health: 170,
                        speed: 85,
                        energyValue: 18,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 15,
                        delay: 1000,
                        health: 130,
                        speed: 95,
                        energyValue: 20,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy3',
                        count: 9,
                        delay: 1600,
                        health: 190,
                        speed: 80,
                        energyValue: 22,
                        path: 'first'
                    },
                ];
            case 8:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 20,
                        delay: 450,
                        health: 180,
                        speed: 90,
                        energyValue: 18,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 18,
                        delay: 900,
                        health: 140,
                        speed: 100,
                        energyValue: 20,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy3',
                        count: 12,
                        delay: 1400,
                        health: 200,
                        speed: 85,
                        energyValue: 25,
                        path: 'first'
                    },
                ];
            case 9:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 25,
                        delay: 400,
                        health: 190,
                        speed: 95,
                        energyValue: 20,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 20,
                        delay: 800,
                        health: 150,
                        speed: 105,
                        energyValue: 22,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy3',
                        count: 15,
                        delay: 1200,
                        health: 210,
                        speed: 90,
                        energyValue: 28,
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
                        health: 200,
                        speed: 100,
                        energyValue: 22,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 25,
                        delay: 700,
                        health: 160,
                        speed: 110,
                        energyValue: 25,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy3',
                        count: 18,
                        delay: 1000,
                        health: 220,
                        speed: 95,
                        energyValue: 30,
                        path: 'first'
                    },
                ];
            default:
                return [];
        }
    }

    nextScene(): LevelNames { // Changed return type to LevelNames
        return LevelNames.Story_ThePhantomArrival; // Next scene is the story for The Phantom's Arrival
    }
}
