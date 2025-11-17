import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {GameObject} from '../../core/GameObject.ts';
import {VisualPulse} from '../../components/VisualPulse.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {PlayerConfig} from "../../config/PlayerConfig.ts";
import {TowerConfigs} from "../../config/TowerConfigs.ts";
import {drawRift} from "../lib/StoryUtils.ts";
import {SpecialEnemyConfig} from "../../config/EnemyConfigs.ts";

export class Story_VolatileFrontierPart2 extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_VolatileFrontierPart2); // Corrected: Use LevelNames.Story_VolatileFrontierPart2 directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'The Volatile Frontier (Part 2)',
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_VolatileFrontierPart2],
            steps: [
                {
                    text: 'Genie: Guardian, you must master navigating these volatile zones.',
                    action: scene => {
                        const player = new GameObject(scene, WIDTH / 2, HEIGHT * 3 / 4, PlayerConfig.texture);
                        scene.add.existing(player);
                        scene.animateIn(player);
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
                        const phantomRift = drawRift(scene, WIDTH / 2, HEIGHT / 2, SpecialEnemyConfig.pulseColor);
                        return [player, ...phantomRift];
                    },
                },
                {
                    text: 'Collect increasing amounts of Quantum Echoes for higher-tier upgrades.',
                    action: scene => {
                        const quantumEcho1 = scene.add.sprite(WIDTH / 2 - 100, HEIGHT / 2, 'quantum_echo_texture').setAlpha(0.8);
                        const quantumEcho2 = scene.add.sprite(WIDTH / 2 + 100, HEIGHT / 2, 'quantum_echo_texture').setAlpha(0.8);
                        [quantumEcho1, quantumEcho2].forEach(t => scene.animateIn(t));
                        return [quantumEcho1, quantumEcho2];
                    },
                },
                {
                    text: 'Second tier of tower upgrades available, including early "rift-resistant" modules!',
                    action: scene => {
                        const tower = scene.add.sprite(WIDTH / 2, HEIGHT / 2, TowerConfigs.tower2.texture).setAlpha(0.5);
                        scene.animateIn(tower);
                        scene.tweens.add({
                            targets: tower,
                            scale: 1.2,
                            alpha: 1,
                            duration: 500,
                            yoyo: true,
                            repeat: 1,
                        });
                        return tower;
                    },
                },
            ],
        };
    }
}
