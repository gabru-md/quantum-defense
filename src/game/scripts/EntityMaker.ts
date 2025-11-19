import {GameObject} from "../core/GameObject.ts";
import {Genie} from "../entities/Genie.ts";
import {VisualPulse} from "../components/VisualPulse.ts";
import {PlayerConfig} from "../config/PlayerConfig.ts";
import {SpecialEnemyConfig} from "../config/EnemyConfigs.ts";

export function createNexusObject(scene: Phaser.Scene, x: number, y: number): GameObject[] {
    const nexus = new GameObject(scene, x, y, 'nexus').setAlpha(0.6);
    scene.add.existing(nexus);
    let genies = [];
    for (let i = 0; i < Phaser.Math.Between(30, 50); i++) {
        const genie = new Genie(scene, nexus);
        genie.setOrbitStats(Phaser.Math.Between(80, 120), Phaser.Math.FloatBetween(0.5, 1));
        genie.setAlpha(Phaser.Math.FloatBetween(0.3, 1));
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
    for (let i = 0; i < Phaser.Math.Between(50, 80); i++) {
        const genie = new Genie(scene, staticEnemy, 'static_genie_texture');
        genie.setOrbitStats(Phaser.Math.Between(80, 120), 0.65);
        genie.setAlpha(Phaser.Math.FloatBetween(0.3, 1));
        scene.add.existing(genie);
        genies.push(genie);
    }
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