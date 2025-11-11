import * as Phaser from 'phaser';
import {HudManager} from "./manager/HudManager.ts";
import {WaveManager} from "./manager/WaveManager.ts";
import {State} from "./State.ts"; // Import State
import {CollisionManager} from "./manager/CollisionManager.ts";
import {TowerManager} from "./manager/TowerManager.ts";
import {TextureManager} from "./manager/TextureManager.ts";
import {PathsManager} from "./manager/PathsManager.ts";
import {PlayerManager} from "./manager/PlayerManager.ts";
import {GAME_HEIGHT, GAME_WIDTH} from "../../scripts/Util.ts";
import {AppColors} from "../../scripts/Colors.ts";

export abstract class Level extends Phaser.Scene {
    hud: HudManager;
    waveManager: WaveManager;
    collisionManager: CollisionManager;
    state!: State; // Now a reference to the shared state, initialized in init()
    towerManager: TowerManager;
    textureLoader: TextureManager;
    pathsManager: PathsManager;
    playerManager: PlayerManager;

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
        // Managers are instantiated here, but depend on 'state' being available in init()
        this.hud = new HudManager(this);
        this.waveManager = new WaveManager(this);
        this.collisionManager = new CollisionManager(this);
        this.towerManager = new TowerManager(this);
        this.textureLoader = new TextureManager(this);
        this.pathsManager = new PathsManager(this);
        this.playerManager = new PlayerManager(this);
    }

    // init() is called after the constructor but before preload()
    init(): void {
        // Get the shared State instance from the registry
        this.state = this.sys.registry.get('gameState');
        if (!this.state) {
            // This case should ideally not happen if MenuScene is loaded first
            console.error("Game State not found in registry. Creating a new one.");
            this.state = new State(100, 350, this.scene.key);
            this.sys.registry.set('gameState', this.state);
        }
        // Update the level key in the state
        this.state.level = this.scene.key;
    }

    public preload(): void {
        this.textureLoader.setup();
    }

    public create(): void {
        this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
        this.hud.setup();
        this.pathsManager.setup();
        this.waveManager.setup();
        this.towerManager.setup();
        this.playerManager.setup();
        this.collisionManager.setup();

        // --- Escape Key Listener ---
        // @ts-ignore
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.stop(this.scene.key); // Stop the current level scene
            this.scene.start('MenuScene'); // Go back to the MenuScene
        });

        this.hud.info('Incoming First Wave', AppColors.UI_MESSAGE_ERROR, () => {
            this.waveManager.startWave(1);
        });
    }

    public update(time: number, delta: number): void {
        this.waveManager.update(time, delta);
        this.towerManager.update(time, delta);
        this.playerManager.update(time, delta);
        this.hud.update();
    }
}
