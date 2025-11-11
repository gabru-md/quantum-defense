import * as Phaser from 'phaser';
import {AppColors, phaserColor} from '../scripts/Colors';
import {GAME_HEIGHT, WIDTH} from '../scripts/Util';
import {State} from './lib/State';

export class MenuScene extends Phaser.Scene {
    private gameState!: State;
    private difficultyText!: Phaser.GameObjects.Text;
    private soundText!: Phaser.GameObjects.Text;

    constructor() {
        super({key: 'MenuScene'});
    }

    init(): void {
        // Initialize Game State and set it in the Registry
        // This ensures a fresh state when entering the menu, or retrieves existing if returning
        this.gameState = new State(100, 350, 'Menu'); // Default values
        this.sys.registry.set('gameState', this.gameState);
    }

    create(): void {
        this.cameras.main.setBackgroundColor(AppColors.GAME_BACKGROUND);

        // --- Full-screen Stroke Panel ---
        this.add.graphics()
            .lineStyle(5, phaserColor(AppColors.UI_SEPARATOR), 1)
            .strokeRect(0, 0, WIDTH, GAME_HEIGHT)
            .setDepth(0);

        // --- Game Title ---
        this.add.text(WIDTH / 2, 100, 'QUANTUM DEFENSE', {
            font: '80px',
            color: AppColors.UI_ACCENT,
            align: 'center'
        }).setOrigin(0.5);
        this.add.graphics()
            .lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1)
            .beginPath()
            .moveTo(0, 150)
            .lineTo(WIDTH, 150)
            .closePath()
            .stroke();

        // --- Level Selection Panel ---
        this.createPanel(WIDTH / 2, 400, 450, 425, 'SELECT LEVEL', (panelX, panelY) => {
            this.createLevelSelectionButtons(panelX, panelY + 20);
        });

        // --- Settings Panel ---
        this.createPanel(WIDTH / 2, 750, 450, 200, 'SETTINGS', (panelX, panelY) => {
            this.createDifficultyToggle(panelX, panelY + 20);
            this.createSoundToggle(panelX, panelY + 80);
        });

        // --- Credits Button ---
        this.createButton(WIDTH / 2, 900, 'CREDITS', () => {
            this.scene.start('CreditsScene');
        });
    }

    private createPanel(x: number, y: number, width: number, height: number, title: string, contentCallback: (panelX: number, panelY: number) => void): void {
        const panelGraphics = this.add.graphics();
        // panelGraphics.fillStyle(phaserColor(AppColors.UI_PRIMARY_BG), 0.8);
        panelGraphics.fillRect(x - width / 2, y - height / 2, width, height);
        panelGraphics.lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1);
        panelGraphics.strokeRect(x - width / 2, y - height / 2, width, height);

        this.add.text(x, y - height / 2 + 25, title, {
            font: '36px',
            color: AppColors.UI_ACCENT,
            align: 'center'
        }).setOrigin(0.5);
        this.add.graphics()
            .lineStyle(1, phaserColor(AppColors.UI_SEPARATOR), 1)
            .beginPath()
            .moveTo(x - width / 2, y - height / 2 + 45)
            .lineTo(x + width / 2, y - height / 2 + 45)
            .closePath()
            .stroke();

        contentCallback(x, y - height / 2 + 70); // Pass content start position
    }

    private createButton(x: number, y: number, text: string, callback: () => void): Phaser.GameObjects.Text {
        const button = this.add.text(x, y, text, {
            font: '36px',
            color: AppColors.UI_TEXT,
            padding: {x: 20, y: 10}
        }).setOrigin(0.5).setInteractive();

        button.on('pointerover', () => button.setColor(AppColors.UI_ACCENT));
        button.on('pointerout', () => button.setColor(AppColors.UI_TEXT));
        button.on('pointerdown', callback);
        return button;
    }

    private createLevelSelectionButtons(x: number, y: number): void {
        const levelKeys = ['Tutorial', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];
        const buttonSpacing = 60;
        let currentY = y;

        levelKeys.forEach((key, index) => {
            this.createButton(x, currentY + (index * buttonSpacing), key, () => {
                this.gameState.level = key;
                this.scene.start(key);
            });
        });
    }

    private createDifficultyToggle(x: number, y: number): void {
        this.difficultyText = this.createButton(x, y, `DIFFICULTY: ${this.gameState.difficulty.toUpperCase()}`, () => {
            const difficulties = ['easy', 'normal', 'hard'];
            let currentIndex = difficulties.indexOf(this.gameState.difficulty);
            currentIndex = (currentIndex + 1) % difficulties.length;
            this.gameState.difficulty = difficulties[currentIndex] as 'easy' | 'normal' | 'hard';
            this.difficultyText.setText(`DIFFICULTY: ${this.gameState.difficulty.toUpperCase()}`);
        });
    }

    private createSoundToggle(x: number, y: number): void {
        this.soundText = this.createButton(x, y, `SOUND: ${this.gameState.soundEnabled ? 'ON' : 'OFF'}`, () => {
            this.gameState.soundEnabled = !this.gameState.soundEnabled;
            this.soundText.setText(`SOUND: ${this.gameState.soundEnabled ? 'ON' : 'OFF'}`);
            // Implement actual sound mute/unmute here later
        });
    }
}
