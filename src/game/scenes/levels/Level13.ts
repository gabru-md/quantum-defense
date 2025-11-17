import {Level} from '../lib/Level.ts';
import {LevelNames} from '../lib/LevelNames.ts';
import {PathMaker} from "../lib/PathMaker.ts";
import {GAME_HEIGHT, GAME_WIDTH} from "../../scripts/Util.ts";
import Phaser from "phaser";
import {AppColors, phaserColor} from "../../scripts/Colors.ts";

export class Gameplay_DesigningTheBane extends Level { // Renamed class
    constructor() {
        super(LevelNames.Gameplay_DesigningTheBane); // Updated super call
    }

    private firstPath(): Phaser.Curves.Path {
        const path = new PathMaker(GAME_WIDTH/2, GAME_HEIGHT/2)
            .right(550)
            .up(400)
            .left(1200)
            .reverse()
            .create(this);
        return path;
    }

    private secondPath(): Phaser.Curves.Path {
        const path = new PathMaker(GAME_WIDTH/2, GAME_HEIGHT/2)
            .right(400)
            .down(400)
            .left(800)
            .up(200)
            .left(300)
            .reverse()
            .create(this);
        return path;
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        return {
            first: this.firstPath(),
            second: this.secondPath()
        };
    }

    protected getLevelSpecificElements() {
        const riftElements = this.glitchManager.drawRiftElements(600, 675, 2.85, Phaser.Math.FloatBetween(0.3, 0.7), phaserColor(AppColors.PLAYER), phaserColor(AppColors.SPECIAL_ENEMY), Phaser.Math.FloatBetween(0, Math.PI * 2));
        this.glitchManager.animateRiftIdle(riftElements);
        this.rifts.push(riftElements);

        const riftElements2 = this.glitchManager.drawRiftElements(1050, 350, 1.5, Phaser.Math.FloatBetween(0.3, 0.5), phaserColor(AppColors.PLAYER), phaserColor(AppColors.SPECIAL_ENEMY), Phaser.Math.FloatBetween(0, Math.PI * 2));
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
        ]
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
                    { type: 'enemy', texture: 'enemy1', count: 20, delay: 1100, health: 220, speed: 105, energyValue: 25, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 10, delay: 1700, health: 180, speed: 120, energyValue: 35, path: 'second' },
                ];
            case 2:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 25, delay: 850, health: 230, speed: 110, energyValue: 28, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 12, delay: 1500, health: 190, speed: 125, energyValue: 38, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 6, delay: 2300, health: 350, speed: 90, energyValue: 55, path: 'second' },
                ];
            case 3:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 22, delay: 750, health: 240, speed: 115, energyValue: 28, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 15, delay: 1300, health: 200, speed: 130, energyValue: 40, path: 'second' },
                    { type: 'enemy', texture: 'enemy3', count: 8, delay: 2100, health: 370, speed: 95, energyValue: 60, path: 'first' },
                ];
            case 4:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 28, delay: 650, health: 250, speed: 120, energyValue: 30, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 18, delay: 1100, health: 210, speed: 135, energyValue: 42, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 10, delay: 1900, health: 390, speed: 100, energyValue: 65, path: 'second' },
                    { type: 'specialEnemy', texture: 'phantom', count: 2, delay: 2800, health: 1050, speed: 62, energyValue: 105, path: 'first' },
                ];
            case 5:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 25, delay: 550, health: 260, speed: 125, energyValue: 30, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 20, delay: 1000, health: 220, speed: 140, energyValue: 45, path: 'second' },
                    { type: 'enemy', texture: 'enemy3', count: 12, delay: 1700, health: 410, speed: 105, energyValue: 70, path: 'first' },
                    { type: 'specialEnemy', texture: 'phantom', count: 3, delay: 3000, health: 1100, speed: 65, energyValue: 110, path: 'second' },
                ];
            case 6:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 30, delay: 500, health: 270, speed: 130, energyValue: 32, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 22, delay: 900, health: 230, speed: 145, energyValue: 48, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 15, delay: 1500, health: 430, speed: 110, energyValue: 75, path: 'second' },
                    { type: 'specialEnemy', texture: 'phantom', count: 3, delay: 2800, health: 1150, speed: 68, energyValue: 115, path: 'first' },
                ];
            case 7:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 28, delay: 450, health: 280, speed: 135, energyValue: 32, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 25, delay: 800, health: 240, speed: 150, energyValue: 50, path: 'second' },
                    { type: 'enemy', texture: 'enemy3', count: 18, delay: 1300, health: 450, speed: 115, energyValue: 80, path: 'first' },
                    { type: 'specialEnemy', texture: 'phantom', count: 4, delay: 2600, health: 1200, speed: 70, energyValue: 120, path: 'second' },
                ];
            case 8:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 32, delay: 400, health: 290, speed: 140, energyValue: 35, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 28, delay: 700, health: 250, speed: 155, energyValue: 52, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 20, delay: 1100, health: 470, speed: 120, energyValue: 85, path: 'second' },
                    { type: 'specialEnemy', texture: 'phantom', count: 4, delay: 2400, health: 1250, speed: 72, energyValue: 125, path: 'first' },
                ];
            case 9:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 35, delay: 350, health: 300, speed: 145, energyValue: 35, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 30, delay: 600, health: 260, speed: 160, energyValue: 55, path: 'second' },
                    { type: 'enemy', texture: 'enemy3', count: 22, delay: 900, health: 490, speed: 125, energyValue: 90, path: 'first' },
                    { type: 'specialEnemy', texture: 'phantom', count: 5, delay: 2200, health: 1300, speed: 75, energyValue: 130, path: 'second' },
                ];
            case 10:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 40, delay: 300, health: 310, speed: 150, energyValue: 38, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 32, delay: 500, health: 270, speed: 165, energyValue: 58, path: 'first' },
                    { type: 'enemy', texture: 'enemy3', count: 25, delay: 700, health: 510, speed: 130, energyValue: 95, path: 'second' },
                    { type: 'specialEnemy', texture: 'phantom', count: 5, delay: 2000, health: 1350, speed: 78, energyValue: 135, path: 'first' },
                ];
            default:
                return [];
        }
    }

    nextScene(): LevelNames { // Changed return type to LevelNames
        return LevelNames.Story_TheFinalAssault; // Next scene is the story for The Final Assault
    }
}
