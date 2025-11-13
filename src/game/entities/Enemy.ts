import { GameObject } from '../core/GameObject';
import { Health } from '../components/Health';
import { PathFollower } from '../components/PathFollower';
import { ContinuousBreathing } from '../components/ContinuousBreathing.ts'; // Import ContinuousBreathing
import * as Phaser from 'phaser';

export interface EnemyConfig {
    scene: Phaser.Scene;
    path: Phaser.Curves.Path;
    texture: string;
    health: number;
    speed: number;
    moneyValue: number;
}

export class Enemy extends GameObject {
    public moneyValue: number;
    private healthComponent!: Health; // Reference to the health component

    constructor(config: EnemyConfig) {
        const startPoint = config.path.getStartPoint();
        super(config.scene, startPoint.x, startPoint.y, config.texture);

        config.scene.physics.world.enable(this);

        this.moneyValue = config.moneyValue;

        // Add the Health component and store a reference
        this.healthComponent = new Health(config.health);
        this.addComponent(this.healthComponent);
        this.addComponent(new PathFollower(config.path, config.speed));
        this.addComponent(new ContinuousBreathing(0.75, 750)); // Add the continuous breathing effect

        // Listen for health changes to update transparency
        this.on('healthChanged', this.handleHealthChanged, this);

        this.on('died', () => {
            this.scene.events.emit('enemyDied', this.moneyValue);
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
