import * as Phaser from 'phaser';
import { AppColors } from '../scripts/Colors';
import { GAME_HEIGHT, GAME_WIDTH } from '../scripts/util';

export class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CreditsScene' });
    }

    create(): void {
        this.cameras.main.setBackgroundColor(AppColors.GAME_BACKGROUND);

        this.add.text(GAME_WIDTH / 2, 100, 'CREDITS', {
            font: '64px Roboto',
            color: AppColors.UI_ACCENT,
            align: 'center'
        }).setOrigin(0.5);

        const creditsText = 
            "Game Design & Development:\nGemini AI\n\n" +
            "Framework & Core Logic:\nGemini AI\n\n" +
            "Visuals & UI:\nGemini AI\n\n" +
            "Special Thanks:\nUser for the awesome ideas and patience!";

        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, creditsText, {
            font: '32px Roboto',
            color: AppColors.UI_TEXT,
            align: 'center',
            lineSpacing: 15
        }).setOrigin(0.5);

        // Back Button
        const backButton = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 100, 'BACK TO MENU', {
            font: '36px Roboto',
            color: AppColors.UI_TEXT,
            backgroundColor: AppColors.UI_PRIMARY_BG,
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        backButton.on('pointerover', () => backButton.setColor(AppColors.UI_ACCENT.toString()));
        backButton.on('pointerout', () => backButton.setColor(AppColors.UI_TEXT));
        backButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}
