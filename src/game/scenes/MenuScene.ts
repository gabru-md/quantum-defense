import * as Phaser from 'phaser';
import { AppColors} from '../scripts/Colors';
import { GAME_WIDTH } from '../scripts/Util';
import { State } from './lib/State'; // Import State

export class MenuScene extends Phaser.Scene {
    private gameState!: State;
    private difficultyText!: Phaser.GameObjects.Text;
    private soundText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'MenuScene' });
    }

    create(): void {
        // --- Initialize Game State ---
        this.gameState = new State(100, 350, 'Menu'); // Initial values for baseHealth, money, level
        this.sys.registry.set('gameState', this.gameState);

        // --- Background & Title ---
        this.cameras.main.setBackgroundColor(AppColors.GAME_BACKGROUND);
        
        this.add.text(GAME_WIDTH / 2, 150, 'QUANTUM DEFENSE', {
            font: '80px Roboto',
            color: AppColors.UI_ACCENT,
            align: 'center'
        }).setOrigin(0.5);

        // --- Level Selection ---
        this.createLevelSelectionButtons(GAME_WIDTH / 2, 300);

        // --- Difficulty Selection ---
        this.createDifficultyToggle(GAME_WIDTH / 2, 550);

        // --- Sound Toggle ---
        this.createSoundToggle(GAME_WIDTH / 2, 650);

        // --- Credits Button ---
        this.createCreditsButton(GAME_WIDTH / 2, 750);
    }

    private createLevelSelectionButtons(x: number, y: number): void {
        const levelKeys = ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];
        const buttonSpacing = 80;
        let currentY = y;

        this.add.text(x, currentY - 50, 'SELECT LEVEL', { font: '36px Roboto', color: AppColors.UI_TEXT }).setOrigin(0.5);
        currentY += 10;

        levelKeys.forEach((key, index) => {
            const button = this.add.text(x, currentY + (index * buttonSpacing), key, {
                font: '48px Roboto',
                color: AppColors.UI_TEXT,
                backgroundColor: AppColors.UI_PRIMARY_BG,
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive();

            button.on('pointerover', () => button.setColor(AppColors.UI_ACCENT.toString()));
            button.on('pointerout', () => button.setColor(AppColors.UI_TEXT));
            button.on('pointerdown', () => {
                this.gameState.level = key; // Update state with selected level
                this.scene.start(key);
            });
        });
    }

    private createDifficultyToggle(x: number, y: number): void {
        this.difficultyText = this.add.text(x, y, `DIFFICULTY: ${this.gameState.difficulty.toUpperCase()}`, {
            font: '36px Roboto',
            color: AppColors.UI_TEXT,
            backgroundColor: AppColors.UI_PRIMARY_BG,
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        this.difficultyText.on('pointerdown', () => {
            const difficulties = ['easy', 'normal', 'hard'];
            let currentIndex = difficulties.indexOf(this.gameState.difficulty);
            currentIndex = (currentIndex + 1) % difficulties.length;
            this.gameState.difficulty = difficulties[currentIndex] as 'easy' | 'normal' | 'hard';
            this.difficultyText.setText(`DIFFICULTY: ${this.gameState.difficulty.toUpperCase()}`);
        });

        this.difficultyText.on('pointerover', () => this.difficultyText.setColor(AppColors.UI_ACCENT.toString()));
        this.difficultyText.on('pointerout', () => this.difficultyText.setColor(AppColors.UI_TEXT));
    }

    private createSoundToggle(x: number, y: number): void {
        this.soundText = this.add.text(x, y, `SOUND: ${this.gameState.soundEnabled ? 'ON' : 'OFF'}`, {
            font: '36px Roboto',
            color: AppColors.UI_TEXT,
            backgroundColor: AppColors.UI_PRIMARY_BG,
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        this.soundText.on('pointerdown', () => {
            this.gameState.soundEnabled = !this.gameState.soundEnabled;
            this.soundText.setText(`SOUND: ${this.gameState.soundEnabled ? 'ON' : 'OFF'}`);
            // Implement actual sound mute/unmute here later
        });

        this.soundText.on('pointerover', () => this.soundText.setColor(AppColors.UI_ACCENT.toString()));
        this.soundText.on('pointerout', () => this.soundText.setColor(AppColors.UI_TEXT));
    }

    private createCreditsButton(x: number, y: number): void {
        const button = this.add.text(x, y, 'CREDITS', {
            font: '36px Roboto',
            color: AppColors.UI_TEXT,
            backgroundColor: AppColors.UI_PRIMARY_BG,
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        button.on('pointerover', () => button.setColor(AppColors.UI_ACCENT.toString()));
        button.on('pointerout', () => button.setColor(AppColors.UI_TEXT));
        button.on('pointerdown', () => {
            this.scene.start('CreditsScene'); // Will create this scene next
        });
    }
}
