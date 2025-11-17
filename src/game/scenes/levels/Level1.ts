import * as Phaser from 'phaser';
import {Level} from '../lib/Level.ts';
import {GAME_HEIGHT, GAME_WIDTH} from '../../scripts/Util.ts';
import {LevelNames} from '../lib/LevelNames.ts';
import {GlitchAnnihilationEffect, RiftElements} from "../../effects/GlitchAnnihilationEffect.ts";
import {AppColors, phaserColor} from "../../scripts/Colors.ts";
import {PathMaker} from "../lib/PathMaker.ts";

export class Gameplay_TheGlitchAnnihilation extends Level { // Renamed class
    private glitchManager: GlitchAnnihilationEffect;
    public rifts: RiftElements[] = [];

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

    isPositionBuildable(x: number, y: number): { buildable: boolean; reason?: string } {
        for (const rift of this.rifts) {
            const distance = Phaser.Math.Distance.Between(x, y, rift.centerX, rift.centerY);
            if (distance < 100 * rift.scaleFactor) {
                return {buildable: false, reason: 'Too close to a rift!'};
            }
        }
        return {buildable: true};
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
                        count: 10,
                        delay: 1500,
                        health: 100,
                        speed: 50,
                        energyValue: 10,
                        path: 'first',
                    },
                ];
            case 2:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 15,
                        delay: 1200,
                        health: 100,
                        speed: 55,
                        energyValue: 10,
                        path: 'first',
                    },
                ];
            case 3:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 10,
                        delay: 1000,
                        health: 110,
                        speed: 60,
                        energyValue: 12,
                        path: 'first',
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 5,
                        delay: 2000,
                        health: 75,
                        speed: 80,
                        energyValue: 15,
                        path: 'first',
                    },
                ];
            default:
                return [];
        }
    }

    nextScene(): LevelNames { // Changed return type to LevelNames
        return LevelNames.Story_HelloGenie; // Next scene is the story for Hello Genie
    }
}
