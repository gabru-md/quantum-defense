import {GameObject} from "../core/GameObject.ts";
import {Genie} from "../entities/Genie.ts";
import {VisualPulse} from "../components/VisualPulse.ts";
import {PlayerConfig} from "../config/PlayerConfig.ts";
import {SpecialEnemyConfig} from "../config/EnemyConfigs.ts";
import {CircularMovement} from "../components/CircularMovement.ts";
import Phaser from "phaser";

export function createNexusObject(scene: Phaser.Scene, x: number, y: number): GameObject[] {
    const nexus = new GameObject(scene, x, y, 'nexus').setAlpha(0.8);
    scene.add.existing(nexus);
    let genies = [];

    // Create many harmonious revolving genies
    const totalGenies = 350;

    for (let i = 0; i < totalGenies; i++) {
        const genie = new Genie(scene, nexus);

        // Random orbit radius for organic cloud effect
        const orbitRadius = Phaser.Math.Between(50, 125);

        // Slow, harmonious orbit speeds with slight variation
        const orbitSpeed = Phaser.Math.FloatBetween(0.2, 0.4);

        // Random direction for visual complexity (mostly same direction)
        const direction = Math.random() > 0.25 ? 1 : -1;

        genie.setOrbitStats(orbitRadius, orbitSpeed * direction);

        // Visual variety
        genie.setAlpha(Phaser.Math.FloatBetween(0.3, 0.85));
        genie.setScale(Phaser.Math.FloatBetween(0.7, 1.0));

        scene.add.existing(genie);
        genies.push(genie);
    }

    nexus.addComponent(
        new VisualPulse(
            PlayerConfig.resonanceWave.pulseColor,
            PlayerConfig.resonanceWave.pulseDelay * 4,
            PlayerConfig.resonanceWave.pulseDuration,
            PlayerConfig.resonanceWave.activationRange * 5,
            PlayerConfig.resonanceWave.pulseTotalPulses,
            PlayerConfig.resonanceWave.pulseLineWidth
        )
    );
    return [nexus, ...genies];
}

export function createPhantom(scene: Phaser.Scene, x: number, y: number): GameObject {
    const phantom = new GameObject(scene, x, y, SpecialEnemyConfig.texture).setAlpha(0.8);
    scene.add.existing(phantom);
    phantom.addComponent(
        new VisualPulse(
            SpecialEnemyConfig.pulseColor,
            PlayerConfig.resonanceWave.pulseDelay,
            PlayerConfig.resonanceWave.pulseDuration,
            SpecialEnemyConfig.deactivationRadius,
            PlayerConfig.resonanceWave.pulseTotalPulses,
            PlayerConfig.resonanceWave.pulseLineWidth
        )
    );
    return phantom;
}

export function createPlayer(scene: Phaser.Scene, x: number, y: number): GameObject[] {
    const player = new GameObject(scene, x, y, PlayerConfig.texture);
    scene.add.existing(player);
    const genie = new Genie(scene, player);
    scene.add.existing(genie);
    player.addComponent(
        new VisualPulse(
            PlayerConfig.resonanceWave.pulseColor,
            PlayerConfig.resonanceWave.pulseDelay,
            PlayerConfig.resonanceWave.pulseDuration,
            PlayerConfig.resonanceWave.activationRange,
            PlayerConfig.resonanceWave.pulseTotalPulses,
            PlayerConfig.resonanceWave.pulseLineWidth
        )
    );
    return [player, genie];
}

export function createStatic(scene: Phaser.Scene, x: number, y: number): GameObject[] {
    const staticEnemy = new GameObject(scene, x, y, 'static').setAlpha(0.35).setScale(1.15, 1.15);
    scene.add.existing(staticEnemy);
    let genies = [];

    // Create spiral arms configuration
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
        const genie = new Genie(scene, staticEnemy, Phaser.Math.RND.pick(['genie_texture','static_genie_texture']));

        // Add the circular movement with fall effect
        genie.addComponentOverriding(
            new CircularMovement(
                staticEnemy,
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

        scene.add.existing(genie);
        genies.push(genie);
    }

    // Add visual pulse effect
    staticEnemy.addComponent(
        new VisualPulse(
            SpecialEnemyConfig.pulseColor,
            PlayerConfig.resonanceWave.pulseDelay * 4,
            PlayerConfig.resonanceWave.pulseDuration,
            SpecialEnemyConfig.deactivationRadius * 5,
            PlayerConfig.resonanceWave.pulseTotalPulses,
            PlayerConfig.resonanceWave.pulseLineWidth
        )
    );

    return [staticEnemy, ...genies];
}