import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {GameObject} from '../../core/GameObject.ts';
import {VisualPulse} from '../../components/VisualPulse.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {PlayerConfig} from "../../config/PlayerConfig.ts";
import {SpecialEnemyConfig} from "../../config/EnemyConfigs.ts";
import {drawRift} from "../lib/StoryUtils.ts";

export class Story_SamplingTheEchoes extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_SamplingTheEchoes); // Corrected: Use LevelNames.Story_SamplingTheEchoes directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'Sampling the Echoes',
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_SamplingTheEchoes],
            steps: [
                {
                    text: "Genie: We need to understand Static's power. Collect Phantom remains and Quantum Echoes.",
                    action: scene => {
                        this.backgroundEffectsManager.enableGhostlyClashEffect(scene);
                        const phantom = new GameObject(scene, WIDTH / 2 - 100, HEIGHT / 2 - 100, SpecialEnemyConfig.texture).setAlpha(0.8);
                        scene.add.existing(phantom);
                        scene.animateIn(phantom);
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
                        const quantumEcho = scene.add.sprite(WIDTH / 2 + 100, HEIGHT / 2 + 100, 'quantum_echo_texture').setAlpha(0.8);
                        scene.animateIn(quantumEcho);
                        return [phantom, quantumEcho];
                    },
                },
                {
                    text: 'Guardian, you must actively seek out echoes from dangerous rift zones.',
                    action: scene => {
                        const phantomRift = drawRift(scene, WIDTH / 2, HEIGHT / 2, SpecialEnemyConfig.pulseColor);
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
                        return [...phantomRift, player];
                    },
                },
                {
                    text: 'Carefully navigate around the malfunctioning fields of active rifts.',
                },
            ],
        };
    }
}
