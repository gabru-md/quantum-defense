import * as Phaser from 'phaser';
import {AppColors, phaserColor} from '../scripts/Colors';
import {GAME_HEIGHT, GAME_WIDTH, HEIGHT, WIDTH} from '../scripts/Util';

export class LoreScene extends Phaser.Scene {
    private story: string[];
    private currentStep = 0;
    private instructionText!: Phaser.GameObjects.Text;

    constructor() {
        super('LoreScene');

        this.story = [
            "In the beginning, there was the Quantum Realm\nA silent, boundless universe of pure data and energy, flowing in seamless waves.",
            "At its heart lay the Nexus, the source of all life and logic.",
            "This tranquility was shattered by the Static.\nA dissonant, corrupting force that gave birth to monstrous Glitches.",
            "You are the Guardian.\nA sentient program created by the Nexus to be its last line of defense.",
            "Your purpose is to protect the Nexus from the encroaching waves of Glitches.",
            "You can manifest Echo Towers\nThey shoot bullets, bombs or slow the glitches down.",
            "But beware of the Phantoms!\nThey are special Glitches that can corrupt your towers, rendering you defenseless.",
            "Your most powerful ability is the Resonance Wave.\nUse it to revive corrupted towers and disrupt the Phantoms.",
            "The fate of the Quantum Realm is in your hands.\nYou are the last hope!",
        ];
    }

    create(): void {
        this.showNextStep();
        this.createGameVisualSeparators();

        // @ts-ignore
        const spaceKeyListener = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spaceKeyListener.on('down', () => {
            this.showNextStep();
        });

        // @ts-ignore
        const escapeKeyListener = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        escapeKeyListener.on('down', () => {
            this.scene.start('MenuScene');
        });
    }

    private showNextStep(): void {
        if (this.instructionText) {
            this.instructionText.destroy();
        }

        if (this.currentStep < this.story.length) {
            const text = this.story[this.currentStep];
            this.instructionText = this.add.text(WIDTH / 2, GAME_HEIGHT / 2, text, {
                font: '32px',
                color: AppColors.UI_TEXT,
                padding: {x: 20, y: 10},
                align: 'center',
                wordWrap: {width: GAME_WIDTH - 100}
            }).setOrigin(0.5).setDepth(200);

            this.currentStep++;
            this.add.text(WIDTH - 250, HEIGHT - 50, 'Press [SPACE] to continue, [ESC] to quit.', {
                font: '16px',
                color: AppColors.UI_TEXT,
                padding: {x: 20, y: 10},
                align: 'center',
                wordWrap: {width: GAME_WIDTH - 100}
            }).setOrigin(0.5).setDepth(200);
        } else {
            this.scene.start('Tutorial');
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
}
