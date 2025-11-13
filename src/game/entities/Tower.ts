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
    cost: number; // Add cost to config
}

export class Tower extends GameObject {
    public reviveProgress: number = 0;
    public cost: number; // Store the cost
    private healthComponent!: Health;
    private visualPulseComponent!: VisualPulse;
    private originalPulseColor: number;

    constructor(config: TowerConfig) {
        super(config.scene, config.x, config.y, config.texture);
        config.scene.physics.world.enable(this);

        this.cost = config.cost; // Assign the cost

        // Store original color for revival
        this.originalPulseColor = (config.texture === 'tower1') ? phaserColor(AppColors.PULSE_LASER_TOWER) : phaserColor(AppColors.PULSE_BOMB_TOWER);

        this.setInteractive();

        // Add hover events
        this.on('pointerover', () => {
            this.scene.tweens.add({
                targets: this,
                scale: 1.2,
                duration: 200,
                ease: 'Sine.easeInOut'
            });
        });

        this.on('pointerout', () => {
            this.scene.tweens.add({
                targets: this,
                scale: 1,
                duration: 200,
                ease: 'Sine.easeInOut'
            });
        });
        this.on('healthChanged', this.handleHealthChanged, this);
    }

    private handleHealthChanged(currentHealth: number): void {
        this.healthComponent = this.getComponent(Health) as Health;
        this.visualPulseComponent = this.getComponent(VisualPulse) as VisualPulse;

        if (!this.healthComponent) {
            console.warn("Tower missing Health component!");
            return;
        }

        if (!this.healthComponent || !this.visualPulseComponent) return; // Ensure components are initialized

        const healthPercentage = currentHealth / this.healthComponent.maxHealth;
        if (healthPercentage <= 0.25) {
            this.visualPulseComponent.setColor(phaserColor(AppColors.UI_MESSAGE_ERROR)); // Red for very low health
        } else if (healthPercentage <= 0.5) {
            this.visualPulseComponent.setColor(phaserColor(AppColors.BULLET_BOMB)); // Orange for medium health
        } else {
            this.visualPulseComponent.setColor(this.originalPulseColor); // Original color
        }

        // Show "Tower under attack!" message if health decreased
        this.level.hud.alert('UNDER ATTACK:\nA tower is under attack from another tower!', AppColors.UI_MESSAGE_ERROR, 1000);
    }

    // add a deactivate function to deactivate the tower
    public deactivateTower(): void {
        this.healthComponent = this.getComponent(Health) as Health;
        this.healthComponent.takeDamage(this.healthComponent.maxHealth); // Ensure health is 0
        this.setActive(false);
        this.setAlpha(0.5);
        this.getComponent(VisualPulse)?.destroy();
        const attackComponents = [this.getComponent(LaserAttack), this.getComponent(BombAttack)];
        attackComponents.forEach(c => {
            if (c) c.enabled = false;
        });
    }


    public setOriginalPulseColor(): void {
        this.visualPulseComponent = this.getComponent(VisualPulse) as VisualPulse;
        if (this.visualPulseComponent) {
            this.visualPulseComponent.setColor(this.originalPulseColor);
        }
    }

    public isTowerDeactivated() {
        const healthComponent = this.getComponent(Health);
        return healthComponent && healthComponent.isDead() || this.reviveProgress > 0;
    }

    public isNotFullHealth() {
        const healthComponent = this.getComponent(Health);
        return healthComponent && healthComponent.currentHealth < healthComponent.maxHealth;
    }
}
