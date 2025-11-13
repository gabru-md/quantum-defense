import {GameObject} from '../core/GameObject';
import {Health} from '../components/Health';
import {PathFollower} from '../components/PathFollower';
import {Deactivator} from '../components/Deactivator';
import {VisualPulse} from "../components/VisualPulse.ts";
import {AppColors, phaserColor} from "../scripts/Colors.ts";import {ContinuousBreathing} from "../components/ContinuousBreathing.ts"; // Import Deactivator

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

        this.healthComponent = new Health(config.health);
        this.addComponent(this.healthComponent);
        this.addComponent(new PathFollower(config.path, config.speed));
        this.addComponent(new Deactivator()); // Add the Deactivator component
        this.addComponent(new VisualPulse(phaserColor(AppColors.SPECIAL_ENEMY), 500, 1000, 2, 2, 2));

        this.on('reachedEnd', () => {
            this.scene.events.emit('gameOver');
            this.destroy();
        }, this);

        this.on('healthChanged', this.handleHealthChanged, this);

        this.on('died', () => {
            this.scene.events.emit('specialEnemyKilledByPlayer', this.moneyValue);
            this.destroy();
        });
    }

    destroy(fromScene?: boolean) {
        // delete the visualpulse
        this.components.forEach(c => {
            if (c instanceof VisualPulse) {
                c.destroy();
            }
        });
        this.removeListener('healthChanged', this.handleHealthChanged);
        super.destroy(fromScene);
    }

    private handleHealthChanged(currentHealth: number): void {
        const healthPercentage = currentHealth / this.healthComponent.maxHealth;
        this.setAlpha(0.2 + (0.8 * healthPercentage));
    }
}
