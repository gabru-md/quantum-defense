import * as Phaser from 'phaser';
import { HudManager } from './manager/HudManager.ts';
import { WaveManager } from './manager/WaveManager.ts';
import { State } from './State.ts';
import { CollisionManager } from './manager/CollisionManager.ts';
import { TowerManager } from './manager/TowerManager.ts';
import { PathsManager } from './manager/PathsManager.ts';
import { PlayerManager } from './manager/PlayerManager.ts';
import {EXIT_TO_MENU, GAME_HEIGHT, GAME_WIDTH} from '../../scripts/Util.ts';
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
import { LevelNames } from './LevelNames.ts';
import { BackgroundEffectsManager } from '../../effects/BackgroundEffectsManager.ts';
import {Rift, RiftType} from "../../entities/Rift.ts";
import {RiftWave} from "../../entities/RiftWave.ts";
import {QuantumEcho} from "../../entities/QuantumEcho.ts";
import {GlitchAnnihilationEffect} from "../../effects/GlitchAnnihilationEffect.ts";

export abstract class Level extends Phaser.Scene {
    hud: HudManager;
    waveManager: WaveManager;
    collisionManager: CollisionManager;
    state!: State;
    towerManager: TowerManager;
    pathsManager: PathsManager;
    playerManager: PlayerManager;
    audioManager: AudioManager;
    backgroundEffectsManager: BackgroundEffectsManager;
    glitchManager: GlitchAnnihilationEffect;
    isLoaded: boolean = false;
    protected levelElements: Phaser.GameObjects.GameObject[] = [];
    public rifts!: Phaser.GameObjects.Group;
    public riftWaves!: Phaser.GameObjects.Group;
    public quantumEchoes!: Phaser.GameObjects.Group;

    abstract getWaveConfig(wave: number): {
        type: string;
        texture: string;
        count: number;
        delay: number;
        health: number;
        speed: number;
        energyValue: number;
        path: string;
    }[];

    abstract definePaths(): { [key: string]: Phaser.Curves.Path };

    abstract nextScene(): LevelNames;

    public fetchNextScene(): LevelNames {
        let nextScene = this.nextScene();
        if(EXIT_TO_MENU) {
            nextScene = LevelNames.MainMenu;
        }
        return nextScene;
    }

    isPositionBuildable(x: number, y: number): { buildable: boolean; reason?: string } {
        for (const rift of this.rifts.getChildren() as Rift[]) {
            const distance = Phaser.Math.Distance.Between(x, y, rift.x, rift.y);
            if (distance < 100 * rift.scaleFactor) { // Use scaleFactor from rift
                return {buildable: false, reason: 'Too close to a rift!'};
            }
        }
        return {buildable: true};
    }

    protected constructor(key: LevelNames) {
        super({ key });
    }

    init(): void {
        this.state = this.sys.registry.get('gameState');
        if (!this.state) {
            this.state = new State(100, 350, this.scene.key);
            this.sys.registry.set('gameState', this.state);
        }

        this.hud = new HudManager(this);
        this.waveManager = new WaveManager(this);
        this.collisionManager = new CollisionManager(this);
        this.towerManager = new TowerManager(this);
        this.pathsManager = new PathsManager(this);
        this.playerManager = new PlayerManager(this);
        this.audioManager = new AudioManager(this);
        this.backgroundEffectsManager = new BackgroundEffectsManager(this);
        this.glitchManager = new GlitchAnnihilationEffect(this);

        this.state.level = this.scene.key;
        this.state.baseHealth = 100;
        this.state.energy = 350;
    }

    public preload(): void {
        this.createTextures();
        this.audioManager.setup();
    }

    public create(): void {
        this.physics.resume();
        this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);

        this.backgroundEffectsManager.start();

        this.rifts = this.add.group({ classType: Rift, runChildUpdate: true });
        this.riftWaves = this.add.group({ classType: RiftWave, runChildUpdate: true });
        this.quantumEchoes = this.add.group({ classType: QuantumEcho, runChildUpdate: true });

        const hudElements = this.hud.setup();
        const pathElements = this.pathsManager.setup();
        const player = this.playerManager.setup();
        this.towerManager.setup();
        this.waveManager.setup();

        this.collisionManager.setup();

        this.animateGameElements(hudElements, pathElements, player);

        // @ts-ignore
        this.input.keyboard.on('keydown-ESC', () => {
            this.easeOutAndStartNextScene(LevelNames.MainMenu);
        });

        this.events.on('gameOver', this.handleGameOver, this);
        this.events.on('shutdown', this.shutdown, this);
    }

    protected createRift(x: number, y: number, type: RiftType): Rift {
        const rift = new Rift(this, x, y, type);
        this.rifts.add(rift);
        return rift;
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
            path: Phaser.GameObjects.Graphics[];
            start: Phaser.GameObjects.Graphics[];
            end: Phaser.GameObjects.Graphics[];
        },
        player: Phaser.GameObjects.GameObject
    ) {
        const levelSpecificElements = this.getLevelSpecificElements();

        this.levelElements = [
            ...hudElements.stats,
            ...hudElements.towers,
            ...hudElements.help,
            ...hudElements.separators,
            ...pathElements.path,
            ...pathElements.start,
            ...pathElements.end,
            player,
            ...hudElements.hudSeparators,
            ...(levelSpecificElements || [])
        ];

        // @ts-ignore
        this.levelElements.forEach((el) => (el as Phaser.GameObjects.GameObject).setAlpha(0));

        let delay = 0;
        const fadeIn = (elements: Phaser.GameObjects.GameObject[] | Phaser.GameObjects.GameObject, duration = 250) => {
            if (!elements || (Array.isArray(elements) && elements.length === 0)) {
                return;
            }
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

        fadeIn(hudElements.separators);
        fadeIn(hudElements.hudSeparators, 0);
        fadeIn(hudElements.stats, 0);
        fadeIn(hudElements.towers, 0);
        fadeIn(hudElements.help, 0);
        fadeIn(player);
        fadeIn(pathElements.start);
        fadeIn(pathElements.end);
        fadeIn(pathElements.path);
        fadeIn(levelSpecificElements!);


        this.time.delayedCall(delay, () => {
            this.isLoaded = true;
            if (this.scene.key !== LevelNames.Gameplay_Tutorial) {
                this.time.delayedCall(2000, () => {
                    this.hud.info('Incoming First Wave', AppColors.UI_MESSAGE_ERROR, () => {
                        this.waveManager.startWave(1);
                    });
                });
            }
        });
    }

    protected getLevelSpecificElements(): Phaser.GameObjects.GameObject[] | undefined {
        return undefined;
    }

    public update(time: number, delta: number): void {
        if (!this.isLoaded || this.waveManager.gameOver) return;
        if (this.scene.key !== LevelNames.Gameplay_Tutorial) {
            this.waveManager.update(time, delta);
        }
        this.towerManager.update(time, delta);
        this.playerManager.update(time, delta);
        this.hud.update();
        this.rifts.getChildren().forEach(rift => rift.update(time, delta));
    }

    private handleGameOver(): void {
        if (this.waveManager.gameOver) return;
        this.waveManager.gameOver = true;
        this.physics.pause();
        this.hud.info('GAME OVER!', AppColors.UI_MESSAGE_ERROR, () => {
            this.easeOutAndStartNextScene(this.scene.key as LevelNames);
        });
    }

    easeOutAndStartNextScene(sceneKey: LevelNames): void {
        const allActiveElements: Phaser.GameObjects.GameObject[] = [
            ...this.levelElements,
            ...this.towerManager.towers.getChildren(),
            ...this.towerManager.bullets.getChildren(),
            ...this.towerManager.bombs.getChildren(),
            ...this.waveManager.enemies.getChildren(),
            ...this.waveManager.specialEnemies.getChildren(),
            ...this.rifts.getChildren(),
            ...this.riftWaves.getChildren(),
            ...this.quantumEchoes.getChildren(),
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



    protected shutdown(): void {
        this.waveManager.destroy();
        this.towerManager.destroy();
        this.hud.destroy();
        this.audioManager.destroy();
        this.backgroundEffectsManager.stop();
    }

    private createTextures(): void {
        createEnemyTexture(this, 'enemy1', 32, AppColors.ENEMY_NORMAL);
        createEnemyTexture(this, 'enemy2', 24, AppColors.ENEMY_FAST);
        createEnemyTexture(this, 'enemy3', 40, AppColors.ENEMY_TANK);
        createTowerTexture(this, 'tower1', 32, AppColors.TOWER_LASER);
        createTowerTexture(this, 'tower2', 32, AppColors.TOWER_BOMB);
        createTowerTexture(this, 'tower3', 32, AppColors.TOWER_SLOW);
        createBulletTexture(this, 'bullet', 10, AppColors.BULLET_LASER);
        createBombTexture(this, 'bomb', 16, AppColors.BULLET_BOMB);
        createPlayerTexture(this, 'player', 24, AppColors.PLAYER);
        createSpecialEnemyTexture(this, 'specialEnemy', 24, AppColors.SPECIAL_ENEMY);
        createPlaceholderTexture(this, 'towerSlot', 32, 32, AppColors.UI_DISABLED);
        createRangePreviewTexture(this, 'rangePreview', 300, 'rgba(255, 255, 255, 0.05)');
    }
}
