import * as Phaser from 'phaser';
import {AppColors, phaserColor} from '../scripts/Colors';
import {HEIGHT, WIDTH} from '../scripts/Util';
import {createEnemyTexture, createPlayerTexture, createTowerTexture} from '../scripts/TextureUtils';
import {GameObject} from '../core/GameObject';
import {VisualPulse} from '../components/VisualPulse';

export class LoreScene extends Phaser.Scene {
    private story: string[];
    private currentStep = 0;
    private instructionText!: Phaser.GameObjects.Text;
    private visuals: Phaser.GameObjects.GameObject[] = [];

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

    preload(): void {
        createPlayerTexture(this, 'nexus', 64, AppColors.PLAYER);
        createEnemyTexture(this, 'static', 64, AppColors.SPECIAL_ENEMY);
        createPlayerTexture(this, 'player', 32, AppColors.PLAYER);
        createEnemyTexture(this, 'enemy1', 32, AppColors.ENEMY_NORMAL);
        createEnemyTexture(this, 'enemy2', 32, AppColors.ENEMY_FAST);
        createEnemyTexture(this, 'enemy3', 32, AppColors.ENEMY_TANK);
        createTowerTexture(this, 'tower1', 32, AppColors.TOWER_LASER);
        createTowerTexture(this, 'tower2', 32, AppColors.TOWER_BOMB);
        createTowerTexture(this, 'tower3', 32, AppColors.TOWER_SLOW);
        createEnemyTexture(this, 'specialEnemy', 32, AppColors.SPECIAL_ENEMY);
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
            this.currentStep = 0;
            this.scene.start('MenuScene');
        });
    }

    update(time: number, delta: number): void {
        this.visuals.forEach(v => {
            if (v instanceof GameObject) {
                v.update(time, delta);
            }
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
                padding: {x: 20, y: 10},
                align: 'center',
                wordWrap: {width: WIDTH - 100}
            }).setOrigin(0.5).setDepth(200);

            this.updateVisuals();
            this.currentStep++;
            this.add.text(WIDTH - 250, HEIGHT - 50, 'Press [SPACE] to continue, [ESC] to quit.', {
                font: '16px',
                color: AppColors.UI_TEXT,
                padding: {x: 20, y: 10},
                align: 'center',
                wordWrap: {width: WIDTH - 100}
            }).setOrigin(0.5).setDepth(200);
        } else {
            this.currentStep = 0;
            this.scene.start('Tutorial');
        }
    }

    private updateVisuals(): void {
        switch (this.currentStep) {
            case 1:
                const nexus = this.add.sprite(100, 100, 'nexus').setAlpha(0.5);
                this.visuals.push(nexus);
                break;
            case 2:
                const staticEnemy = this.add.sprite(WIDTH - 100, 100, 'static').setAlpha(0.5);
                this.visuals.push(staticEnemy);
                break;
            case 3:
                const player = new GameObject(this, WIDTH / 4, HEIGHT / 3, 'player').setAlpha(0.5);
                this.visuals.push(player);
                break;
            case 4:
                const enemy1 = this.add.sprite(WIDTH / 2 - 100, HEIGHT * 3 / 4, 'enemy1').setAlpha(0.5);
                const enemy2 = this.add.sprite(WIDTH / 2, HEIGHT * 3 / 4, 'enemy2').setAlpha(0.5);
                const enemy3 = this.add.sprite(WIDTH / 2 + 100, HEIGHT * 3 / 4, 'enemy3').setAlpha(0.5);
                this.visuals.push(enemy1, enemy2, enemy3);
                break;
            case 5:
                const tower1 = this.add.sprite(WIDTH / 2 - 100, HEIGHT * 3 / 4 - 100, 'tower1').setAlpha(0.5);
                const tower2 = this.add.sprite(WIDTH / 2, HEIGHT * 3 / 4 - 100, 'tower2').setAlpha(0.5);
                const tower3 = this.add.sprite(WIDTH / 2 + 100, HEIGHT * 3 / 4 - 100, 'tower3').setAlpha(0.5);
                this.visuals.push(tower1, tower2, tower3);
                break;
            case 6:
                const specialEnemy = this.add.sprite(WIDTH * 3 / 4, HEIGHT / 3, 'specialEnemy').setAlpha(0.5);
                this.visuals.push(specialEnemy);
                break;
            case 7:
                const playerSprite = this.visuals.find(v => (v as GameObject).texture.key === 'player');
                if (playerSprite && playerSprite instanceof GameObject) {
                    playerSprite.setAlpha(1);
                    playerSprite.addComponent(new VisualPulse(phaserColor(AppColors.PLAYER), 200, 1500, 2, 5, 2));
                }
                break;
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

    destroy(): void {
        this.currentStep = 0;
        this.story.length = 0;
        this.instructionText?.destroy();
        this.visuals?.forEach(v => v.destroy());
    }
}
