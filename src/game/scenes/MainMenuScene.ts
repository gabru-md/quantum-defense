import Phaser from 'phaser';
import {LevelNames, STORY_LEVEL_ORDER} from './lib/LevelNames';
import {WIDTH, HEIGHT} from '../scripts/Util';
import {AppColors, phaserColor} from '../scripts/Colors';
import {State} from "./lib/State.ts";

enum MenuSection {
    Main = 'Menu',
    Settings = 'Settings',
}

export class MainMenuScene extends Phaser.Scene {
    private soundButton!: Phaser.GameObjects.Text;
    private difficultyText!: Phaser.GameObjects.Text;
    private gameState!: State;
    private currentStoryLevelIndex: number = 0;
    private storyLevelDisplayText!: Phaser.GameObjects.Text;
    private prevLevelButton!: Phaser.GameObjects.Text;
    private nextLevelButton!: Phaser.GameObjects.Text;
    private sectionUnderlineGraphics!: Phaser.GameObjects.Graphics; // New property for the underline

    // Section containers
    private mainSectionContainer!: Phaser.GameObjects.Container;
    private settingsSectionContainer!: Phaser.GameObjects.Container;

    // Section navigation buttons
    private mainSectionButton!: Phaser.GameObjects.Text;
    private settingsSectionButton!: Phaser.GameObjects.Text;

    // Constants for layout
    private readonly BORDER_THICKNESS = 8;
    private readonly TITLE_Y_POS = HEIGHT * 0.075;
    private readonly CONTENT_AREA_START_Y = HEIGHT * 0.30; // Adjusted for title separator
    private readonly CONTENT_AREA_END_Y = HEIGHT * 0.70;
    private readonly CONTENT_AREA_HEIGHT = this.CONTENT_AREA_END_Y - this.CONTENT_AREA_START_Y;
    private readonly CONTENT_AREA_X_PADDING = WIDTH * 0.30;
    private readonly CONTENT_AREA_WIDTH = WIDTH - (2 * this.CONTENT_AREA_X_PADDING);
    private readonly SECTION_BUTTON_Y_POS = this.CONTENT_AREA_START_Y + 30; // Position for section buttons

    constructor() {
        super(LevelNames.MainMenu);
    }

    preload() {
        // Preload any assets specific to the main menu, if any
        // Preload textures for animated elements
        this.load.image('enemy1_menu', this.createEnemyTexture('enemy1_menu', 32, AppColors.ENEMY_NORMAL));
        this.load.image('enemy2_menu', this.createEnemyTexture('enemy2_menu', 32, AppColors.ENEMY_FAST));
        this.load.image('enemy3_menu', this.createEnemyTexture('enemy3_menu', 32, AppColors.ENEMY_TANK));
        this.load.image(
            'special_enemy_menu',
            this.createEnemyTexture('special_enemy_menu', 32, AppColors.SPECIAL_ENEMY)
        );
        this.load.image('tower1_menu', this.createTowerTexture('tower1_menu', 32, AppColors.TOWER_LASER));
        this.load.image('tower2_menu', this.createTowerTexture('tower2_menu', 32, AppColors.TOWER_BOMB));
        this.load.image('tower3_menu', this.createTowerTexture('tower3_menu', 32, AppColors.TOWER_SLOW));
        this.load.image('player_menu', this.createPlayerTexture('player_menu', 24, AppColors.PLAYER));
    }

    init(): void {
        this.gameState = this.sys.registry.get('gameState');
        if (!this.gameState) {
            this.gameState = new State(100, 350, LevelNames.MainMenu);
            this.sys.registry.set('gameState', this.gameState);
        }
    }

    create() {
        this.cameras.main.setBackgroundColor(AppColors.GAME_BACKGROUND);

        this.createAnimatedGridBackground();
        this.createVisualElements();
        this.drawFullScreenBorder();

        // --- Title ---
        this.add.text(WIDTH / 2, this.TITLE_Y_POS, 'Quantum Defense', {
            fontSize: '48px',
            color: AppColors.UI_ACCENT,
        }).setOrigin(0.5);

        // --- Title Separator ---
        this.add
            .graphics()
            .lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1)
            .beginPath()
            .moveTo(0, this.TITLE_Y_POS + 40)
            .lineTo(WIDTH, this.TITLE_Y_POS + 40)
            .closePath()
            .stroke();

        // --- Menu Content Panel ---
        const panelGraphics = this.add.graphics();
        panelGraphics.fillStyle(phaserColor(AppColors.GAME_BACKGROUND), 0.6); // Semi-transparent background
        panelGraphics.fillRect(
            this.CONTENT_AREA_X_PADDING,
            this.CONTENT_AREA_START_Y,
            this.CONTENT_AREA_WIDTH,
            this.CONTENT_AREA_HEIGHT
        );
        panelGraphics.lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1); // Thicker border for content
        panelGraphics.strokeRect(
            this.CONTENT_AREA_X_PADDING,
            this.CONTENT_AREA_START_Y,
            this.CONTENT_AREA_WIDTH,
            this.CONTENT_AREA_HEIGHT
        );

        // --- Section Navigation Buttons ---
        const buttonSpacing = 150;
        const startX = WIDTH / 2 - buttonSpacing;

        this.mainSectionButton = this.createSectionButton(startX, this.SECTION_BUTTON_Y_POS, MenuSection.Main, () => this.showSection(MenuSection.Main));
        this.settingsSectionButton = this.createSectionButton(startX + 2 * buttonSpacing, this.SECTION_BUTTON_Y_POS, MenuSection.Settings, () => this.showSection(MenuSection.Settings));

        this.sectionUnderlineGraphics = this.add.graphics(); // Initialize the underline graphics

        // --- Create Section Containers ---
        this.mainSectionContainer = this.add.container(this.CONTENT_AREA_X_PADDING, this.CONTENT_AREA_START_Y + 70);
        this.settingsSectionContainer = this.add.container(this.CONTENT_AREA_X_PADDING, this.CONTENT_AREA_START_Y + 70);

        // Populate Main Menu Section
        let yOffsetMain = 100;
        // Populate Select Levels Section
        this.storyLevelDisplayText = this.add.text(this.CONTENT_AREA_WIDTH / 2, yOffsetMain, '', {
            fontSize: '32px',
            color: AppColors.UI_TEXT
        }).setOrigin(0.5);
        this.mainSectionContainer.add(this.storyLevelDisplayText);

        this.prevLevelButton = this.createMenuButton('<', this.CONTENT_AREA_WIDTH / 2 - this.storyLevelDisplayText.width / 2 - 50, yOffsetMain, () => this.navigateStoryLevel(-1), this.mainSectionContainer);
        this.nextLevelButton = this.createMenuButton('>', this.CONTENT_AREA_WIDTH / 2 + this.storyLevelDisplayText.width / 2 + 50, yOffsetMain, () => this.navigateStoryLevel(1), this.mainSectionContainer);
        yOffsetMain += 50;

        this.createMenuButton('Start Tutorial', this.CONTENT_AREA_WIDTH / 2, yOffsetMain, () => {
            this.scene.start(LevelNames.Tutorial);
        }, this.mainSectionContainer);
        yOffsetMain += 50;
        this.createMenuButton('Watch Full Story', this.CONTENT_AREA_WIDTH / 2, yOffsetMain, () => {
            this.scene.start(LevelNames.FullStoryPlayback);
        }, this.mainSectionContainer);
        yOffsetMain += 50;


        // Make the displayed level itself clickable
        this.storyLevelDisplayText.setInteractive({useHandCursor: true});
        this.storyLevelDisplayText.on('pointerover', () => {
            this.storyLevelDisplayText.setColor(AppColors.UI_ACCENT);
        });
        this.storyLevelDisplayText.on('pointerout', () => {
            this.storyLevelDisplayText.setColor(AppColors.UI_TEXT);
        });
        this.storyLevelDisplayText.on('pointerdown', () => {
            this.storyLevelDisplayText.setColor(AppColors.PLAYER);
        });
        this.storyLevelDisplayText.on('pointerup', () => {
            this.storyLevelDisplayText.setColor(AppColors.UI_ACCENT);
            this.scene.start(STORY_LEVEL_ORDER[this.currentStoryLevelIndex]);
        });

        this.updateStoryLevelDisplay(); // Initial display

        // Populate Settings Section
        let yOffsetSettings = 100;
        this.soundButton = this.createMenuButton(
            `Sound: ${this.gameState.soundEnabled ? 'On' : 'Off'}`,
            this.CONTENT_AREA_WIDTH / 2,
            yOffsetSettings,
            () => this.toggleSound(),
            this.settingsSectionContainer
        );
        yOffsetSettings += 50;

        this.difficultyText = this.createMenuButton(
            `Difficulty: ${this.gameState.difficulty.toUpperCase()}`,
            this.CONTENT_AREA_WIDTH / 2,
            yOffsetSettings,
            () => this.cycleDifficulty(),
            this.settingsSectionContainer
        );
        yOffsetSettings += 50;

        this.createMenuButton('Credits', this.CONTENT_AREA_WIDTH / 2, yOffsetSettings, () => {
            this.scene.start('CreditsScene');
        }, this.settingsSectionContainer);

        // Show initial section
        this.showSection(MenuSection.Main);
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
    }

    private createAnimatedGridBackground(): void {
        const gridGraphics = this.add.graphics({
            lineStyle: {
                width: 1,
                color: phaserColor(AppColors.UI_SEPARATOR),
                alpha: 0.1,
            },
        });
        const gridSize = 5;

        for (let x = 0; x < WIDTH; x += gridSize) {
            gridGraphics.lineBetween(x, 0, x, HEIGHT);
        }
        for (let y = 0; y < HEIGHT; y += gridSize) {
            gridGraphics.lineBetween(0, y, WIDTH, y);
        }

        // Simple scroll animation
        this.tweens.add({
            targets: gridGraphics,
            x: {from: 0, to: -gridSize},
            y: {from: 0, to: -gridSize},
            duration: 5000,
            ease: 'Linear',
            repeat: -1,
            yoyo: true,
        });
    }

    private createVisualElements() {
        // --- Animated Game Elements ---
        const gameAreaLeft = 0;
        const gameAreaRight = WIDTH;
        const gameAreaTop = 0;
        const gameAreaBottom = HEIGHT;

        for (let i = 0; i < 2; i++) {
            // Randomize coordinates for enemies
            this.addAnimatedElement(
                'enemy1_menu',
                Phaser.Math.Between(gameAreaLeft + 50, gameAreaRight - 50),
                Phaser.Math.Between(gameAreaTop + 200, gameAreaBottom - 100),
                0.8,
                2000
            );
            this.addAnimatedElement(
                'enemy2_menu',
                Phaser.Math.Between(gameAreaLeft + 50, gameAreaRight - 50),
                Phaser.Math.Between(gameAreaTop + 200, gameAreaBottom - 100),
                0.7,
                1800
            );
            this.addAnimatedElement(
                'enemy3_menu',
                Phaser.Math.Between(gameAreaLeft + 50, gameAreaRight - 50),
                Phaser.Math.Between(gameAreaTop + 200, gameAreaBottom - 100),
                0.9,
                2200
            );
            this.addAnimatedElement(
                'special_enemy_menu',
                Phaser.Math.Between(gameAreaLeft + 50, gameAreaRight - 50),
                Phaser.Math.Between(gameAreaTop + 200, gameAreaBottom - 100),
                0.85,
                1900
            );
            // Randomize coordinates for towers
            this.addAnimatedElement(
                'tower1_menu',
                Phaser.Math.Between(gameAreaLeft + 50, gameAreaRight - 50),
                Phaser.Math.Between(gameAreaTop + 200, gameAreaBottom - 100),
                0.9,
                1800
            );
            this.addAnimatedElement(
                'tower2_menu',
                Phaser.Math.Between(gameAreaLeft + 50, gameAreaRight - 50),
                Phaser.Math.Between(gameAreaTop + 200, gameAreaBottom - 100),
                0.8,
                2100
            );
            this.addAnimatedElement(
                'tower3_menu',
                Phaser.Math.Between(gameAreaLeft + 50, gameAreaRight - 50),
                Phaser.Math.Between(gameAreaTop + 200, gameAreaBottom - 100),
                0.75,
                1700
            );
            // Player
            this.addAnimatedElement(
                'player_menu',
                Phaser.Math.Between(gameAreaLeft + 50, gameAreaRight - 50),
                Phaser.Math.Between(gameAreaTop + 200, gameAreaBottom - 100),
                0.7,
                2200
            );
        }
    }

    // Helper functions to create textures for menu elements
    private createEnemyTexture(key: string, size: number, color: string): string {
        const graphics = this.make.graphics({x: 0, y: 0});
        graphics.fillStyle(phaserColor(color));
        graphics.fillRect(0, 0, size, size); // Simple square for menu preview
        graphics.generateTexture(key, size, size);
        graphics.destroy();
        return key;
    }

    private createTowerTexture(key: string, size: number, color: string): string {
        const graphics = this.make.graphics({x: 0, y: 0});
        graphics.fillStyle(phaserColor(color));
        graphics.fillCircle(size / 2, size / 2, size / 2);
        graphics.fillStyle(phaserColor('0x000000'), 0.5);
        graphics.fillCircle(size / 2, size / 2, size / 4);
        graphics.generateTexture(key, size, size);
        graphics.destroy();
        return key;
    }

    private createPlayerTexture(key: string, size: number, color: string): string {
        const graphics = this.make.graphics({x: 0, y: 0});
        graphics.fillStyle(phaserColor(color));
        graphics.fillCircle(size / 2, size / 2, size / 2);
        graphics.generateTexture(key, size, size);
        graphics.destroy();
        return key;
    }

    private addAnimatedElement(key: string, x: number, y: number, scale: number, duration: number): void {
        const randomOffsetX = Phaser.Math.Between(-20, 20);
        const randomOffsetY = Phaser.Math.Between(-20, 20);

        const targetX = x + randomOffsetX;
        const targetY = y + randomOffsetY;

        const element = this.add.image(x, y, key).setScale(scale).setAlpha(0.7).setDepth(-1);

        // Create the Tween
        this.tweens.add({
            targets: element,
            x: targetX,
            y: targetY,
            duration: duration,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
        });
    }

    // Modified createMenuButton to accept an optional container
    createMenuButton(text: string, x: number, y: number, callback: () => void, container?: Phaser.GameObjects.Container): Phaser.GameObjects.Text {
        const button = this.add.text(x, y, text, {
            fontSize: '32px',
            color: AppColors.UI_TEXT,
        })
            .setOrigin(0.5)
            .setInteractive({useHandCursor: true});

        button.on('pointerover', () => {
            button.setColor(AppColors.UI_ACCENT);
        });

        button.on('pointerout', () => {
            button.setColor(AppColors.UI_TEXT);
        });

        button.on('pointerdown', () => {
            button.setColor(AppColors.PLAYER);
        });

        button.on('pointerup', () => {
            button.setColor(AppColors.UI_ACCENT);
            callback();
        });

        if (container) {
            container.add(button);
        }
        return button;
    }

    // New method for section navigation buttons
    private createSectionButton(x: number, y: number, text: string, callback: () => void): Phaser.GameObjects.Text {
        const button = this.add.text(x, y, text, {
            fontSize: '24px',
            color: AppColors.UI_TEXT,
        })
            .setOrigin(0.75)
            .setInteractive({useHandCursor: true});

        button.on('pointerover', () => {
            button.setColor(AppColors.UI_ACCENT);
        });

        button.on('pointerout', () => {
            // Only revert color if not the active section
            if (button.getData('active') !== true) {
                button.setColor(AppColors.UI_TEXT);
            }
        });

        button.on('pointerdown', () => {
            button.setColor(AppColors.PLAYER);
        });

        button.on('pointerup', () => {
            callback();
        });
        return button;
    }

    private showSection(section: MenuSection): void {
        // Hide all containers
        this.mainSectionContainer.setVisible(false);
        this.settingsSectionContainer.setVisible(false);

        // Reset all section buttons to inactive state
        this.mainSectionButton.setColor(AppColors.UI_TEXT).setData('active', false);
        this.settingsSectionButton.setColor(AppColors.UI_TEXT).setData('active', false);

        // Show the selected container and set its button to active state
        switch (section) {
            case MenuSection.Main:
                this.mainSectionContainer.setVisible(true);
                this.mainSectionButton.setColor(AppColors.UI_ACCENT).setData('active', true);
                break;
            case MenuSection.Settings:
                this.settingsSectionContainer.setVisible(true);
                this.settingsSectionButton.setColor(AppColors.UI_ACCENT).setData('active', true);
                break;
        }

        // Draw the underline
        this.sectionUnderlineGraphics.clear();
        this.sectionUnderlineGraphics.lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1);
        this.sectionUnderlineGraphics.beginPath();
        this.sectionUnderlineGraphics.moveTo(this.CONTENT_AREA_X_PADDING, this.CONTENT_AREA_START_Y + 50);
        this.sectionUnderlineGraphics.lineTo(this.CONTENT_AREA_X_PADDING + this.CONTENT_AREA_WIDTH, this.CONTENT_AREA_START_Y + 50)
        this.sectionUnderlineGraphics.closePath();
        this.sectionUnderlineGraphics.stroke();
    }

    private navigateStoryLevel(direction: number): void {
        this.currentStoryLevelIndex += direction;

        // do circular loop
        if (this.currentStoryLevelIndex < 0) {
            this.currentStoryLevelIndex = STORY_LEVEL_ORDER.length - 1;
        }
        // Clamp the index to valid range
        this.currentStoryLevelIndex = Phaser.Math.Clamp(
            this.currentStoryLevelIndex,
            0,
            STORY_LEVEL_ORDER.length - 1
        );
        this.updateStoryLevelDisplay();
    }

    private updateStoryLevelDisplay(): void {
        const levelName = STORY_LEVEL_ORDER[this.currentStoryLevelIndex];
        const displayName = levelName.replace('Story_', '');
        this.storyLevelDisplayText.setText(`${this.currentStoryLevelIndex + 1}: ${displayName}`);

        // Adjust button positions based on the new text width
        // These buttons are children of selectLevelsSectionContainer, so their x is relative to the container
        this.prevLevelButton.x = this.CONTENT_AREA_WIDTH / 2 - this.storyLevelDisplayText.width / 2 - 50;
        this.nextLevelButton.x = this.CONTENT_AREA_WIDTH / 2 + this.storyLevelDisplayText.width / 2 + 50;
    }

    private toggleSound(): void {
        this.gameState.soundEnabled = !this.gameState.soundEnabled;
        this.soundButton.setText(`Sound: ${this.gameState.soundEnabled ? 'On' : 'Off'}`);
        this.sound.mute = !this.gameState.soundEnabled;
    }

    private cycleDifficulty(): void {
        const difficulties: ('easy' | 'normal' | 'hard')[] = ['easy', 'normal', 'hard'];
        let currentIndex = difficulties.indexOf(this.gameState.difficulty);
        currentIndex = (currentIndex + 1) % difficulties.length;
        this.gameState.difficulty = difficulties[currentIndex];
        this.difficultyText.setText(`Difficulty: ${this.gameState.difficulty.toUpperCase()}`);
    }
}
