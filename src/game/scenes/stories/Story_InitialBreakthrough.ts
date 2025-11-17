import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {GameObject} from '../../core/GameObject.ts';
import {VisualPulse} from '../../components/VisualPulse.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {PlayerConfig} from "../../config/PlayerConfig.ts";
import {TowerConfigs} from "../../config/TowerConfigs.ts";

export class Story_InitialBreakthrough extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_InitialBreakthrough); // Corrected: Use LevelNames.Story_InitialBreakthrough directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'Initial Breakthrough',
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_InitialBreakthrough],
            steps: [
                {
                    text: 'Genie: Amazing work, Guardian! Your collected samples are yielding results!',
                    action: scene => {
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
                    text: 'The Quantum Echoes hold the key to enhancing tower capabilities!',
                    action: scene => {
                        const tower = scene.add.sprite(WIDTH / 2, HEIGHT / 2, TowerConfigs.tower1.texture).setAlpha(0.5);
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
                {
                    text: 'This unlocks the first tier of tower upgrades! Keep collecting those echoes!',
                    action: scene => {
                        const quantumEcho = scene.add.sprite(WIDTH / 2 + 100, HEIGHT / 2 + 100, 'quantum_echo_texture').setAlpha(0.8);
                        scene.animateIn(quantumEcho);
                        return quantumEcho;
                    },
                },
            ],
        };
    }
}
