import {GameObject} from '../core/GameObject';
import * as Phaser from 'phaser';
import {Health} from "../components/Health.ts";
import {VisualPulse} from "../components/VisualPulse.ts";
import {AppColors, phaserColor} from "../scripts/Colors.ts";
import {LaserAttack} from "../components/LaserAttack.ts";
import {BombAttack} from "../components/BombAttack.ts";

export interface TowerConfig {
    scene: Phaser.Scene;
    x: number;
    y: number;
    texture: string;
}

export class Tower extends GameObject {
    public reviveProgress: number = 0;
    private healthComponent!: Health;
    private visualPulseComponent!: VisualPulse;
    private originalPulseColor: number;

    constructor(config: TowerConfig) {
        super(config.scene, config.x, config.y, config.texture);
        config.scene.physics.world.enable(this);

        // Store original color for revival
        this.originalPulseColor = (config.texture === 'tower1') ? phaserColor(AppColors.PULSE_LASER_TOWER) : phaserColor(AppColors.PULSE_BOMB_TOWER);
        this.on('healthChanged', this.handleHealthChanged, this);
    }

    private handleHealthChanged(currentHealth: number): void {
        this.healthComponent = this.getComponent(Health) as Health;
        this.visualPulseComponent = this.getComponent(VisualPulse) as VisualPulse;
        const healthPercentage = currentHealth / this.healthComponent.maxHealth;
        if (healthPercentage <= 0.25) {
            this.visualPulseComponent.setColor(phaserColor(AppColors.UI_MESSAGE_ERROR)); // Red for very low health
        } else if (healthPercentage <= 0.5) {
            this.visualPulseComponent.setColor(phaserColor(AppColors.BULLET_BOMB)); // Orange for medium health
        } else {
            this.visualPulseComponent.setColor(this.originalPulseColor); // Original color
        }
    }

    // add a deactivate function to deactivate the tower
    public deactivateTower(): void {
        this.healthComponent = this.getComponent(Health) as Health;
        this.healthComponent.takeDamage(this.healthComponent.maxHealth);
        this.setActive(false);
        this.setAlpha(0.5);
        this.getComponent(VisualPulse)?.destroy();
        const attackComponents = [this.getComponent(LaserAttack), this.getComponent(BombAttack), this.getComponent(VisualPulse)];
        attackComponents.forEach(c => {
            if (c) c.enabled = false;
        });
    }


    public setOriginalPulseColor(): void {
        this.visualPulseComponent = this.getComponent(VisualPulse) as VisualPulse;
        this.visualPulseComponent.setColor(this.originalPulseColor);
    }

    public isTowerDeactivated() {
        let healthComponent = this.getComponent(Health);
        return healthComponent && healthComponent.isDead() || this.reviveProgress > 0;
    }

    public isNotFullHealth() {
        let healthComponent = this.getComponent(Health);
        return healthComponent && healthComponent.currentHealth < healthComponent.maxHealth;
    }
}
