import { GameObject } from '../core/GameObject';
import { Health } from '../components/Health';
import { PathFollower } from '../components/PathFollower';
import { ContinuousBreathing } from '../components/ContinuousBreathing.ts'; // Import ContinuousBreathing
import * as Phaser from 'phaser';
import { EnemyConfigType } from '../config/EnemyConfigs.ts'; // Import EnemyConfigType

export interface EnemyConfig {
    scene: Phaser.Scene;
    path: Phaser.Curves.Path;
    type: string; // Add type to differentiate in WaveManager
}

export class Enemy extends GameObject {
    public energyValue: number; // Renamed: moneyValue to energyValue
    private healthComponent!: Health; // Reference to the health component

    constructor(config: EnemyConfig, enemyConfigData: EnemyConfigType) {
        const startPoint = config.path.getStartPoint();
        super(config.scene, startPoint.x, startPoint.y, enemyConfigData.texture);

        config.scene.physics.world.enable(this);

        this.energyValue = enemyConfigData.energyValue; // Updated to energyValue

        // Add the Health component and store a reference
        this.healthComponent = new Health(enemyConfigData.health);
        this.addComponent(this.healthComponent);
        this.addComponent(new PathFollower(config.path, enemyConfigData.speed));
        this.addComponent(new ContinuousBreathing(0.75, 750)); // Add the continuous breathing effect

        // Listen for health changes to update transparency
        this.on('healthChanged', this.handleHealthChanged, this);

        this.on('died', () => {
            this.scene.events.emit('enemyDied', this.energyValue); // Updated to energyValue
            this.destroy();
        });
    }

    private handleHealthChanged(currentHealth: number): void {
        // Calculate alpha based on health percentage
        // Max health is available from the healthComponent
        const healthPercentage = currentHealth / this.healthComponent.maxHealth;
        this.setAlpha(0.2 + 0.8 * healthPercentage); // Alpha ranges from 0.2 (almost dead) to 1.0 (full health)
    }
}
