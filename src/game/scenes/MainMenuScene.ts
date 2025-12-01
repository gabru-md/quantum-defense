// src/game/scenes/MainMenuScene.ts
import Phaser from 'phaser';
import { LevelNames } from './lib/LevelNames';
import { WIDTH, HEIGHT } from '../scripts/Util';
import { AppColors, phaserColor } from '../scripts/Colors';
import { State } from "./lib/State.ts";
import { AudioManager } from "./lib/manager/AudioManager.ts";
import { BackgroundEffectsManager } from "../effects/BackgroundEffectsManager.ts";
import { TextButton } from "../utils/TextButton.ts"

enum MenuSection {
    Main = 'Main',
    Options = 'Options',
}

export class MainMenuScene extends Phaser.Scene {
    private gameState!: State;
    private audioManager: AudioManager;
    private backgroundEffectsManager: BackgroundEffectsManager;

    // Section containers
    private mainSectionContainer!: Phaser.GameObjects.Container;
    private optionsSectionContainer!: Phaser.GameObjects.Container;

    // Section navigation buttons
    private mainSectionButton!: TextButton;
    private optionsSectionButton!: TextButton;
    private sectionUnderlineGraphics!: Phaser.GameObjects.Graphics;

    // Options elements
    private soundButton!: TextButton;
    private sfxVolumeText!: Phaser.GameObjects.Text;
    private musicVolumeText!: Phaser.GameObjects.Text;
    private difficultyText!: TextButton;

    // Constants for layout
    private readonly BORDER_THICKNESS = 8;
    private readonly TITLE_Y_POS = HEIGHT * 0.075;
    private readonly SECTION_NAV_Y_POS = HEIGHT * 0.20;
    private readonly CONTENT_AREA_START_Y = HEIGHT * 0.30;
    private readonly CONTENT_AREA_END_Y = HEIGHT * 0.85;
    private readonly CONTENT_AREA_HEIGHT = this.CONTENT_AREA_END_Y - this.CONTENT_AREA_START_Y;


    constructor() {
        super(LevelNames.MainMenu);
        this.audioManager = new AudioManager(this);
        this.backgroundEffectsManager = new BackgroundEffectsManager(this);
    }

    preload() {
        this.audioManager.setup();
    }

    init(): void {
        this.gameState = this.sys.registry.get('gameState');
        if (!this.gameState) {
            this.gameState = new State(100, 350, LevelNames.MainMenu);
            this.sys.registry.set('gameState', this.gameState);
        }
    }

    create() {
        this.audioManager.playAmbience('ambience')
        this.audioManager.playMusic('MainMenuMusic');
        this.cameras.main.setBackgroundColor(AppColors.GAME_BACKGROUND);

        // Use dynamic background effect
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        this.backgroundEffectsManager.configureAndStartGlitchAnnihilationEffect(this, 1250); // Subtle glitch for menu atmosphere
        this.backgroundEffectsManager.enableGhostlyClashEffect(this);

        this.drawFullScreenBorder();

        // --- Title ---
        this.add.text(WIDTH / 2, this.TITLE_Y_POS, 'Quantum Defense', {
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

        // --- Section Navigation Buttons ---
        const sectionButtonX = WIDTH / 2;
        const sectionButtonY = this.SECTION_NAV_Y_POS;
        const sectionButtonSpacing = 200;

        this.mainSectionButton = new TextButton(this, sectionButtonX - sectionButtonSpacing / 2, sectionButtonY, MenuSection.Main, () => this.showSection(MenuSection.Main));
        this.add.existing(this.mainSectionButton).setDepth(10);

        this.optionsSectionButton = new TextButton(this, sectionButtonX + sectionButtonSpacing / 2, sectionButtonY, MenuSection.Options, () => this.showSection(MenuSection.Options));
        this.add.existing(this.optionsSectionButton).setDepth(10);

        this.sectionUnderlineGraphics = this.add.graphics().setDepth(10);

        // --- Create Section Containers ---
        this.mainSectionContainer = this.add.container(WIDTH / 2, this.CONTENT_AREA_START_Y + this.CONTENT_AREA_HEIGHT / 2);
        this.optionsSectionContainer = this.add.container(WIDTH / 2, this.CONTENT_AREA_START_Y + this.CONTENT_AREA_HEIGHT / 2);

        // Populate Main Menu Section
        let yOffsetMain = -100; // Relative to container center
        this.createMenuButton('Play Game', yOffsetMain, () => {
            this.scene.start('ChapterSelectScene'); // Navigate to new Chapter Select Scene
        }, this.mainSectionContainer);
        yOffsetMain += 60;
        this.createMenuButton('Watch Full Story', yOffsetMain, () => {
            this.scene.start(LevelNames.FullStoryPlayback);
        }, this.mainSectionContainer);
        yOffsetMain += 60;
        this.createMenuButton('Credits', yOffsetMain, () => {
            this.scene.start('CreditsScene');
        }, this.mainSectionContainer);
        yOffsetMain += 60;
        this.createMenuButton('Exit', yOffsetMain, () => {
            this.game.destroy(true);
        }, this.mainSectionContainer);

        // Populate Options Section
        let yOffsetOptions = -100; // Relative to container center
        this.soundButton = this.createMenuButton(
            `Sound: ${this.gameState.soundEnabled ? 'On' : 'Off'}`,
            yOffsetOptions,
            () => this.toggleSound(),
            this.optionsSectionContainer
        );
        yOffsetOptions += 60;

        // SFX Volume Controls
        const sfxLabel = this.add.text(-100, yOffsetOptions, 'SFX Volume:', {
            fontFamily: 'Pixel',
            fontSize: '24px',
            color: AppColors.UI_TEXT,
        }).setOrigin(0.25, 0.5);
        this.optionsSectionContainer.add(sfxLabel);
        this.createMenuButton('-', yOffsetOptions, () => this.adjustSfxVolume(-0.1), this.optionsSectionContainer).setX(sfxLabel.x + 100).setOrigin(-0.5, 0.5);
        this.sfxVolumeText = this.add.text(sfxLabel.x + 140, yOffsetOptions, '', {
            fontFamily: 'Pixel',
            fontSize: '24px',
            color: AppColors.UI_TEXT,
        }).setOrigin(-0.5, 0.5);
        this.optionsSectionContainer.add(this.sfxVolumeText);
        this.createMenuButton('+', yOffsetOptions, () => this.adjustSfxVolume(0.1), this.optionsSectionContainer).setX(sfxLabel.x + 180).setOrigin(-0.5, 0.5);;
        this.updateSfxVolumeDisplay();
        yOffsetOptions += 60;

        // Music Volume Controls
        const musicLabel = this.add.text(-100, yOffsetOptions, 'Music Volume:', {
            fontFamily: 'Pixel',
            fontSize: '24px',
            color: AppColors.UI_TEXT,
        }).setOrigin(0.25, 0.5);
        this.optionsSectionContainer.add(musicLabel);
        this.createMenuButton('-', yOffsetOptions, () => this.adjustMusicVolume(-0.1), this.optionsSectionContainer).setX(musicLabel.x + 100).setOrigin(-0.5, 0.5);
        this.musicVolumeText = this.add.text(musicLabel.x + 140, yOffsetOptions, '', {
            fontFamily: 'Pixel',
            fontSize: '24px',
            color: AppColors.UI_TEXT,
        }).setOrigin(-0.5, 0.5);
        this.optionsSectionContainer.add(this.musicVolumeText);
        this.createMenuButton('+', yOffsetOptions, () => this.adjustMusicVolume(0.1), this.optionsSectionContainer).setX(musicLabel.x + 180).setOrigin(-0.5, 0.5);
        this.updateMusicVolumeDisplay();
        yOffsetOptions += 60;

        this.difficultyText = this.createMenuButton(
            `Difficulty: ${this.gameState.difficulty.toUpperCase()}`,
            yOffsetOptions,
            () => this.cycleDifficulty(),
            this.optionsSectionContainer
        );

        // Show initial section
        this.showSection(MenuSection.Main);

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

    createMenuButton(text: string, y: number, callback: () => void, container?: Phaser.GameObjects.Container): TextButton {
        const button = new TextButton(this, 0, y, text, callback);
        if (container) {
            container.add(button);
        } else {
            this.add.existing(button);
        }
        return button;
    }

    private showSection(section: MenuSection): void {
        this.mainSectionContainer.setVisible(false);
        this.optionsSectionContainer.setVisible(false);

        this.mainSectionButton.setActive(false).setColor(AppColors.UI_TEXT);
        this.optionsSectionButton.setActive(false).setColor(AppColors.UI_TEXT);

        let activeSectionButton: TextButton;
        switch (section) {
            case MenuSection.Main:
                this.mainSectionContainer.setVisible(true);
                activeSectionButton = this.mainSectionButton;
                break;
            case MenuSection.Options:
                this.optionsSectionContainer.setVisible(true);
                activeSectionButton = this.optionsSectionButton;
                break;
        }
        activeSectionButton.setActive(true).setColor(AppColors.UI_ACCENT);

        this.sectionUnderlineGraphics.clear();
        this.sectionUnderlineGraphics.lineStyle(4, phaserColor(AppColors.UI_ACCENT), 1);
        this.sectionUnderlineGraphics.beginPath();
        this.sectionUnderlineGraphics.moveTo(activeSectionButton.x - activeSectionButton.width / 2, activeSectionButton.y + activeSectionButton.height / 2 + 5);
        this.sectionUnderlineGraphics.lineTo(activeSectionButton.x + activeSectionButton.width / 2, activeSectionButton.y + activeSectionButton.height / 2 + 5);
        this.sectionUnderlineGraphics.strokePath();
    }

    private toggleSound(): void {
        this.gameState.soundEnabled = !this.gameState.soundEnabled;
        this.soundButton.setText(`Sound: ${this.gameState.soundEnabled ? 'On' : 'Off'}`);
        this.sound.mute = !this.gameState.soundEnabled;
    }

    private adjustSfxVolume(amount: number): void {
        if (amount > 0) {
            this.audioManager.increaseSfxVolume(amount);
        } else {
            this.audioManager.decreaseSfxVolume(Math.abs(amount));
        }
        this.updateSfxVolumeDisplay();
    }

    private updateSfxVolumeDisplay(): void {
        this.sfxVolumeText.setText(`${Math.round(this.audioManager.sfxVolume * 100)}%`);
    }

    private adjustMusicVolume(amount: number): void {
        if (amount > 0) {
            this.audioManager.increaseMusicVolume(amount);
        } else {
            this.audioManager.decreaseMusicVolume(Math.abs(amount));
        }
        this.updateMusicVolumeDisplay();
    }

    private updateMusicVolumeDisplay(): void {
        this.musicVolumeText.setText(`${Math.round(this.audioManager.musicVolume * 100)}%`);
    }

    private cycleDifficulty(): void {
        const difficulties: ('easy' | 'normal' | 'hard')[] = ['easy', 'normal', 'hard'];
        let currentIndex = difficulties.indexOf(this.gameState.difficulty);
        currentIndex = (currentIndex + 1) % difficulties.length;
        this.gameState.difficulty = difficulties[currentIndex];
        this.difficultyText.setText(`Difficulty: ${this.gameState.difficulty.toUpperCase()}`);
    }

    private shutdown() {
        this.audioManager.destroy();
        this.backgroundEffectsManager.stop();
    }
}