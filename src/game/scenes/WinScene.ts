import * as Phaser from 'phaser';
import { AppColors, phaserColor } from '../scripts/Colors';
import { GAME_HEIGHT, WIDTH } from '../scripts/Util';
import {LevelNames} from "./lib/LevelNames.ts";

export class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WinScene' });
    }

    create(): void {
        this.cameras.main.setBackgroundColor(AppColors.GAME_BACKGROUND);

        this.add
            .graphics()
            .lineStyle(5, phaserColor(AppColors.UI_ACCENT), 1)
            .strokeRect(0, 0, WIDTH, GAME_HEIGHT)
            .setDepth(0);

        this.add
            .text(WIDTH / 2, 200, 'CONGRATULATIONS!', {
                font: '80px',
                color: AppColors.UI_ACCENT,
                align: 'center',
            })
            .setOrigin(0.5);

        this.add
            .text(WIDTH / 2, 400, 'You have successfully defended the quantum realm.', {
                font: '32px',
                color: AppColors.UI_TEXT,
                align: 'center',
            })
            .setOrigin(0.5);

        const backButton = this.add
            .text(WIDTH / 2, 600, 'BACK TO MENU', {
                font: '36px',
                color: AppColors.UI_TEXT,
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive();

        backButton.on('pointerover', () => backButton.setColor(AppColors.UI_ACCENT));
        backButton.on('pointerout', () => backButton.setColor(AppColors.UI_TEXT));
        backButton.on('pointerdown', () => {
            this.scene.start(LevelNames.MainMenu);
        });
    }
}
