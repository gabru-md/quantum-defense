import {GlitchAnnihilationEffect} from "../../effects/GlitchAnnihilationEffect.ts";
import {BaseStoryScene} from "./BaseStoryScene.ts";
import Phaser from "phaser";
import {GameObject} from "../../core/GameObject.ts";
import {PlayerConfig} from "../../config/PlayerConfig.ts";
import {SpecialEnemyConfig} from "../../config/EnemyConfigs.ts";
import {AppColors, phaserColor} from "../../scripts/Colors.ts";

// Helper to draw rifts with specific colors
export function drawRift(scene: BaseStoryScene, x: number, y: number, color: number, secondaryColor: number | null = null, alpha: number = 0.3) {

    const glitchEffect = new GlitchAnnihilationEffect(scene);
    glitchEffect.createDistantRift({
        x: x,
        y: y,
        scale: 4.5,
        outcome: 'player' // This outcome might need to be dynamic based on rift type
    });

    const riftElements = scene.riftManager.drawRiftElements(x, y, 3, Phaser.Math.FloatBetween(0.5, 0.87), color, secondaryColor, alpha);
    scene.riftManager.animateRiftIdle(riftElements);

    const returnedElements: Phaser.GameObjects.GameObject[] = [
        riftElements.core,
        riftElements.innerGlow,
        riftElements.outerGlow,
        ...riftElements.rays,
        ...riftElements.fragments
    ];

    let hoverText: string | null = null;
    if (secondaryColor !== null) {
        hoverText = "Volatile Rift";
    } else if (color === PlayerConfig.resonanceWave.pulseColor) {
        hoverText = "Nexus Rift";
    } else if (color === SpecialEnemyConfig.pulseColor) {
        hoverText = "Static Rift";
    } else if (color === phaserColor(AppColors.UI_DISABLED)) {
        hoverText = "Dormant Rift";
    }

    if (hoverText) {
        if (!scene.textures.exists('transparentPixel')) {
            const graphics = scene.add.graphics();
            graphics.fillStyle(0x000000, 0); // transparent
            graphics.fillRect(0, 0, 1, 1);
            graphics.generateTexture('transparentPixel', 1, 1);
            graphics.destroy();
        }

        const hoverZone = new GameObject(scene, x, y, 'transparentPixel');
        // A circle seems more appropriate for a rift. Radius 75.
        hoverZone.setInteractive(new Phaser.Geom.Circle(0, 0, 75), Phaser.Geom.Circle.Contains);
        scene.add.existing(hoverZone);
        scene.onHover(hoverZone, hoverText);
        returnedElements.push(hoverZone);
    }

    return returnedElements;
}
