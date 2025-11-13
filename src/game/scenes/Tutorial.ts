import * as Phaser from 'phaser';
import {Level} from './lib/Level';
import {GAME_HEIGHT, GAME_WIDTH} from '../scripts/Util';
import {AppColors} from '../scripts/Colors';

export class Tutorial extends Level {
    private tutorialStep = 0;

    constructor() {
        super('Tutorial');
    }

    create(): void {
        super.create();
        this.startNextStep();
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        const path = new Phaser.Curves.Path(50, GAME_HEIGHT / 2);
        path.lineTo(GAME_WIDTH - 50, GAME_HEIGHT / 2);
        return {path1: path};
    }

    public getWaveConfig(wave: number): {
        type: string;
        texture: string;
        count: number;
        delay: number;
        health: number;
        speed: number;
        moneyValue: number;
        path: string;
    }[] {
        switch (wave) {
            case 1: // First enemy
                return [{
                    type: 'enemy',
                    texture: 'enemy1',
                    count: 1,
                    delay: 1000,
                    health: 100,
                    speed: 70,
                    moneyValue: 10,
                    path: 'path1'
                }];
            case 2: // Second enemy
                return [{
                    type: 'enemy',
                    texture: 'enemy2',
                    count: 1,
                    delay: 1000,
                    health: 100,
                    speed: 130,
                    moneyValue: 10,
                    path: 'path1'
                }];
            case 3: // Third enemy
                return [{
                    type: 'enemy',
                    texture: 'enemy3',
                    count: 1,
                    delay: 1000,
                    health: 100,
                    speed: 50,
                    moneyValue: 10,
                    path: 'path1'
                }];
            case 4: // First special enemy
                return [{
                    type: 'specialEnemy',
                    texture: 'specialEnemy',
                    count: 1,
                    delay: 1000,
                    health: 100,
                    speed: 80,
                    moneyValue: 25,
                    path: 'path1'
                }];
            case 5: // Final tutorial wave
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 5,
                        delay: 1000,
                        health: 100,
                        speed: 70,
                        moneyValue: 10,
                        path: 'path1'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 3,
                        delay: 1000,
                        health: 130,
                        speed: 50,
                        moneyValue: 10,
                        path: 'path1'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy3',
                        count: 1,
                        delay: 1000,
                        health: 100,
                        speed: 50,
                        moneyValue: 10,
                        path: 'path1'
                    },
                    {
                        type: 'specialEnemy',
                        texture: 'specialEnemy',
                        count: 1,
                        delay: 1000,
                        health: 100,
                        speed: 70,
                        moneyValue: 25,
                        path: 'path1'
                    }
                ];
            default:
                return [];
        }
    }

    private startNextStep(): void {
        switch (this.tutorialStep) {
            case 0:
                this.hud.info("Welcome to Quantum Defense.", AppColors.UI_MESSAGE_INFO, () => {
                    this.hud.info("Use WASD to move your character.", AppColors.UI_MESSAGE_INFO, () => {
                        this.events.once('playerMoved', () => {
                            this.hud.info("Amazing! Let's learn how to build towers.", AppColors.UI_MESSAGE_INFO, () => {
                                this.startNextStep();
                            })
                        });
                    });
                });
                break;
            case 1:
                this.hud.info("An enemy is coming! Select a tower from the HUD on the right.", AppColors.UI_MESSAGE_INFO, () => {
                    this.waveManager.startWave(1);
                    this.events.once('towerPlaced', () => this.startNextStep());
                });
                break;
            case 2:
                this.hud.info("Great! Your tower will now attack enemies in range.", AppColors.UI_MESSAGE_INFO, () => {
                    this.events.once('enemyDied', () => this.startNextStep());
                });
                break;
            case 3:
                this.hud.info("Here comes another type of enemy, This one is fast!", AppColors.UI_MESSAGE_INFO, () => {
                    this.waveManager.startWave(2);
                    this.events.once('enemyDied', () => this.startNextStep());
                });
                break;
            case 4:
                this.hud.info("And another one, slow but big!.", AppColors.UI_MESSAGE_INFO, () => {
                    this.waveManager.startWave(3);
                    this.events.once('enemyDied', () => this.startNextStep());
                });
                break;
            case 5:
                this.hud.info("Watch out! This Special Enemy deactivates nearby towers.", AppColors.UI_MESSAGE_INFO, () => {
                    this.waveManager.startWave(4);
                    this.events.once('towerDeactivated', () => this.startNextStep());
                });
                break;
            case 6:
                this.hud.info("Your tower is now offline! Move near it and press 'E' thrice to send a revival pulse.", AppColors.UI_MESSAGE_INFO, () => {
                    this.events.once('towerRevived', () => this.startNextStep());
                });
                break;
            case 7:
                this.hud.info("Excellent! You can also use your 'E' pulse to damage Special Enemies directly. Try it now!", AppColors.UI_MESSAGE_INFO, () => {
                    this.events.once('specialEnemyKilledByPlayer', () => this.startNextStep());
                });
                break;
            case 8:
                this.hud.info("Towers can also damage each other and can be revived.", AppColors.UI_MESSAGE_INFO, () => {
                    this.time.delayedCall(2500, () => {
                        this.startNextStep();
                    })
                });
                break;
            case 9:
                this.hud.info("You've learned the basics! Survive the final wave to win.", AppColors.UI_MESSAGE_INFO, () => {
                    this.waveManager.startWave(5);
                    this.events.once('waveCompleted', () => this.startNextStep());
                });
                break;
            case 10:
                this.hud.info("Tutorial Complete! You are now ready for the real challenge.", AppColors.UI_MESSAGE_INFO, () => {
                    this.scene.start(this.nextScene());
                });
                break;
        }
        this.tutorialStep++;
    }

    public nextScene(): string {
        return 'Level 1';
    }
}
