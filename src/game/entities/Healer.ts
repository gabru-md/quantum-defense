import {GameObject} from "../core/GameObject.ts";
import {Health} from "../components/Health.ts";
import {PathFollower} from "../components/PathFollower.ts";

export interface HealerConfig {
    scene: Phaser.Scene;
    path: Phaser.Curves.Path;
    texture: string;
    health: number;
    speed: number;
    moneyValue: number;
}

export class Healer extends GameObject {
    private moneyValue: number;
    private healthComponent!: Health;

    constructor(config: HealerConfig) {
        const startPoint = config.path.getStartPoint();
        super(config.scene, startPoint.x, startPoint.y, config.texture);
        config.scene.physics.world.enable(this);

        this.moneyValue = config.moneyValue;

        // Add the Health component and store a reference
        this.healthComponent = new Health(config.health);
        this.addComponent(this.healthComponent);
        this.addComponent(new PathFollower(config.path, config.speed));
        this.on('reachedEnd', () => {
            this.scene.events.emit('healerReachedEnd', this.moneyValue);
            this.destroy();
        }, this);
        // Listen for health changes to update transparency
        this.on('healthChanged', this.handleHealthChanged, this);

        this.on('died', () => {
            this.scene.events.emit('healerDied', this.moneyValue);
            this.destroy();
        });
    }

    private handleHealthChanged(currentHealth: number): void {
        // Calculate alpha based on health percentage
        // Max health is available from the healthComponent
        const healthPercentage = currentHealth / this.healthComponent.maxHealth;
        this.setAlpha(0.2 + (0.8 * healthPercentage)); // Alpha ranges from 0.2 (almost dead) to 1.0 (full health)

        // decrease the money value
        this.moneyValue = this.moneyValue / 2;
    }
}