import {GameObject} from '../core/GameObject';
import * as Phaser from 'phaser';
import {Health} from '../components/Health';
import {VisualPulse} from '../components/VisualPulse';
import {SpecialEnemyConfig} from '../config/EnemyConfigs';
import {Genie} from "./Genie.ts";
import {PlayerConfig} from "../config/PlayerConfig.ts";
import {CircularMovement} from "../components/CircularMovement.ts"; // For pulse color

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

        this.addGenies();
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

    private addGenies() {
        const numArms = 5; // Number of spiral arms
        const geniesPerArm = 200; // Genies per arm
        const totalGenies = numArms * geniesPerArm;

        for (let i = 0; i < totalGenies; i++) {
            const armIndex = Math.floor(i / geniesPerArm);
            const positionInArm = i % geniesPerArm;

            // Calculate spiral parameters
            const normalizedPosition = positionInArm / geniesPerArm; // 0 to 1
            const maxRadius = 100; // Maximum distance from center
            const minRadius = 15;
            // const minRadius = Phaser.Math.Between(0, 10); // Minimum distance (near the center)

            // Spiral equation: radius decreases as we go inward
            const radius = maxRadius - (normalizedPosition * (maxRadius - minRadius));

            // Create spiral angle: each arm offset by 2π/numArms, plus spiral rotation
            const armAngleOffset = (armIndex * 2 * Math.PI) / numArms;
            const spiralTightness = 3; // How many rotations the spiral makes
            const spiralAngle = normalizedPosition * spiralTightness * 2 * Math.PI;
            const angle = armAngleOffset - spiralAngle; // Negative for inward spiral

            // Calculate fall speed based on distance (farther = slower start)
            const baseFallSpeed = 30;
            const fallSpeed = baseFallSpeed * (1 + normalizedPosition * 2); // Outer genies fall slower initially

            // Calculate orbit speed (inner genies orbit faster)
            const baseOrbitSpeed = 0.3;
            const orbitSpeed = baseOrbitSpeed * (1 + (1 - normalizedPosition) * 2);

            // Create the genie
            // randomly change texture to genie_texture
            const genie = new Genie(this.scene, this, Phaser.Math.RND.pick(['genie_texture', 'static_genie_texture']));

            // Add the circular movement with fall effect
            genie.addComponentOverriding(
                new CircularMovement(
                    this,
                    radius,
                    orbitSpeed,
                    true, // Enable falling
                    fallSpeed,
                    minRadius // Stop at minimum radius
                )
            );

            // Set initial angle for spiral positioning
            const circularMovement = genie.getComponent(CircularMovement);
            if (circularMovement) {
                circularMovement.setAngle(angle);
            }

            // Visual properties based on distance
            const alphaValue = Phaser.Math.FloatBetween(0.2, 0.8) * (1 - normalizedPosition * 0.5);
            genie.setAlpha(alphaValue);

            // Optional: scale based on distance for depth effect
            const scale = 0.5 + (1 - normalizedPosition) * 0.5; // Smaller when far, bigger when close
            genie.setScale(scale);

            this.scene.add.existing(genie);
        }
    }

    // Public method to allow external components (like bullets) to deal damage
    public takeDamage(amount: number) {
        this.healthComponent.takeDamage(amount);
    }
}