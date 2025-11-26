// src/game/scenes/ChapterSelectScene.ts
import Phaser from 'phaser';
import { LevelNames, STORY_LEVEL_ORDER } from './lib/LevelNames';
import { WIDTH, HEIGHT } from '../scripts/Util';
import { AppColors, phaserColor } from '../scripts/Colors';
import { TextButton } from '../utils/TextButton';
import { BackgroundEffectsManager } from '../effects/BackgroundEffectsManager.ts';
import { State } from './lib/State.ts';
import {AudioManager} from "./lib/manager/AudioManager.ts";

export class ChapterSelectScene extends Phaser.Scene {
    private backgroundEffectsManager!: BackgroundEffectsManager;
    private gameState!: State;
    private audioManager: AudioManager;

    private readonly BORDER_THICKNESS = 8;
    private readonly TITLE_Y_POS = HEIGHT * 0.075;
    private readonly CONTENT_AREA_START_Y = HEIGHT * 0.20;
    private readonly CONTENT_AREA_END_Y = HEIGHT * 0.85;
    private readonly CONTENT_AREA_HEIGHT = this.CONTENT_AREA_END_Y - this.CONTENT_AREA_START_Y;


    constructor() {
        super('ChapterSelectScene');
    }

    init(): void {
        this.backgroundEffectsManager = new BackgroundEffectsManager(this);
        this.audioManager = new AudioManager(this);
        this.gameState = this.sys.registry.get('gameState');
    }

    create() {
        this.audioManager.playMusic('MainMenuMusic');
        this.cameras.main.setBackgroundColor(AppColors.GAME_BACKGROUND);
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        this.backgroundEffectsManager.configureAndStartGlitchAnnihilationEffect(this, 1250);
        this.backgroundEffectsManager.enableGhostlyClashEffect(this);

        this.drawFullScreenBorder();

        // --- Title ---
        this.add.text(WIDTH / 2, this.TITLE_Y_POS, 'Select Chapter', {
            fontFamily: 'Pixel',
            fontSize: '64px',
            color: AppColors.UI_ACCENT,
        }).setOrigin(0.5).setDepth(10);

        // --- Title Separator ---
        this.add
            .graphics()
            .lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1)
            .beginPath()
            .moveTo(0, this.TITLE_Y_POS + 70)
            .lineTo(WIDTH, this.TITLE_Y_POS + 70)
            .closePath()
            .stroke()
            .setDepth(10);

        // --- Chapter List ---
        const chapterListContainer = this.add.container(WIDTH / 2, this.CONTENT_AREA_START_Y + this.CONTENT_AREA_HEIGHT / 2);
        let yOffset = -this.CONTENT_AREA_HEIGHT / 2 + 50; // Start near the top of the content area

        // Determine the highest completed story level to unlock chapters
        // For simplicity, let's assume the last completed level is stored in gameState.level
        // You might need a more robust save system for actual progression
        this.gameState = this.sys.registry.get('gameState');
        const lastCompletedLevelKey = this.gameState.level; // e.g., "Gameplay_TheDormantScars"
        let lastCompletedStoryIndex = -1;
        for(let i = 0; i < STORY_LEVEL_ORDER.length; i++) {
            if (STORY_LEVEL_ORDER[i] === lastCompletedLevelKey) {
                lastCompletedStoryIndex = i;
                break;
            }
        }
        // If the last completed level is a gameplay level, find its preceding story level
        if (lastCompletedStoryIndex === -1 && lastCompletedLevelKey.startsWith('Gameplay_')) {
            // This logic needs to be more robust if you have multiple gameplay levels per story
            // For now, let's just unlock up to the tutorial if no other progress
            lastCompletedStoryIndex = STORY_LEVEL_ORDER.indexOf(LevelNames.Story_TheFirstStand);
        }
        // Ensure at least the first story is unlocked
        if (lastCompletedStoryIndex === -1) lastCompletedStoryIndex = 0;


        STORY_LEVEL_ORDER.forEach((storyLevelName, index) => {
            const displayName = storyLevelName.replace('Story_', '').replace(/_/g, ' ');
            const isUnlocked = index <= lastCompletedStoryIndex + 1; // Unlock current + next chapter

            const chapterButton = new TextButton(this, 0, yOffset, `${index + 1}. ${displayName}`, () => {
                this.scene.start(storyLevelName);
                if (isUnlocked) {
                } else {
                    // chapter is locked
                    // this.scene.start(storyLevelName);
                    // this.scene.get('MainMenu').hud.alert('Chapter Locked!', AppColors.UI_MESSAGE_WARN, 1000); // Assuming MainMenu has a hud
                }
            });

            if (!isUnlocked) {
                // chapterButton.setAlpha(0.5).disableInteractive();
                chapterButton.setColor(AppColors.UI_DISABLED);
            }

            chapterListContainer.add(chapterButton);
            yOffset += 40; // Spacing between chapter buttons
        });

        // --- Back Button ---
        const backButton = new TextButton(this, 0, this.CONTENT_AREA_HEIGHT / 2 - 50, 'Back to Main Menu', () => {
            this.scene.start(LevelNames.MainMenu);
        });
        chapterListContainer.add(backButton);

        this.events.on('shutdown', this.shutdown, this);
    }

    private drawFullScreenBorder(): void {
        const border = this.add.graphics();
        border.lineStyle(this.BORDER_THICKNESS, phaserColor(AppColors.UI_SEPARATOR), 1);
        border.strokeRect(
            this.BORDER_THICKNESS / 2,
            this.BORDER_THICKNESS / 2,
            WIDTH - this.BORDER_THICKNESS,
            HEIGHT - this.BORDER_THICKNESS
        );
        border.setDepth(10);
    }

    private shutdown() {
        this.backgroundEffectsManager.stop();
        this.audioManager.destroy();
    }
}