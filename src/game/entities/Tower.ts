import {GameObject} from '../core/GameObject';
import * as Phaser from 'phaser';
import {Health} from "../components/Health.ts";
import {VisualPulse} from "../components/VisualPulse.ts";

export interface TowerConfig {
    scene: Phaser.Scene;
    x: number;
    y: number;
    texture: string;
}

export class Tower extends GameObject {
    private readonly healthComponent!: Health;
    private visualPulseComponent!: VisualPulse | undefined;
    private towerActive: boolean = true;

    constructor(config: TowerConfig) {
        super(config.scene, config.x, config.y, config.texture);
        config.scene.physics.world.enable(this);
        this.healthComponent = new Health(100);
        this.addComponent(this.healthComponent);
        this.on('healthChanged', this.handleHealthChanged, this);
    }

    private handleHealthChanged(currentHealth: number) {
        const healthPercentage = currentHealth / this.healthComponent.maxHealth;
        this.setAlpha(0.2 + (0.8 * healthPercentage));

        if (currentHealth <= 0) {
            this.towerActive = false;
            this.disableVisualPulse();
        }
    }

    disableVisualPulse() {
        // change color of visual pulse to grey
        this.visualPulseComponent = this.getComponent(VisualPulse);
        if (this.visualPulseComponent) {
            this.visualPulseComponent.destroy()
        }
    }

    enableVisualPulse() {
        this.visualPulseComponent = this.getComponent(VisualPulse);
        if (this.visualPulseComponent) {
            this.visualPulseComponent.start();
        }
    }

    public isTowerDeactivated() {
        return !this.towerActive;
    }
}
