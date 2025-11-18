import { Level } from '../lib/Level.ts';
import { LevelNames } from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import { TutorialManager} from '../lib/manager/TutorialManager.ts';
import {PathMaker} from "../lib/PathMaker.ts";
import {GAME_HEIGHT, GAME_WIDTH} from "../../scripts/Util.ts";
import {EnemyConfigs, SpecialEnemyConfig} from "../../config/EnemyConfigs.ts"; // Corrected import path

export class InteractiveTutorial extends Level {
    private tutorialManager: TutorialManager; // Declare as a property

    constructor() {
        super(LevelNames.Gameplay_Tutorial);
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        const path = new PathMaker(50, GAME_HEIGHT / 2)
            .right(GAME_WIDTH - 100)
            .create(this);
        return { path1: path };
    }

    create(): void {
        super.create(); // Call the base Level's create method
        // Override default wave starting behavior for tutorial
        this.isLoaded = true; // Mark as loaded to allow update loop
        this.hud.hideInfo(); // Hide initial "Incoming First Wave" message

        this.tutorialManager = new TutorialManager(this); // Create an instance
        this.tutorialManager.startTutorial(); // Start the tutorial flow
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
                    texture: EnemyConfigs.enemy1.texture,
                    count: 5,
                    delay: 1000,
                    health: EnemyConfigs.enemy1.health,
                    speed: EnemyConfigs.enemy1.speed,
                    energyValue: EnemyConfigs.enemy1.energyValue,
                    path: 'path1'
                }];
            case 2:
                return [{
                    type: 'enemy',
                    texture: EnemyConfigs.enemy2.texture,
                    count: 5,
                    delay: 800,
                    health: EnemyConfigs.enemy2.health,
                    speed: EnemyConfigs.enemy2.speed,
                    energyValue: EnemyConfigs.enemy2.energyValue,
                    path: 'path1'
                }];
            case 3:
                return [{
                    type: 'enemy',
                    texture: EnemyConfigs.enemy3.texture,
                    count: 3,
                    delay: 1500,
                    health: EnemyConfigs.enemy3.health,
                    speed: EnemyConfigs.enemy3.speed,
                    energyValue: EnemyConfigs.enemy3.energyValue,
                    path: 'path1'
                }];
            case 4:
                return [{
                    type: 'specialEnemy',
                    texture: SpecialEnemyConfig.texture,
                    count: 1,
                    delay: 1000,
                    health: SpecialEnemyConfig.health,
                    speed: SpecialEnemyConfig.speed,
                    energyValue: SpecialEnemyConfig.energyValue,
                    path: 'path1'
                }];
            case 5:
                return [
                    {
                        type: 'enemy',
                        texture: EnemyConfigs.enemy1.texture,
                        count: 5,
                        delay: 1000,
                        health: EnemyConfigs.enemy1.health,
                        speed: EnemyConfigs.enemy1.speed,
                        energyValue: EnemyConfigs.enemy1.energyValue,
                        path: 'path1'
                    },
                    {
                        type: 'enemy',
                        texture: EnemyConfigs.enemy2.texture,
                        count: 3,
                        delay: 1200,
                        health: EnemyConfigs.enemy2.health,
                        speed: EnemyConfigs.enemy2.speed,
                        energyValue: EnemyConfigs.enemy2.energyValue,
                        path: 'path1'
                    }
                ];
            default:
                return [];
        }
    }

    nextScene(): LevelNames {
        return LevelNames.MainMenu; // Tutorial leads back to MainMenu
    }
}
