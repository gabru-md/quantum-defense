import * as Phaser from 'phaser';
import {AppColors, phaserColor} from '../scripts/Colors';
import {HEIGHT, WIDTH} from '../scripts/Util';
import {
    createBigGlitchTexture,
    createBigTowerTexture,
    createEnemyTexture,
    createPlayerTexture,
    createSpecialEnemyTexture,
    createTowerTexture,
} from '../scripts/TextureUtils';
import {GameObject} from '../core/GameObject';
import {VisualPulse} from '../components/VisualPulse';
import {BaseStoryScene, StoryStep} from './lib/BaseStoryScene';
import {getStoryName, LevelNames} from "./lib/LevelNames.ts";

export class Introduction extends BaseStoryScene {
    constructor() {
        super(getStoryName(LevelNames.Introduction));
    }

    preload(): void {
        super.preload();
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

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: string } {
        return {
            title: 'The Quantum Realm Saga',
            nextScene: LevelNames.Introduction,
            steps: [
                {
                    text: 'In the beginning, there was the Quantum Realm\nA silent, boundless universe of pure data and energy,\nflowing in seamless waves.',
                },
                {
                    text: 'At its heart lay the Nexus, the source of all life and logic.',
                    action: (scene) => {
                        const nexus = scene.add.sprite(200, 200, 'nexus').setAlpha(0.3);
                        this.animateIn(nexus);
                        scene.tweens.add({
                            targets: nexus,
                            scaleX: 1.1,
                            scaleY: 1.1,
                            duration: 2000,
                            yoyo: true,
                            repeat: -1,
                        });
                        return nexus;
                    },
                },
                {
                    text: 'This tranquility was shattered by the Static.\nA dissonant, corrupting force that gave birth to monstrous Glitches.',
                    action: (scene) => {
                        const staticEnemy = scene.add.sprite(WIDTH - 200, 200, 'static').setAlpha(0.3);
                        this.animateIn(staticEnemy);
                        scene.tweens.add({
                            targets: staticEnemy,
                            scaleX: 1.1,
                            scaleY: 1.1,
                            duration: 1000,
                            yoyo: true,
                            repeat: -1,
                        });
                        return staticEnemy;
                    },
                },
                {
                    text: 'You are Guardian: The Sentient\nCreated by the Nexus to be its last line of defense.',
                    action: (scene) => {
                        const player = new GameObject(scene, WIDTH / 3, HEIGHT / 3, 'player');
                        this.animateIn(player);
                        player.addComponent(new VisualPulse(phaserColor(AppColors.PLAYER), 500, 1000, 2, 2, 2));
                        return player;
                    },
                },
                {
                    text: 'Protect the Nexus from the encroaching waves of Static Glitches.',
                    action: (scene) => {
                        const enemy1 = scene.add.sprite(WIDTH / 2 - 100, (HEIGHT * 3) / 4, 'enemy1').setAlpha(0.8);
                        const enemy2 = scene.add.sprite(WIDTH / 2, (HEIGHT * 3) / 4, 'enemy2').setAlpha(0.8);
                        const enemy3 = scene.add.sprite(WIDTH / 2 + 100, (HEIGHT * 3) / 4, 'enemy3').setAlpha(0.8);
                        [enemy1, enemy2, enemy3].forEach(t => this.animateIn(t));
                        return [enemy1, enemy2, enemy3];
                    }
                },
                {
                    text: 'You can build Echo Towers\nThey shoot bullets, bombs or slow the glitches down.',
                    action: (scene) => {
                        const tower1 = scene.add.sprite(WIDTH / 2 - 100, (HEIGHT * 3) / 4 - 100, 'tower1').setAlpha(0.8);
                        const tower2 = scene.add.sprite(WIDTH / 2, (HEIGHT * 3) / 4 - 100, 'tower2').setAlpha(0.8);
                        const tower3 = scene.add.sprite(WIDTH / 2 + 100, (HEIGHT * 3) / 4 - 100, 'tower3').setAlpha(0.8);
                        [tower1, tower2, tower3].forEach(t => this.animateIn(t));
                        return [tower1, tower2, tower3];
                    },
                },
                {
                    text: 'But beware of the Phantoms!\nThey are special Wave Glitches.\nThey can corrupt your towers,\nrendering you defenseless.',
                    action: (scene) => {
                        const phantom = new GameObject(scene, (WIDTH * 2) / 3, HEIGHT / 3, 'specialEnemy').setAlpha(0.8);
                        this.animateIn(phantom);
                        phantom.addComponent(
                            new VisualPulse(phaserColor(AppColors.SPECIAL_ENEMY), 500, 1000, 2, 2, 2)
                        );
                        return phantom;
                    },
                },
                {
                    text: 'Your most powerful ability is the Resonance Wave.\nUse it to revive corrupted towers and disrupt the Phantoms.',
                    action: (scene) => {
                        const playerSprite = (scene as Introduction).visuals.find(v => (v as GameObject).texture.key === 'player');
                        if (playerSprite && playerSprite instanceof GameObject) {
                            playerSprite.setAlpha(1);
                            playerSprite.addComponent(
                                new VisualPulse(phaserColor(AppColors.PLAYER), 200, 2000, 2, 5, 2)
                            );
                        }
                    },
                },
                {text: 'The fate of the Quantum Realm is in your hands.\nYou are the last hope!'},
            ],
        };
    }

    onStoryComplete(): void {
        this.startFinalAnimation();
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
                                            this.scene.start(LevelNames.Introduction);
                                        },
                                    });
                                });
                            },
                        });
                    },
                });
            },
        });
    }

    protected animateElementsOffScreen(
        playerSprite?: Phaser.GameObjects.GameObject | undefined,
        specialEnemySprite?: Phaser.GameObjects.GameObject | undefined
    ) {
        this.visuals.forEach(v => {
            if (v !== playerSprite && v !== specialEnemySprite) {
                // @ts-ignore
                this.animateOut(v);
            }
        });
    }


    shutdown(): void {
        super.shutdown();
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
}
