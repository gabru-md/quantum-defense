import { GameObject } from '../core/GameObject';
import { Health } from '../components/Health';
import { PathFollower } from '../components/PathFollower';
import { Deactivator } from '../components/Deactivator';
import {SpecialEnemyConfigType} from '../config/EnemyConfigs.ts';

export interface SpecialEnemyConfig {
    scene: Phaser.Scene;
    path: Phaser.Curves.Path;
}

export class SpecialEnemy extends GameObject {
    public isVulnerableToResonanceWave: boolean = false; // New flag for tutorial control
    private energyValue: number; // Renamed: moneyValue to energyValue
    private healthComponent!: Health;

    constructor(config: SpecialEnemyConfig, specialEnemyConfigData: SpecialEnemyConfigType) {
        const startPoint = config.path.getStartPoint();
        super(config.scene, startPoint.x, startPoint.y, specialEnemyConfigData.texture);
        config.scene.physics.world.enable(this);

        this.energyValue = specialEnemyConfigData.energyValue; // Updated to energyValue

        this.healthComponent = new Health(specialEnemyConfigData.health);
        this.addComponent(this.healthComponent);
        this.addComponent(new PathFollower(config.path, specialEnemyConfigData.speed));
        this.addComponent(new Deactivator()); // Add the Deactivator component

        this.on(
            'reachedEnd',
            () => {
                this.scene.events.emit('gameOver');
                this.destroy();
            },
            this
        );

        this.on('healthChanged', this.handleHealthChanged, this);

        this.on('died', () => {
            this.scene.events.emit('specialEnemyKilledByPlayer', this.energyValue); // Updated to energyValue
            this.destroy();
        });
    }

    destroy(fromScene?: boolean) {
        this.removeListener('healthChanged', this.handleHealthChanged);
        super.destroy(fromScene);
    }

    private handleHealthChanged(currentHealth: number): void {
        const healthPercentage = currentHealth / this.healthComponent.maxHealth;
        this.setAlpha(0.2 + 0.8 * healthPercentage);
    }
}
