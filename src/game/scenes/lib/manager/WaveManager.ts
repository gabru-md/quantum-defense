import {Enemy} from "../../../entities/Enemy.ts";
import {SpecialEnemy} from "../../../entities/SpecialEnemy.ts"; // Import SpecialEnemy
import {Level} from "../Level.ts";
import Phaser from "phaser";
import {GameObject} from "../../../core/GameObject.ts";
import {Manager} from "../Manager.ts";
import {AppColors} from "../../../scripts/Colors.ts"; // Import AppColors

export class WaveManager extends Manager {

    enemies!: Phaser.GameObjects.Group;
    specialEnemies!: Phaser.GameObjects.Group; // Renamed from healers
    enabled: boolean = true;

    constructor(protected level: Level,
                public currentWave: number = 1,
                protected enemiesRemaining: number = 0,
                public enemiesSpawnedInWave: number = 0,
                public maxEnemiesInWave: number = 20,
                public gameOver: boolean = false) {
        super(level);
    }

    setup() {
        // Initialize the groups
        this.enemies = this.level.add.group({classType: Enemy, runChildUpdate: false});
        this.specialEnemies = this.level.add.group({classType: SpecialEnemy, runChildUpdate: false}); // Renamed
        // Setup Event Listeners
        this.level.events.on('enemyDied', this.handleEnemyDied, this);
        this.level.events.on('specialEnemyKilledByPlayer', this.handleSpecialEnemyKilledByPlayer, this); // New event listener
    }

    destroy(): void {
        this.enemies.destroy(true);
        this.specialEnemies.destroy(true);
        this.level.events.off('enemyDied', this.handleEnemyDied, this);
        this.level.events.off('specialEnemyKilledByPlayer', this.handleSpecialEnemyKilledByPlayer, this);
    }

    startWave(waveNumber: number): void {
        const waveConfig = this.level.getWaveConfig(waveNumber);
        if (!waveConfig || waveConfig.length === 0) {
            console.warn(`No wave config found for wave ${waveNumber}`);
            return;
        }
        this.currentWave = waveNumber; // tutorial: waveNumber and currentWave were clashing
        this.maxEnemiesInWave = waveConfig.reduce((sum, config) => sum + config.count, 0);
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
                        if (waveConfig.type === 'specialEnemy') { // Renamed from healer
                            const specialEnemy = new SpecialEnemy({
                                scene: this.level,
                                path: this.level.definePaths()[waveConfig.path],
                                texture: waveConfig.texture,
                                health: waveConfig.health,
                                speed: waveConfig.speed,
                                moneyValue: waveConfig.moneyValue
                            });
                            this.specialEnemies.add(specialEnemy, true); // Renamed group
                            // SpecialEnemy handles its own 'reachedEnd' to trigger game over
                            this.enemiesSpawnedInWave++;
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

    protected handleSpecialEnemyKilledByPlayer(moneyValue: number): void { // New handler
        this.level.state.money += moneyValue;
        this.level.hud.update();
        this.enemiesRemaining--;
        this.checkWaveCompletion();
        this.checkGameOver();
    }

    protected handleEnemyReachedEnd(): void {
        this.level.state.baseHealth -= 10;
        this.enemiesRemaining--;
        this.level.hud.update();
        this.checkGameOver();
        this.checkWaveCompletion();
    }

    protected checkGameOver(): void {
        if (this.level.scene.key === 'Tutorial') {
            return;
        }
        if (this.level.state.baseHealth <= 0) {
            this.level.state.baseHealth = 0;
            this.level.hud.update();
            this.level.hud.info('GAME OVER!', AppColors.UI_MESSAGE_ERROR); // Use color constant
            this.gameOver = true;
            this.level.physics.pause();
            this.level.time.delayedCall(3000, () => this.level.scene.restart());
        }
    }

    protected checkWaveCompletion(): void {
        if (this.gameOver) {
            return;
        }
        // Wave is complete if all regular enemies have been spawned AND all active regular enemies are gone
        // Special enemies are handled separately for game over condition
        if (this.enemiesSpawnedInWave >= this.maxEnemiesInWave && this.enemiesRemaining === 0) {
            if (this.noMoreWavesLeft()) {;
                if (this.level.scene.key === 'Tutorial') {
                    this.level.events.emit('waveCompleted');
                }
                this.level.physics.pause();
                this.level.hud.info('LEVEL COMPLETE!', AppColors.UI_MESSAGE_SUCCESS); // Use color constant
                this.level.scene.start(this.level.nextScene());
            } else {
                if (this.level.scene.key === 'Tutorial') {
                    return;
                }
                this.level.hud.info('NEXT WAVE INCOMING!', AppColors.UI_MESSAGE_SUCCESS, () => { // Use color constant
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
        this.specialEnemies.children.each((specialEnemy: Phaser.GameObjects.GameObject) => { // Update special enemies
            if (specialEnemy instanceof GameObject) {
                specialEnemy.update(time, delta);
            }
            return null;
        });
    }

    public pause() {
        this.enabled = false;
    }

    public resume() {
        this.enabled = true;
    }

}
