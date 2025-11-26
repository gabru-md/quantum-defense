// src/game/core/TextButton.ts
import Phaser from 'phaser';
import { AppColors } from '../scripts/Colors';
import {Level} from "../scenes/lib/Level.ts";

export class TextButton extends Phaser.GameObjects.Text {
    constructor(scene: Phaser.Scene, x: number, y: number, text: string, callback: () => void) {
        super(scene, x, y, text, {
            fontSize: '32px',
            color: AppColors.UI_TEXT,
            align: 'center',
            padding: { x: 10, y: 5 },
            // backgroundColor: AppColors.UI_MESSAGE_BACKGROUND
        });

        this.setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => this.enterButtonHoverState())
            .on('pointerout', () => this.enterButtonRestState())
            .on('pointerdown', () => this.enterButtonActiveState())
            .on('pointerup', () => {
                this.enterButtonHoverState();
                callback();
            });
    }

    private enterButtonHoverState() {
        this.setStyle({ fill: AppColors.UI_ACCENT });
        (this.scene as Level).audioManager.playSfx('navigating_fx');
    }

    private enterButtonRestState() {
        this.setStyle({ fill: AppColors.UI_TEXT });
    }

    private enterButtonActiveState() {
        this.setStyle({ fill: AppColors.UI_ACCENT });
    }
}