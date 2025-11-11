import * as Phaser from 'phaser';
import {AppColors, phaserColor} from '../scripts/Colors';
import {GAME_HEIGHT, WIDTH} from '../scripts/Util';

export class CreditsScene extends Phaser.Scene {
    constructor() {
        super({key: 'CreditsScene'});
    }

    create(): void {
        this.cameras.main.setBackgroundColor(AppColors.GAME_BACKGROUND);

        // --- Full-screen Stroke Panel ---
        this.add.graphics()
            .lineStyle(5, phaserColor(AppColors.UI_SEPARATOR), 1)
            .strokeRect(0, 0, WIDTH, GAME_HEIGHT)
            .setDepth(0);

        // --- Credits Title ---
        this.add.text(WIDTH / 2, 100, 'CREDITS', {
            font: '64px',
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

        // --- Credits Panel ---
        const panelWidth = 800;
        const panelHeight = 500;
        const panelX = WIDTH / 2;
        const panelY = GAME_HEIGHT / 2;

        const panelGraphics = this.add.graphics();
        panelGraphics.fillRect(panelX - panelWidth / 2, panelY - panelHeight / 2, panelWidth, panelHeight);
        panelGraphics.lineStyle(2, phaserColor(AppColors.UI_ACCENT), 1);
        panelGraphics.strokeRect(panelX - panelWidth / 2, panelY - panelHeight / 2, panelWidth, panelHeight);

        const creditsText =
            "Game Design & Development:\nManish Devgan\n\n" +
            "https://github.com/gabru-md";

        this.add.text(panelX, panelY - panelHeight / 2 + 200, creditsText, {
            font: '32px',
            color: AppColors.UI_TEXT,
            align: 'center',
            lineSpacing: 15,
            wordWrap: {width: panelWidth - 40}
        }).setOrigin(0.5);

        // --- Back Button ---
        this.createButton(WIDTH / 2, GAME_HEIGHT - 100, 'BACK TO MENU', () => {
            this.scene.start('MenuScene');
        });
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
}
