import * as Phaser from 'phaser';
import {HudManager} from "./manager/HudManager.ts";
import {WaveManager} from "./manager/WaveManager.ts";
import {State} from "./State.ts";
import {CollisionManager} from "./manager/CollisionManager.ts";
import {TowerManager} from "./manager/TowerManager.ts";
import {TextureManager} from "./manager/TextureManager.ts";
import {PathsManager} from "./manager/PathsManager.ts";
import {PlayerManager} from "./manager/PlayerManager.ts";
import {GAME_HEIGHT, GAME_WIDTH} from "../../scripts/util.ts";
import {AppColors} from "../../scripts/Colors.ts"; // Import AppColors

export abstract class Level extends Phaser.Scene {
    hud: HudManager;
    waveManager: WaveManager;
    collisionManager: CollisionManager;
    state: State;
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
        this.state = new State(100, 350, key);
        this.hud = new HudManager(this);
        this.waveManager = new WaveManager(this);
        this.collisionManager = new CollisionManager(this);
        this.towerManager = new TowerManager(this);
        this.textureLoader = new TextureManager(this);
        this.pathsManager = new PathsManager(this);
        this.playerManager = new PlayerManager(this);
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
