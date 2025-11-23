// src/game/entities/StaticEnemy.ts
import { GameObject } from '../core/GameObject';
import * as Phaser from 'phaser';
import { Health } from '../components/Health';
import { VisualPulse } from '../components/VisualPulse';
import { SpecialEnemyConfig } from '../config/EnemyConfigs';
import {Genie} from "./Genie.ts";
import {PlayerConfig} from "../config/PlayerConfig.ts"; // For pulse color

export interface StaticEnemyConfig {
    scene: Phaser.Scene;
    x: number;
    y: number;
    texture: string;
    health: number;
    name: string;
}

export class StaticEnemy extends GameObject {
    private healthComponent!: Health;

    constructor(config: StaticEnemyConfig) {
        super(config.scene, config.x, config.y, config.texture);
        config.scene.physics.world.enable(this);

        this.healthComponent = new Health(config.health);
        this.addComponent(this.healthComponent);

        // The 'died' event is emitted by the Health component, not the GameObject itself.
        // The Level scene will listen for 'staticCoreDestroyed' event.
        this.on('died', () => {
            this.scene.events.emit('staticCoreDestroyed');
            this.destroy();
        });

        this.level.onHover(this, config.name);

        let genies = [];
        for (let i = 0; i < Phaser.Math.Between(50, 80); i++) {
            const genie = new Genie(this.scene, this, 'static_genie_texture');
            genie.setOrbitStats(Phaser.Math.Between(80, 120), 0.65);
            genie.setAlpha(Phaser.Math.FloatBetween(0.3, 1));
            this.scene.add.existing(genie);
            genies.push(genie);
        }
        this.addComponent(
            new VisualPulse(
                SpecialEnemyConfig.pulseColor,
                PlayerConfig.resonanceWave.pulseDelay * 4,
                PlayerConfig.resonanceWave.pulseDuration,
                SpecialEnemyConfig.deactivationRadius * 5,
                PlayerConfig.resonanceWave.pulseTotalPulses,
                PlayerConfig.resonanceWave.pulseLineWidth
            )
        );
    }

    // Public method to allow external components (like bullets) to deal damage
    public takeDamage(amount: number) {
        this.healthComponent.takeDamage(amount);
    }
}