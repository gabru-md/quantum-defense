import {GameObject} from '../core/GameObject.ts';
import * as Phaser from 'phaser';
import {Health} from '../components/Health.ts';
import {VisualPulse} from '../components/VisualPulse.ts';
import {AppColors, phaserColor} from '../scripts/Colors.ts';
import {LaserAttack} from '../components/LaserAttack.ts';
import {BombAttack} from '../components/BombAttack.ts';
import {TowerConfigs, TowerConfigType} from '../config/TowerConfigs.ts'; // Import TowerConfigs

export interface TowerConfig {
    scene: Phaser.Scene;
    x: number;
    y: number;
    texture: string;
    energyCost: number; // Renamed: cost to energyCost
}

export class Tower extends GameObject {
    public reviveProgress: number = 0;
    public energyCost: number; // Renamed: cost to energyCost
    private healthComponent!: Health;
    private visualPulseComponent!: VisualPulse;
    private originalPulseColor: number;
    private towerConfigType: TowerConfigType;

    constructor(config: TowerConfig) {
        super(config.scene, config.x, config.y, config.texture);
        config.scene.physics.world.enable(this);

        this.energyCost = config.energyCost; // Assign the energyCost

        // Store original color for revival using TowerConfigs
        this.towerConfigType = TowerConfigs[config.texture];
        this.originalPulseColor = this.towerConfigType ? this.towerConfigType.pulse.color : phaserColor(AppColors.UI_TEXT); // Fallback color

        this.setInteractive();

        // Add hover events
        this.on('pointerover', () => {
            this.scene.tweens.add({
                targets: this,
                scale: 1.2,
                duration: 200,
                ease: 'Sine.easeInOut',
            });
        });

        this.on('pointerout', () => {
            this.scene.tweens.add({
                targets: this,
                scale: 1,
                duration: 200,
                ease: 'Sine.easeInOut',
            });
        });
        this.on('healthChanged', this.handleHealthChanged, this);

        this.enableVisualPulse();
    }

    private handleHealthChanged(currentHealth: number): void {
        this.healthComponent = this.getComponent(Health) as Health;
        this.visualPulseComponent = this.getComponent(VisualPulse) as VisualPulse;

        if (!this.healthComponent) {
            console.warn('Tower missing Health component!');
            return;
        }

        if (!this.visualPulseComponent) return; // Ensure visualPulseComponent is initialized

        const healthPercentage = currentHealth / this.healthComponent.maxHealth;
        if (healthPercentage <= 0.25) {
            this.visualPulseComponent.setColor(phaserColor(AppColors.UI_MESSAGE_ERROR)); // Red for very low health
        } else if (healthPercentage <= 0.5) {
            this.visualPulseComponent.setColor(phaserColor(AppColors.BULLET_BOMB)); // Orange for medium health
        } else {
            this.visualPulseComponent.setColor(this.originalPulseColor); // Original color from config
        }

        // Show "Tower under attack!" message if health decreased
        this.level.hud.alert(
            'UNDER ATTACK:\nA tower is under attack from another tower!',
            AppColors.UI_MESSAGE_ERROR,
            1000
        );
    }

    // add a deactivate function to deactivate the tower
    public deactivateTower(): void {
        if (!this.active) {
            return;
        }
        this.healthComponent = this.getComponent(Health) as Health;
        this.healthComponent.takeDamage(this.healthComponent.maxHealth); // Ensure health is 0
        this.setActive(false);
        this.setAlpha(0.5);
        this.getComponent(VisualPulse)?.destroy();
        const attackComponents = [this.getComponent(LaserAttack), this.getComponent(BombAttack)];
        attackComponents.forEach((c) => {
            if (c) c.enabled = false;
        });
    }

    public enableVisualPulse(): void {
        this.addComponentOverriding(new VisualPulse(
            this.towerConfigType.pulse.color,
            this.towerConfigType.pulse.pulseDelay,
            this.towerConfigType.pulse.pulseDuration,
            this.towerConfigType.range,
            this.towerConfigType.pulse.pulseTotalPulses,
            this.towerConfigType.pulse.pulseLineWidth
        ))
    }

    public setOriginalPulseColor(): void {
        this.visualPulseComponent = this.getComponent(VisualPulse) as VisualPulse;
        if (this.visualPulseComponent) {
            this.visualPulseComponent.enabled = true;
            this.visualPulseComponent.setColor(this.originalPulseColor);
        }
    }

    public isTowerDeactivated() {
        const healthComponent = this.getComponent(Health);
        return (healthComponent && healthComponent.isDead()) || this.reviveProgress > 0;
    }

    public isNotFullHealth() {
        const healthComponent = this.getComponent(Health);
        return healthComponent && healthComponent.currentHealth < healthComponent.maxHealth;
    }

    public revive(): void {
        if (this.active) {
            return;
        }
        this.healthComponent._currentHealth = this.healthComponent.maxHealth;
        this.setActive(true);
        this.setAlpha(1);
        const attackComponents = [
            this.getComponent(LaserAttack),
            this.getComponent(BombAttack),
        ];
        attackComponents.forEach((c) => {
            if (c) c.enabled = true;
        });
        this.reviveProgress = 0;
        this.enableVisualPulse()
        this.setOriginalPulseColor();
    }
}
