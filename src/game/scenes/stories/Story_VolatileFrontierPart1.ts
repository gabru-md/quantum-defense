import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {PlayerConfig} from "../../config/PlayerConfig.ts";
import {SpecialEnemyConfig} from "../../config/EnemyConfigs.ts";
import {TowerConfigs} from "../../config/TowerConfigs.ts";
import {drawRift} from "../lib/StoryUtils.ts";

export class Story_VolatileFrontierPart1 extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_VolatileFrontierPart1); // Corrected: Use LevelNames.Story_VolatileFrontierPart1 directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'The Volatile Frontier (Part 1)',
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_VolatileFrontierPart1],
            steps: [
                {
                    text: 'Genie: My research confirms, rifts are battle scars. Their colors tell tales.',
                    action: scene => {
                        const playerRift = drawRift(scene, WIDTH / 2 - 150, HEIGHT / 2, PlayerConfig.resonanceWave.pulseColor);
                        const phantomRift = drawRift(scene, WIDTH / 2, HEIGHT / 2, SpecialEnemyConfig.pulseColor);
                        const gradientRift = drawRift(scene, WIDTH / 2 + 150, HEIGHT / 2, PlayerConfig.resonanceWave.pulseColor, SpecialEnemyConfig.pulseColor);
                        return [...playerRift, ...phantomRift, ...gradientRift];
                    },
                },
                {
                    text: 'New maps feature complex, dangerous active rift layouts. Plan your placements!',
                    action: scene => {
                        this.backgroundEffectsManager.enableGlitchAnnihilationEffect(scene);
                        const tower = scene.add.sprite(WIDTH / 2, HEIGHT * 3 / 4, TowerConfigs.tower1.texture).setAlpha(0.5);
                        scene.animateIn(tower);
                        const phantomRift = drawRift(scene, WIDTH / 2, HEIGHT / 2, SpecialEnemyConfig.pulseColor);
                        return [tower, ...phantomRift];
                    },
                },
                {
                    text: 'Rift malfunctions are a primary tactical challenge. Avoid severe stat penalties.',
                    action: scene => {
                        const tower = scene.add.sprite(WIDTH / 2, HEIGHT * 3 / 4, TowerConfigs.tower1.texture).setAlpha(0.5);
                        scene.animateIn(tower);
                        const phantomRift = drawRift(scene, WIDTH / 2, HEIGHT / 2, SpecialEnemyConfig.pulseColor);
                        scene.tweens.add({
                            targets: tower,
                            alpha: 0.1,
                            scale: 0.8,
                            duration: 300,
                            yoyo: true,
                            repeat: -1,
                        });
                        return [tower, ...phantomRift];
                    },
                },
            ],
        };
    }
}
