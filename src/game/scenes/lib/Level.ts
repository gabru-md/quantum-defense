import * as Phaser from 'phaser';
import {HudManager} from "./manager/HudManager.ts";
import {WaveManager} from "./manager/WaveManager.ts";
import {State} from "./State.ts";
import {CollisionManager} from "./manager/CollisionManager.ts";
import {TowerManager} from "./manager/TowerManager.ts";
import {TextureManager} from "./manager/TextureManager.ts";
import {PathsManager} from "./manager/PathsManager.ts";
import {PlayerManager} from "./manager/PlayerManager.ts";
import {GAME_HEIGHT, GAME_WIDTH} from "../../scripts/Util.ts";
import {AppColors} from "../../scripts/Colors.ts";
import {AudioManager} from "./manager/AudioManager.ts"; // Import AudioManager

export abstract class Level extends Phaser.Scene {
    hud: HudManager;
    waveManager: WaveManager;
    collisionManager: CollisionManager;
    state!: State;
    towerManager: TowerManager;
    textureLoader: TextureManager;
    pathsManager: PathsManager;
    playerManager: PlayerManager;
    audioManager: AudioManager; // Add audioManager property

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
        super({key});
        this.hud = new HudManager(this);
        this.waveManager = new WaveManager(this);
        this.collisionManager = new CollisionManager(this);
        this.towerManager = new TowerManager(this);
        this.textureLoader = new TextureManager(this);
        this.pathsManager = new PathsManager(this);
        this.playerManager = new PlayerManager(this);
        this.audioManager = new AudioManager(this); // Instantiate AudioManager
    }

    init(): void {
        // this.state = this.sys.registry.get('gameState');
        // if (!this.state) {
        //     console.error("Game State not found in registry. Creating a new one.");
        //
        //     this.sys.registry.set('gameState', this.state);
        // }
        this.state = new State(100, 350, this.scene.key);
        this.state.level = this.scene.key;
    }

    public preload(): void {
        this.textureLoader.setup();
        this.audioManager.setup(); // Call setup for audio preloading
    }

    public create(): void {
        this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
        this.hud.setup();
        this.pathsManager.setup();
        this.waveManager.setup();
        this.towerManager.setup();
        this.playerManager.setup();
        this.collisionManager.setup();

        // @ts-ignore
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.stop(this.scene.key);
            this.scene.start('MenuScene');
        });

        this.events.on('gameOver', this.handleGameOver, this);

        if (this.scene.key !== 'Tutorial') {
            this.hud.info('Incoming First Wave', AppColors.UI_MESSAGE_ERROR, () => {
                this.waveManager.startWave(1);
            });
        }

        this.events.on('shutdown', this.shutdown, this);
    }

    public update(time: number, delta: number): void {
        if (this.scene.key !== 'Tutorial') {
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
            this.scene.restart();
        });
    }

    private shutdown(): void {
        this.waveManager.destroy();
        this.towerManager.destroy();
        this.hud.destroy();
        this.audioManager.destroy(); // Destroy audio manager
    }
}
