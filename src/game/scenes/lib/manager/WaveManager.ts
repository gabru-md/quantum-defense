import { Enemy } from '../../../entities/Enemy.ts';
import { SpecialEnemy } from '../../../entities/SpecialEnemy.ts';
import { Level } from '../Level.ts';
import Phaser from 'phaser';
import { GameObject } from '../../../core/GameObject.ts';
import { Manager } from '../Manager.ts';
import { AppColors } from '../../../scripts/Colors.ts';
import { LevelNames } from '../LevelNames.ts';
import { EnemyConfigs, SpecialEnemyConfig } from '../../../config/EnemyConfigs.ts'; // Import EnemyConfigs

export class WaveManager extends Manager {
    enemies!: Phaser.GameObjects.Group;
    specialEnemies!: Phaser.GameObjects.Group;
    enabled: boolean = true;

    constructor(
        protected level: Level,
        public currentWave: number = 1,
        public totalWaves: number = 0, // Added totalWaves property
        protected enemiesRemaining: number = 0,
        public enemiesSpawnedInWave: number = 0,
        public maxEnemiesInWave: number = 20,
        public gameOver: boolean = false
    ) {
        super(level);
    }

    setup(): { enemies: Phaser.GameObjects.Group; specialEnemies: Phaser.GameObjects.Group } {
        this.enemies = this.level.add.group({ classType: Enemy, runChildUpdate: false });
        this.specialEnemies = this.level.add.group({ classType: SpecialEnemy, runChildUpdate: false });
        this.level.events.on('enemyDied', this.handleEnemyDied, this);
        this.level.events.on('specialEnemyKilledByPlayer', this.handleSpecialEnemyKilledByPlayer, this);
        this.calculateTotalWaves(); // Calculate total waves during setup
        return { enemies: this.enemies, specialEnemies: this.specialEnemies };
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
        this.currentWave = waveNumber;
        this.maxEnemiesInWave = waveConfig.reduce((sum, config) => sum + config.count, 0);
        this.enemiesRemaining = this.maxEnemiesInWave;
        this.enemiesSpawnedInWave = 0;

        const { healthMultiplier, speedMultiplier } = this.getDifficultyMultiplier();

        waveConfig.forEach((config) => {
            let spawnDelay = 0;
            for (let i = 0; i < config.count; i++) {
                this.level.time.addEvent({
                    delay: spawnDelay,
                    callback: () => {
                        if (config.type === 'enemy') {
                            const enemyConfigData = EnemyConfigs[config.texture];
                            if (!enemyConfigData) {
                                console.error(`Enemy config data not found for texture: ${config.texture}`);
                                return;
                            }
                            const enemy = new Enemy(
                                {
                                    scene: this.level,
                                    path: this.level.pathsManager.paths[config.path],
                                    type: config.texture,
                                },
                                {
                                    ...enemyConfigData,
                                    health: enemyConfigData.health * healthMultiplier,
                                    speed: enemyConfigData.speed * speedMultiplier,
                                }
                            );
                            this.enemies.add(enemy, true);
                            enemy.on('reachedEnd', () => this.handleEnemyReachedEnd(enemy), this);
                        } else if (config.type === 'specialEnemy') {
                            const specialEnemy = new SpecialEnemy(
                                {
                                    scene: this.level,
                                    path: this.level.pathsManager.paths[config.path],
                                },
                                {
                                    ...SpecialEnemyConfig,
                                    health: SpecialEnemyConfig.health * healthMultiplier,
                                    speed: SpecialEnemyConfig.speed * speedMultiplier,
                                }
                            );
                            this.specialEnemies.add(specialEnemy, true);
                            specialEnemy.on('reachedEnd', () => this.handleEnemyReachedEnd(specialEnemy), this);
                        }
                        this.enemiesSpawnedInWave++;
                        this.level.hud.update();
                    },
                    callbackScope: this,
                });
                spawnDelay += config.delay;
            }
        });
    }

    private calculateTotalWaves(): void {
        let waveCount = 1;
        while (this.level.getWaveConfig(waveCount).length > 0) {
            waveCount++;
        }
        this.totalWaves = waveCount - 1; // Subtract 1 because the loop increments one extra time
    }

    private getDifficultyMultiplier(): { healthMultiplier: number; speedMultiplier: number } {
        switch (this.level.state.difficulty) {
            case 'easy':
                return { healthMultiplier: 0.75, speedMultiplier: 0.9 };
            case 'hard':
                return { healthMultiplier: 1.5, speedMultiplier: 1.2 };
            case 'normal':
            default:
                return { healthMultiplier: 1, speedMultiplier: 1 };
        }
    }

    protected handleEnemyDied(energyValue: number): void { // Renamed moneyValue to energyValue
        this.level.state.energy += energyValue; // Updated state.money to state.energy
        this.enemiesRemaining--;
        this.level.hud.update();
        this.checkWaveCompletion();
    }

    protected handleSpecialEnemyKilledByPlayer(energyValue: number): void { // Renamed moneyValue to energyValue
        this.level.state.energy += energyValue; // Updated state.money to state.energy
        this.enemiesRemaining--;
        this.level.hud.update();
        this.checkWaveCompletion();
    }

    protected handleEnemyReachedEnd(enemy: Enemy | SpecialEnemy): void {
        if (this.gameOver) return;
    
        this.level.state.baseHealth -= 10;
        this.enemiesRemaining--;
        this.level.events.emit('nexusHit', enemy.x, enemy.y);
        this.level.hud.update();
    
        if (this.level.state.baseHealth <= 0) {
            this.level.events.emit('gameOver');
        } else {
            this.checkWaveCompletion();
        }
    }

    protected checkWaveCompletion(): void {
        if (this.gameOver || this.level.scene.key === LevelNames.Tutorial) return;
    
        if (this.enemiesSpawnedInWave >= this.maxEnemiesInWave && this.enemiesRemaining <= 0) {
            this.level.events.emit('waveCompleted');
    
            if (this.currentWave >= this.totalWaves) { // Changed condition to use totalWaves
                this.level.physics.pause();
                this.level.hud.info('LEVEL COMPLETE!', AppColors.UI_MESSAGE_SUCCESS, () => {
                    this.level.easeOutAndStartNextScene(this.level.fetchNextScene());
                });
            } else {
                this.level.hud.info('NEXT WAVE INCOMING!', AppColors.UI_MESSAGE_SUCCESS, () => {
                    this.currentWave++;
                    this.startWave(this.currentWave);
                });
            }
        }
    }
    public update(time: number, delta: number) {
        if (!this.enabled) return;
        // @ts-ignore
        this.enemies.children.each((enemy: Phaser.GameObjects.GameObject) => {
            if (enemy instanceof GameObject) enemy.update(time, delta);
        });
        // @ts-ignore
        this.specialEnemies.children.each((specialEnemy: Phaser.GameObjects.GameObject) => {
            if (specialEnemy instanceof GameObject) specialEnemy.update(time, delta);
        });
    }

    public pause() {
        this.enabled = false;
    }

    public resume() {
        this.enabled = true;
    }
}
