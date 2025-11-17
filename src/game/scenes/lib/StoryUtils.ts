import {GlitchAnnihilationEffect} from "../../effects/GlitchAnnihilationEffect.ts";
import {BaseStoryScene} from "./BaseStoryScene.ts";
import {PlayerConfig} from "../../config/PlayerConfig.ts";
import {SpecialEnemyConfig} from "../../config/EnemyConfigs.ts";
import {AppColors, phaserColor} from "../../scripts/Colors.ts";
import Phaser from "phaser";

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

    return [
        riftElements.core,
        riftElements.innerGlow,
        riftElements.outerGlow,
        ...riftElements.rays,
        ...riftElements.fragments
    ];
}
