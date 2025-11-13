import * as Phaser from 'phaser';
import {AppColors, phaserColor} from '../scripts/Colors';
import {HEIGHT, WIDTH} from '../scripts/Util';
import {
    createBigGlitchTexture,
    createBigTowerTexture,
    createEnemyTexture,
    createPlayerTexture,
    createSpecialEnemyTexture,
    createTowerTexture
} from '../scripts/TextureUtils';
import {GameObject} from '../core/GameObject';
import {VisualPulse} from '../components/VisualPulse';

export class Introduction extends Phaser.Scene {
    private story: string[];
    private currentStep = 0;
    private instructionText!: Phaser.GameObjects.Text;
    private visuals: Phaser.GameObjects.Sprite[] = [];

    constructor() {
        super('Intro');

        this.story = [
            "In the beginning, there was the Quantum Realm\nA silent, boundless universe of pure data and energy, flowing in seamless waves.",
            "At its heart lay the Nexus, the source of all life and logic.",
            "This tranquility was shattered by the Static.\nA dissonant, corrupting force that gave birth to monstrous Glitches.",
            "You are the Guardian.\nA sentient program created by the Nexus to be its last line of defense.",
            "Your purpose is to protect the Nexus from the encroaching waves of Glitches.",
            "You can manifest Echo Towerss\nThey shoot bullets, bombs or slow the glitches down.",
            "But beware of the Phantoms!\nThey are special Glitches that can corrupt your towers, rendering you defenseless.",
            "Your most powerful ability is the Resonance Wave.\nUse it to revive corrupted towers and disrupt the Phantoms.",
            "The fate of the Quantum Realm is in your hands.\nYou are the last hope!",
        ];
    }

    preload(): void {
        createBigTowerTexture(this, 'nexus', 256, AppColors.NEXUS_OUTER);
        createBigGlitchTexture(this, 'static', 256, AppColors.STATIC_OUTER);
        createPlayerTexture(this, 'player', 24, AppColors.PLAYER);
        createEnemyTexture(this, 'enemy1', 32, AppColors.ENEMY_NORMAL);
        createEnemyTexture(this, 'enemy2', 32, AppColors.ENEMY_FAST);
        createEnemyTexture(this, 'enemy3', 32, AppColors.ENEMY_TANK);
        createTowerTexture(this, 'tower1', 64, AppColors.TOWER_LASER);
        createTowerTexture(this, 'tower2', 64, AppColors.TOWER_BOMB);
        createTowerTexture(this, 'tower3', 64, AppColors.TOWER_SLOW);
        createSpecialEnemyTexture(this, 'specialEnemy', 32, AppColors.SPECIAL_ENEMY);
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
            this.startFinalAnimation();
        }
    }

    private updateVisuals(): void {
        const animateIn = (element: Phaser.GameObjects.Sprite) => {
            const y = element.y;
            element.y = y < HEIGHT / 2 ? -200 : HEIGHT + 200;
            this.tweens.add({
                targets: element,
                y: y,
                duration: 1500,
                ease: 'Power2'
            });
        };

        switch (this.currentStep) {
            case 1:
                const nexus = this.add.sprite(200, 200, 'nexus').setAlpha(0.3);
                animateIn(nexus);
                this.tweens.add({
                    targets: nexus,
                    scaleX: 1.1,
                    scaleY: 1.1,
                    duration: 2000,
                    yoyo: true,
                    repeat: -1
                });
                this.visuals.push(nexus);
                break;
            case 2:
                const staticEnemy = this.add.sprite(WIDTH - 200, 200, 'static').setAlpha(0.3);
                animateIn(staticEnemy);
                this.tweens.add({
                    targets: staticEnemy,
                    scaleX: 1.1,
                    scaleY: 1.1,
                    duration: 1000,
                    yoyo: true,
                    repeat: -1
                });
                this.visuals.push(staticEnemy);
                break;
            case 3:
                const player = new GameObject(this, WIDTH / 3, HEIGHT / 3, 'player').setAlpha(0.8);
                animateIn(player);
                player.addComponent(new VisualPulse(phaserColor(AppColors.PLAYER), 500, 1000, 2, 2, 2));
                this.visuals.push(player);
                break;
            case 4:
                const enemy1 = this.add.sprite(WIDTH / 2 - 100, HEIGHT * 3 / 4, 'enemy1').setAlpha(0.8);
                const enemy2 = this.add.sprite(WIDTH / 2, HEIGHT * 3 / 4, 'enemy2').setAlpha(0.8);
                const enemy3 = this.add.sprite(WIDTH / 2 + 100, HEIGHT * 3 / 4, 'enemy3').setAlpha(0.8);
                [enemy1, enemy2, enemy3].forEach(e => animateIn(e));
                this.visuals.push(enemy1, enemy2, enemy3);
                break;
            case 5:
                const tower1 = this.add.sprite(WIDTH / 2 - 100, HEIGHT * 3 / 4 - 100, 'tower1').setAlpha(0.8);
                const tower2 = this.add.sprite(WIDTH / 2, HEIGHT * 3 / 4 - 100, 'tower2').setAlpha(0.8);
                const tower3 = this.add.sprite(WIDTH / 2 + 100, HEIGHT * 3 / 4 - 100, 'tower3').setAlpha(0.8);
                [tower1, tower2, tower3].forEach(t => animateIn(t));
                this.visuals.push(tower1, tower2, tower3);
                break;
            case 6:
                const phantom = new GameObject(this, WIDTH * 2 / 3, HEIGHT / 3, 'specialEnemy').setAlpha(0.8);
                animateIn(phantom);
                phantom.addComponent(new VisualPulse(phaserColor(AppColors.SPECIAL_ENEMY), 500, 1000, 2, 2, 2));
                this.visuals.push(phantom);
                break;
            case 7:
                const playerSprite = this.visuals.find(v => (v as GameObject).texture.key === 'player');
                if (playerSprite && playerSprite instanceof GameObject) {
                    playerSprite.setAlpha(1);
                    playerSprite.addComponent(new VisualPulse(phaserColor(AppColors.PLAYER), 200, 2000, 2, 5, 2));
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

    shutdown(): void {
        this.currentStep = 0;
        this.story.length = 0;
        this.instructionText?.destroy();
        this.visuals?.forEach(v => v.destroy());
        this.textures.remove('nexus');
        this.textures.remove('static');
        this.textures.remove('player');
        this.textures.remove('enemy1');
        this.textures.remove('enemy2');
        this.textures.remove('enemy3');
        this.textures.remove('tower1');
        this.textures.remove('tower2');
        this.textures.remove('tower3');
        this.textures.remove('specialEnemy');
    }

    private startFinalAnimation(): void {
        if (this.instructionText) {
            this.instructionText.destroy();
        }

        const playerSprite = this.visuals.find(v => (v as GameObject).texture.key === 'player');
        const specialEnemySprite = this.visuals.find(v => (v as GameObject).texture.key === 'specialEnemy');

        this.animateElementsOffScreen(playerSprite, specialEnemySprite);

        if (!playerSprite || !specialEnemySprite) {
            this.scene.start('MenuScene');
            return;
        }

        const centerX = WIDTH / 2;
        const centerY = HEIGHT / 2;

        this.tweens.add({
            targets: [playerSprite, specialEnemySprite],
            x: centerX,
            y: centerY,
            scale: 3,
            duration: 2000,
            ease: 'Power2',
            rotation: Math.PI * 2,
            onComplete: () => {
                this.tweens.add({
                    targets: specialEnemySprite,
                    alpha: 0,
                    scale: 0,
                    duration: 1000,
                    ease: 'Power2',
                    onComplete: () => {
                        specialEnemySprite.destroy();
                        this.tweens.add({
                            targets: playerSprite,
                            scale: 3,
                            alpha: 1,
                            duration: 500,
                            onComplete: () => {
                                this.time.delayedCall(1000, () => {
                                    this.tweens.add({
                                        targets: playerSprite,
                                        alpha: 0,
                                        duration: 1000,
                                        ease: 'Power1',
                                        onComplete: () => {
                                            this.scene.start('Tutorial');
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    private animateElementsOffScreen(playerSprite: Phaser.GameObjects.GameObject | undefined, specialEnemySprite: Phaser.GameObjects.GameObject | undefined) {
        this.visuals.forEach(v => {
            if (v !== playerSprite && v !== specialEnemySprite) {
                this.tweens.add({
                    targets: v,
                    y: v.y < HEIGHT / 2 ? -200 : HEIGHT + 200,
                    duration: 3000,
                    ease: 'Power2',
                    onComplete: () => v.destroy()
                });
            }
        });
    }
}
