import * as Phaser from 'phaser';
import { AppColors, phaserColor } from '../scripts/Colors';
import { HEIGHT, WIDTH } from '../scripts/Util';

export class StoryScene extends Phaser.Scene {
    private story: string[] = [];
    private nextScene!: string;
    private currentStep = 0;
    private instructionText!: Phaser.GameObjects.Text;

    constructor() {
        super('StoryScene');
    }

    init(data: { story: string[], nextScene: string }): void {
        this.story = data.story;
        this.nextScene = data.nextScene;
    }

    create(): void {
        this.showNextStep();
        this.createGameVisualSeparators();

        const spaceKeyListener = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spaceKeyListener?.on('down', () => {
            this.showNextStep();
        });

        const escapeKeyListener = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        escapeKeyListener?.on('down', () => {
            this.currentStep = 0;
            this.scene.start('MenuScene');
        });
    }

    private showNextStep(): void {
        if (this.instructionText) {
            this.instructionText.destroy();
        }
        if (this.currentStep < this.story.length) {
            const text = this.story[this.currentStep];
            this.instructionText = this.add.text(WIDTH / 2, HEIGHT / 2, text, {
                font: '32px',
                color: AppColors.UI_TEXT,
                padding: { x: 20, y: 10 },
                align: 'center',
                wordWrap: { width: WIDTH - 100 }
            }).setOrigin(0.5).setDepth(200);

            this.currentStep++;
            this.add.text(WIDTH - 250, HEIGHT - 50, 'Press [SPACE] to continue, [ESC] to quit.', {
                font: '16px',
                color: AppColors.UI_TEXT,
                padding: { x: 20, y: 10 },
                align: 'center',
                wordWrap: { width: WIDTH - 100 }
            }).setOrigin(0.5).setDepth(200);
        } else {
            this.currentStep = 0;
            this.scene.start(this.nextScene);
        }
    }

    private createGameVisualSeparators() {
        const graphics = this.add.graphics();
        graphics.lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1);
        graphics.beginPath();
        graphics.moveTo(0, 0);
        graphics.lineTo(WIDTH, 0);
        graphics.closePath();
        graphics.stroke();

        graphics.lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1);
        graphics.beginPath();
        graphics.moveTo(0, HEIGHT);
        graphics.lineTo(WIDTH, HEIGHT);
        graphics.closePath();
        graphics.stroke();

        graphics.lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1);
        graphics.beginPath();
        graphics.moveTo(WIDTH, 0);
        graphics.lineTo(WIDTH, HEIGHT);
        graphics.closePath();
        graphics.stroke();

        graphics.lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1);
        graphics.beginPath();
        graphics.moveTo(0, 0);
        graphics.lineTo(0, HEIGHT);
        graphics.closePath();
        graphics.stroke();
    }

    shutdown(): void {
        this.story.length = 0;
        this.instructionText?.destroy();
    }
}
