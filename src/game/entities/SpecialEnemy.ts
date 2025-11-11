import {GameObject} from '../core/GameObject';
import {Health} from '../components/Health';
import {PathFollower} from '../components/PathFollower';

export interface SpecialEnemyConfig {
    scene: Phaser.Scene;
    path: Phaser.Curves.Path;
    texture: string;
    health: number;
    speed: number;
    moneyValue: number;
}

export class SpecialEnemy extends GameObject {
    private moneyValue: number;
    private healthComponent!: Health;

    constructor(config: SpecialEnemyConfig) {
        const startPoint = config.path.getStartPoint();
        super(config.scene, startPoint.x, startPoint.y, config.texture);
        config.scene.physics.world.enable(this);

        this.moneyValue = config.moneyValue;

        // Add the Health component and store a reference
        this.healthComponent = new Health(config.health);
        this.addComponent(this.healthComponent);
        this.addComponent(new PathFollower(config.path, config.speed));
        
        this.on('reachedEnd', () => {
            // If a SpecialEnemy reaches the end, it's game over
            this.scene.events.emit('gameOver'); // Emit a global game over event
            this.destroy();
        }, this);

        // Listen for health changes to update transparency
        this.on('healthChanged', this.handleHealthChanged, this);

        this.on('died', () => {
            // When killed by player, emit event to give money
            this.scene.events.emit('specialEnemyKilledByPlayer', this.moneyValue);
            this.destroy();
        });
    }

    private handleHealthChanged(currentHealth: number): void {
        const healthPercentage = currentHealth / this.healthComponent.maxHealth;
        this.setAlpha(0.2 + (0.8 * healthPercentage));
    }
}
