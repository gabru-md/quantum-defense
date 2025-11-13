import { Enemy } from '../../../entities/Enemy.ts';
import { SpecialEnemy } from '../../../entities/SpecialEnemy.ts';
import { Level } from '../Level.ts';
import Phaser from 'phaser';
import { GameObject } from '../../../core/GameObject.ts';
import { Manager } from '../Manager.ts';
import { AppColors } from '../../../scripts/Colors.ts';

export class WaveManager extends Manager {
    enemies!: Phaser.GameObjects.Group;
    specialEnemies!: Phaser.GameObjects.Group;
    enabled: boolean = true;

    constructor(
        protected level: Level,
        public currentWave: number = 1,
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
        this.currentWave = waveNumber; // tutorial: waveNumber and currentWave were clashing
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
                        const health = config.health * healthMultiplier;
                        const speed = config.speed * speedMultiplier;

                        if (config.type === 'enemy') {
                            const enemy = new Enemy({
                                ...config,
                                scene: this.level,
                                path: this.level.pathsManager.paths[config.path],
                                health,
                                speed,
                            });
                            this.enemies.add(enemy, true);
                            enemy.on('reachedEnd', this.handleEnemyReachedEnd, this);
                        } else if (config.type === 'specialEnemy') {
                            const specialEnemy = new SpecialEnemy({
                                ...config,
                                scene: this.level,
                                path: this.level.pathsManager.paths[config.path],
                                health,
                                speed,
                            });
                            this.specialEnemies.add(specialEnemy, true);
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

    protected handleEnemyDied(moneyValue: number): void {
        this.level.state.money += moneyValue;
        this.enemiesRemaining--;
        this.level.hud.update();
        this.checkWaveCompletion();
    }

    protected handleSpecialEnemyKilledByPlayer(moneyValue: number): void {
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

    protected checkGameOver(): void {
        if (this.level.scene.key === 'Tutorial') return;
        if (this.level.state.baseHealth <= 0) {
            this.level.state.baseHealth = 0;
            this.level.hud.update();
            this.level.hud.info('GAME OVER!', AppColors.UI_MESSAGE_ERROR);
            this.gameOver = true;
            this.level.physics.pause();
            this.level.time.delayedCall(3000, () => this.level.scene.restart());
        }
    }

    protected checkWaveCompletion(): void {
        if (this.gameOver) return;
        if (this.enemiesSpawnedInWave >= this.maxEnemiesInWave && this.enemiesRemaining <= 0) {
            if (this.noMoreWavesLeft()) {
                if (this.level.scene.key === 'Tutorial') {
                    this.level.events.emit('waveCompleted');
                    return;
                }
                this.level.physics.pause();
                this.level.hud.info('LEVEL COMPLETE!', AppColors.UI_MESSAGE_SUCCESS);
                this.level.scene.start(this.level.nextScene());
            } else {
                if (this.level.scene.key === 'Tutorial') return;
                this.level.hud.info('NEXT WAVE INCOMING!', AppColors.UI_MESSAGE_SUCCESS, () => {
                    this.currentWave++;
                    this.startWave(this.currentWave);
                });
            }
        }
    }

    private noMoreWavesLeft() {
        return this.level.getWaveConfig(this.currentWave + 1).length === 0;
    }

    public update(time: number, delta: number) {
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
