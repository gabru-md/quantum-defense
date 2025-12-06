import * as Phaser from 'phaser';
import {AppColors, phaserColor} from '../scripts/Colors';
import {GlitchAnnihilationEffect, RiftElements} from "../effects/GlitchAnnihilationEffect.ts";
import {GAME_HEIGHT, HEIGHT, WIDTH} from "../scripts/Util.ts";
import {LevelNames} from "./lib/LevelNames.ts";
import {AudioManager} from "./lib/manager/AudioManager.ts";
import {BackgroundEffectsManager} from "../effects/BackgroundEffectsManager.ts";
import {LevelStatsManager} from "./lib/manager/LevelStatsManager.ts";

export class EndScene extends Phaser.Scene {
    private win: boolean = false;
    riftManager: GlitchAnnihilationEffect;
    audioManager: AudioManager
    backgroundEffectsManager: BackgroundEffectsManager;
    nextScene: LevelNames;
    private levelStats!: LevelStatsManager;

    constructor() {
        super({key: LevelNames.EndScene});
        this.audioManager = new AudioManager(this);
        this.riftManager = new GlitchAnnihilationEffect(this);
        this.backgroundEffectsManager = new BackgroundEffectsManager(this);

    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        this.backgroundEffectsManager.enableGhostlyClashEffect(this);
        this.audioManager.setup();
    }

    init(data: { win: boolean, nextScene: LevelNames, levelStats: LevelStatsManager}) {
        this.win = data.win;
        this.nextScene = data.nextScene;
        this.levelStats = data.levelStats;
        // console.log(data.levelStats)
    }

    create() {

        this.createVisualSepartors();

        this.cameras.main.setBackgroundColor(AppColors.GAME_BACKGROUND);
        this.audioManager.playMusic('LevelComplete');
        if(this.win) {
            this.audioManager.playMusic('WinGame')
        } else {
            this.audioManager.playMusic('GameOver');
        }

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.events.on('shutdown', this.shutdown, this);

        const riftColor: number = this.win ? phaserColor(AppColors.PLAYER) : phaserColor(AppColors.SPECIAL_ENEMY);

        const riftElements: RiftElements = this.riftManager.drawRiftElements(WIDTH / 2, HEIGHT / 2, 4.5, 0.8, riftColor, null, 0.8);

        const allElements = [
            riftElements.core,
            riftElements.innerGlow,
            riftElements.outerGlow,
            ...riftElements.rays,
            ...riftElements.fragments
        ];

        allElements.forEach(el => {
            el.setAlpha(0);
        });

        const messageText = this.win ? 'Nexus Prevails' : 'Static Wins';

        const text = this.add.text(centerX, centerY + 250, messageText, {
            fontSize: '48px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: allElements,
            alpha: 0.8,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                this.riftManager.animateRiftIdle(riftElements);
                this.tweens.add({
                    targets: text,
                    alpha: 1,
                    duration: 1000,
                    ease: 'Power2',
                    onComplete: () => {
                        this.displayStats();
                        const continueText = this.add.text(centerX, centerY + 300, 'Click to continue', {
                            fontSize: '20px',
                            color: '#ffffff',
                            align: 'center'
                        }).setOrigin(0.5).setAlpha(0);

                        this.tweens.add({
                            targets: continueText,
                            alpha: 1,
                            duration: 500,
                            ease: 'Power2'
                        });

                        this.input.on('pointerdown', () => {
                            this.scene.stop(this.scene.key);
                            if(this.nextScene) {
                                this.scene.start(this.nextScene);
                            } else {
                                this.scene.start(LevelNames.MainMenu);
                            }
                        });
                        const spaceKeyListener = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
                        spaceKeyListener?.on('down', () => {
                            this.scene.stop(this.scene.key);
                            this.scene.start(LevelNames.MainMenu);
                        });
                    }
                });
            }
        });
    }

    private displayStats(): void {
        if (!this.levelStats) {
            return;
        }

        const statsStyle = { fontSize: '18px', color: '#ffffff' };
        const startY = HEIGHT - 200;
        const column1X = WIDTH / 2 - 300;
        const column2X = WIDTH / 2 + 50;
        let yPos = startY;

        const stats: { [key: string]: number } = {
            'Pulse Towers Placed': this.levelStats.pulseTowerPlaced,
            'Bomb Towers Placed': this.levelStats.bombTowerPlaced,
            'Slow Towers Placed': this.levelStats.slowTowerPlaced,
            'Enemies Eliminated': this.levelStats.enemiesEliminated,
            'Phantoms Eliminated': this.levelStats.phantomsEliminated,
            'Quantum Echoes Collected': this.levelStats.quantumEchoesCollected,
            'Towers Deactivated': this.levelStats.towersDeactivated,
            'Towers Revived': this.levelStats.towersRevived,
            'Resonance Wave Used': this.levelStats.resonanceWaveUsed,
            'Energy Spent': this.levelStats.energySpent,
        };

        let i = 0;
        let padding = 250;
        for (const [label, value] of Object.entries(stats)) {
            const xPos = i < 5 ? column1X : column2X;
            if (i === 5) {
                yPos = startY;
                padding = 300;
            }
            this.add.text(xPos, yPos, `${label}:`, statsStyle).setOrigin(0, 0.5);
            this.add.text(xPos + padding, yPos, value.toString(), statsStyle).setOrigin(1, 0.5);
            yPos += 30;
            i++;
        }
    }

    shutdown() {
        this.riftManager.stop();
        this.backgroundEffectsManager.stop();
        this.audioManager.destroy();
    }

    private createVisualSepartors() {
        const g1 = this.add.graphics().lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1).beginPath().moveTo(WIDTH, 0).lineTo(WIDTH, GAME_HEIGHT).closePath().stroke().setScrollFactor(0).setDepth(1500);
        const g2 = this.add.graphics().lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1).beginPath().moveTo(0, 0).lineTo(0, GAME_HEIGHT).closePath().stroke().setScrollFactor(0).setDepth(1500);
        const g3 = this.add.graphics().lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1).beginPath().moveTo(0, 0).lineTo(WIDTH, 0).closePath().stroke().setScrollFactor(0).setDepth(1500);
        const g4 = this.add.graphics().lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1).beginPath().moveTo(0, GAME_HEIGHT).lineTo(WIDTH, GAME_HEIGHT).closePath().stroke().setScrollFactor(0).setDepth(1500);
        return [g1, g2, g3, g4];
    }
}
