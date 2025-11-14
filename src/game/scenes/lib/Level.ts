import * as Phaser from 'phaser';
import { HudManager } from './manager/HudManager.ts';
import { WaveManager } from './manager/WaveManager.ts';
import { State } from './State.ts';
import { CollisionManager } from './manager/CollisionManager.ts';
import { TowerManager } from './manager/TowerManager.ts';
import { PathsManager } from './manager/PathsManager.ts';
import { PlayerManager } from './manager/PlayerManager.ts';
import { GAME_HEIGHT, GAME_WIDTH } from '../../scripts/Util.ts';
import { AppColors } from '../../scripts/Colors.ts';
import { AudioManager } from './manager/AudioManager.ts';
import {
    createBombTexture,
    createBulletTexture,
    createEnemyTexture,
    createPlaceholderTexture,
    createPlayerTexture,
    createRangePreviewTexture,
    createSpecialEnemyTexture,
    createTowerTexture,
} from '../../scripts/TextureUtils';
import { GameObject } from '../../core/GameObject.ts';
import { LevelNames } from './LevelNames.ts';

export abstract class Level extends Phaser.Scene {
    hud: HudManager;
    waveManager: WaveManager;
    collisionManager: CollisionManager;
    state!: State;
    towerManager: TowerManager;
    pathsManager: PathsManager;
    playerManager: PlayerManager;
    audioManager: AudioManager;
    isLoaded: boolean = false;
    protected levelElements: Phaser.GameObjects.GameObject[] = []; // Stores static elements for fade in/out

    abstract getWaveConfig(wave: number): {
        type: string;
        texture: string;
        count: number;
        delay: number;
        health: number;
        speed: number;
        moneyValue: number;
        path: string;
    }[];

    abstract nextScene(): string;

    abstract definePaths(): { [key: string]: Phaser.Curves.Path };

    protected constructor(key: string) {
        super({ key });
        this.hud = new HudManager(this);
        this.waveManager = new WaveManager(this);
        this.collisionManager = new CollisionManager(this);
        this.towerManager = new TowerManager(this);
        this.pathsManager = new PathsManager(this);
        this.playerManager = new PlayerManager(this);
        this.audioManager = new AudioManager(this);
    }

    init(): void {
        if (this.scene.key === LevelNames.Introduction) {
            this.state = new State(100, 1000, this.scene.key);
        } else {
            this.state = new State(100, 350, this.scene.key);
        }
        this.state.level = this.scene.key;
    }

    public preload(): void {
        this.createTextures();
        this.audioManager.setup();
    }

    public create(): void {
        this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);

        const hudElements = this.hud.setup();
        const pathElements = this.pathsManager.setup();
        const player = this.playerManager.setup();
        // @ts-ignore
        const towerGroups = this.towerManager.setup();
        // @ts-ignore
        const waveGroups = this.waveManager.setup(); // Not directly used in animateGameElements for initial setup, but passed for completeness

        this.collisionManager.setup();

        this.animateGameElements(hudElements, pathElements, player); // Pass only static elements for initial animation

        // @ts-ignore
        this.input.keyboard.on('keydown-ESC', () => {
            this.easeOutAndStartNextScene('MenuScene');
        });

        this.events.on('gameOver', this.handleGameOver, this);

        this.events.on('shutdown', this.shutdown, this);
    }

    private animateGameElements(
        hudElements: {
            stats: Phaser.GameObjects.GameObject[];
            towers: Phaser.GameObjects.GameObject[];
            help: Phaser.GameObjects.GameObject[];
            separators: Phaser.GameObjects.Graphics[];
            hudSeparators: Phaser.GameObjects.Graphics[];
        },
        pathElements: {
            path: Phaser.GameObjects.Graphics;
            start: Phaser.GameObjects.GameObject[];
            end: Phaser.GameObjects.GameObject[];
        },
        player: Phaser.GameObjects.GameObject
    ) {
        // Populate levelElements with static, persistent game objects
        this.levelElements = [
            ...hudElements.stats,
            ...hudElements.towers,
            ...hudElements.help,
            ...hudElements.separators,
            pathElements.path,
            ...pathElements.start,
            ...pathElements.end,
            player,
            ...hudElements.hudSeparators,
        ];

        // Set initial alpha to 0 for all elements that will fade in
        this.levelElements.forEach((el) => (el as GameObject).setAlpha(0));

        let delay = 0;
        const fadeIn = (elements: Phaser.GameObjects.GameObject[] | Phaser.GameObjects.GameObject, duration = 100) => {
            this.time.delayedCall(delay, () => {
                this.tweens.add({
                    targets: elements,
                    alpha: 1,
                    duration: duration,
                    ease: 'Power2',
                });
            });
            delay += duration;
        };

        // Apply fade-in to the static elements
        fadeIn(hudElements.separators);
        fadeIn(player);
        fadeIn(pathElements.path);
        fadeIn(pathElements.start);
        fadeIn(pathElements.end);
        fadeIn(hudElements.hudSeparators);
        fadeIn(hudElements.stats);
        fadeIn(hudElements.towers);
        fadeIn(hudElements.help);

        this.time.delayedCall(delay, () => {
            this.isLoaded = true;
            if (this.scene.key !== LevelNames.Introduction) {
                this.time.delayedCall(2000, () => {
                    this.hud.info('Incoming First Wave', AppColors.UI_MESSAGE_ERROR, () => {
                        this.waveManager.startWave(1);
                    });
                });
            }
        });
    }

    public update(time: number, delta: number): void {
        if (!this.isLoaded) return;
        if (this.scene.key !== LevelNames.Introduction) {
            this.waveManager.update(time, delta);
        }
        this.towerManager.update(time, delta);
        this.playerManager.update(time, delta);
        this.hud.update();
    }

    private handleGameOver(): void {
        this.waveManager.gameOver = true;
        this.physics.pause();
        this.hud.info('GAME OVER!', AppColors.UI_MESSAGE_ERROR, () => {
            this.easeOutAndStartNextScene(this.scene.key); // Restart current level
        });
    }

    easeOutAndStartNextScene(sceneKey: string): void {
        // Gather all active game objects
        const allActiveElements: Phaser.GameObjects.GameObject[] = [
            ...this.levelElements, // Static UI, paths, player
            ...this.towerManager.towers.getChildren(),
            ...this.towerManager.bullets.getChildren(),
            ...this.towerManager.bombs.getChildren(),
            ...this.waveManager.enemies.getChildren(),
            ...this.waveManager.specialEnemies.getChildren(),
        ];

        this.tweens.add({
            targets: allActiveElements,
            alpha: 0,
            ease: 'Power2',
            duration: 500,
            onComplete: () => {
                this.scene.stop(this.scene.key);
                this.scene.start(sceneKey);
            },
        });
    }

    private shutdown(): void {
        this.textures.remove('player');
        this.textures.remove('enemy1');
        this.textures.remove('enemy2');
        this.textures.remove('enemy3');
        this.textures.remove('tower1');
        this.textures.remove('tower2');
        this.textures.remove('tower3');
        this.textures.remove('bullet');
        this.textures.remove('bomb');
        this.textures.remove('towerSlot');
        this.textures.remove('rangePreview');
        this.textures.remove('specialEnemy');

        this.waveManager.destroy();
        this.towerManager.destroy();
        this.hud.destroy();
        this.audioManager.destroy();
    }

    private createTextures(): void {
        // --- Enemies ---
        createEnemyTexture(this, 'enemy1', 32, AppColors.ENEMY_NORMAL);
        createEnemyTexture(this, 'enemy2', 24, AppColors.ENEMY_FAST);
        createEnemyTexture(this, 'enemy3', 40, AppColors.ENEMY_TANK);

        // --- Towers ---
        createTowerTexture(this, 'tower1', 32, AppColors.TOWER_LASER);
        createTowerTexture(this, 'tower2', 32, AppColors.TOWER_BOMB);
        createTowerTexture(this, 'tower3', 32, AppColors.TOWER_SLOW);

        // --- Projectiles ---
        createBulletTexture(this, 'bullet', 10, AppColors.BULLET_LASER);
        createBombTexture(this, 'bomb', 16, AppColors.BULLET_BOMB);

        // --- Player & Special Enemy ---
        createPlayerTexture(this, 'player', 24, AppColors.PLAYER);
        createSpecialEnemyTexture(this, 'specialEnemy', 24, AppColors.SPECIAL_ENEMY);

        // --- UI & Effects ---
        createPlaceholderTexture(this, 'towerSlot', 32, 32, AppColors.UI_DISABLED);
        createRangePreviewTexture(this, 'rangePreview', 300, 'rgba(255, 255, 255, 0.05)');
    }
}
