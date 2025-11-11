import {Enemy} from "../../../entities/Enemy.ts";
import {Healer} from "../../../entities/Healer.ts";
import {Level} from "../Level.ts";
import Phaser from "phaser";
import {GameObject} from "../../../core/GameObject.ts";
import {Manager} from "../Manager.ts";

export class WaveManager extends Manager {

    enemies!: Phaser.GameObjects.Group;
    healers!: Phaser.GameObjects.Group;

    constructor(protected level: Level,
                public currentWave: number = 1,
                protected enemiesRemaining: number = 0,
                public enemiesSpawnedInWave: number = 0,
                public maxEnemiesInWave: number = 20,
                protected healersSpawnedInWave: number = 0,
                protected gameOver: boolean = false) {
        super(level);
    }

    setup() {
        // Initialize the groups
        this.enemies = this.level.add.group({classType: Enemy, runChildUpdate: false});
        this.healers = this.level.add.group({classType: Healer, runChildUpdate: false});
        // Setup Event Listeners
        this.level.events.on('enemyDied', this.handleEnemyDied, this);
    }

    startWave(waveNumber: number): void {
        const waveConfig = this.level.getWaveConfig(waveNumber);
        if (!waveConfig || waveConfig.length === 0) {
            console.warn(`No wave config found for wave ${waveNumber}`);
            return;
        }

        this.maxEnemiesInWave = waveConfig.reduce((sum, config) => sum + (config.type === 'enemy' ? config.count : 0), 0);
        this.enemiesRemaining = this.maxEnemiesInWave;
        this.enemiesSpawnedInWave = 0;


        waveConfig.forEach(waveConfig => {
            let spawnDelay = 0;
            for (let i = 0; i < waveConfig.count; i++) {
                this.level.time.addEvent({
                    delay: spawnDelay,
                    callback: () => {
                        if (waveConfig.type === 'enemy') {
                            const enemy = new Enemy({
                                scene: this.level,
                                path: this.level.definePaths()[waveConfig.path],
                                texture: waveConfig.texture,
                                health: waveConfig.health,
                                speed: waveConfig.speed,
                                moneyValue: waveConfig.moneyValue
                            });
                            this.enemies.add(enemy, true);
                            enemy.on('reachedEnd', this.handleEnemyReachedEnd, this);
                            this.enemiesSpawnedInWave++;
                            this.level.hud.update();
                        }
                        if (waveConfig.type === 'healer') {
                            const healer = new Healer({
                                scene: this.level,
                                path: this.level.definePaths()[waveConfig.path],
                                texture: waveConfig.texture,
                                health: waveConfig.health,
                                speed: waveConfig.speed,
                                moneyValue: waveConfig.moneyValue
                            });
                            this.healers.add(healer, true);
                            healer.on('healerReachedEnd', this.handleHealerReachedEnd, this);
                            this.healersSpawnedInWave++;
                            this.level.hud.update();
                        }
                    },
                    callbackScope: this,
                });
                spawnDelay += waveConfig.delay;
            }
        });
    }

    protected handleEnemyDied(moneyValue: number): void {
        this.level.state.money += moneyValue;
        this.enemiesRemaining--;
        this.level.hud.update();
        this.checkWaveCompletion();
    }

    protected handleEnemyReachedEnd(): void {
        this.level.state.baseHealth -= 10;
        this.enemiesRemaining--;
        this.level.hud.update();
        this.checkGameOver();
        this.checkWaveCompletion();
    }

    protected handleHealerReachedEnd(moneyValue: number): void {
        this.level.state.baseHealth += 5;
        this.level.state.money += moneyValue;
        this.level.hud.update();
        this.checkGameOver();
        this.checkWaveCompletion();
    }

    protected checkGameOver(): void {
        if (this.level.state.baseHealth <= 0) {
            this.level.state.baseHealth = 0;
            this.level.hud.update();
            this.level.hud.info('GAME OVER!', '');
            this.gameOver = true;
            this.level.physics.pause();
            this.level.time.delayedCall(3000, () => this.level.scene.restart());
        }
    }

    protected checkWaveCompletion(): void {
        if (this.gameOver) {
            return;
        }
        if (this.enemiesSpawnedInWave >= this.maxEnemiesInWave && this.enemiesRemaining === 0) {
            if (this.noMoreWavesLeft()) {
                this.level.physics.pause();
                this.level.hud.info('LEVEL COMPLETE!', '#00ff00');
                this.level.scene.start(this.level.nextScene());
            } else {
                this.level.hud.info('NEXT WAVE INCOMING!', '#00ff00', () => {
                    this.currentWave++;
                    this.startWave(this.currentWave);
                });

            }
        }
    }

    private noMoreWavesLeft() {
        const nextWaveConfig = this.level.getWaveConfig(this.currentWave + 1);
        return nextWaveConfig.length == 0;

    }

    public update(time: number, delta: number) {
        this.enemies.children.each((enemy: Phaser.GameObjects.GameObject) => {
            if (enemy instanceof GameObject) {
                enemy.update(time, delta);
            }
            return null;
        });
    }
}