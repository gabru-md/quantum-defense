import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {GameObject} from '../../core/GameObject.ts';
import {VisualPulse} from '../../components/VisualPulse.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {PlayerConfig} from "../../config/PlayerConfig.ts";
import {SpecialEnemyConfig} from "../../config/EnemyConfigs.ts";
import {drawRift} from "../lib/StoryUtils.ts";

export class Story_ThePhantomArrival extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_ThePhantomArrival); // Corrected: Use LevelNames.Story_ThePhantomArrival directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'The Phantom\'s Arrival',
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_ThePhantomArrival],
            steps: [
                {
                    text: 'Guardian, I have some grave news.',
                    action: scene => {
                        this.backgroundEffectsManager.enableGhostlyClashEffect(scene);
                        const player = new GameObject(scene, WIDTH / 2 - 100, HEIGHT / 2 - 100, PlayerConfig.texture);
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
                        return player;
                    },
                },
                {
                    text: 'The Phantom is on the move! Its presence activates a new, dangerous rift!',
                    action: scene => {
                        this.backgroundEffectsManager.enableGlitchAnnihilationEffect(scene);
                        const phantom = new GameObject(scene, WIDTH / 2 + 100, HEIGHT / 2 - 100, SpecialEnemyConfig.texture).setAlpha(0.8);
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
                        const phantomRift = drawRift(scene, WIDTH / 2, HEIGHT / 2 + 100, SpecialEnemyConfig.pulseColor);
                        return [phantom, ...phantomRift];
                    },
                },
                {
                    text: 'This active rift is highly volatile and dangerous to approach.',
                },
            ],
        };
    }
}
