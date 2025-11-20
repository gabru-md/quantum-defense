import { Component } from '../core/Component';
import * as Phaser from 'phaser';
import { AppColors } from '../scripts/Colors';

export class Hoverable extends Component {
    private helpText: string;
    private helpTextObject: Phaser.GameObjects.Text | null = null;

    constructor(helpText: string) {
        super();
        this.helpText = helpText;
    }

    public start(): void {
        this.gameObject.setInteractive();
        this.gameObject.on('pointerover', this.onPointerOver, this);
        this.gameObject.on('pointerout', this.onPointerOut, this);
    }

    private onPointerOver(): void {
        if (this.helpTextObject) {
            return;
        }
        const x = this.gameObject.x;
        const y = this.gameObject.y + this.gameObject.height / 2 + 15;

        this.helpTextObject = this.gameObject.scene.add.text(x, y, this.helpText, {
            font: '12px',
            color: AppColors.UI_TEXT,
            padding: { x: 5, y: 3 }
        }).setOrigin(0.5).setDepth(1000);
    }

    private onPointerOut(): void {
        if (this.helpTextObject) {
            this.helpTextObject.destroy();
            this.helpTextObject = null;
        }
    }

    public destroy(): void {
        if (this.gameObject.scene) {
            this.gameObject.off('pointerover', this.onPointerOver, this);
            this.gameObject.off('pointerout', this.onPointerOut, this);
        }
        if (this.helpTextObject) {
            this.helpTextObject.destroy();
            this.helpTextObject = null;
        }
    }
}
