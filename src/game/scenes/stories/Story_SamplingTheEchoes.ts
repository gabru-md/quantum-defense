import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {SpecialEnemyConfig} from "../../config/EnemyConfigs.ts";
import {drawRift} from "../lib/StoryUtils.ts";
import {createPhantom, createPlayer} from "../../scripts/EntityMaker.ts";
import {GameObject} from "../../core/GameObject.ts";

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
                    text: "Genie: We need to understand Static's power.",
                    action: scene => {
                        this.backgroundEffectsManager.enableGhostlyClashEffect(scene);
                        const phantom = createPhantom(scene, WIDTH / 2 - 100, HEIGHT / 2 - 100);
                        scene.animateIn(phantom);
                        this.onHover(phantom, "Phantom");
                        return [phantom];
                    },
                },
                {
                    text: 'Guardian, you must actively seek out echoes from dangerous rift zones.',
                    action: scene => {
                        const [player, genie] = createPlayer(scene, WIDTH / 2 + 100, HEIGHT / 2 - 100);
                        scene.animateIn(player);
                        this.onHover(player, "You");
                        return [player, genie];
                    },
                },
                {
                    text: 'Carefully navigate around the malfunctioning fields of active rifts.',
                    action: scene => {
                        const quantumEcho = new GameObject(scene, WIDTH / 2, HEIGHT / 2 - 100, 'quantum_echo_texture').setAlpha(0.8);
                        scene.add.existing(quantumEcho);
                        this.onHover(quantumEcho, "Quantum Echo");
                        scene.fadeIn(quantumEcho);
                        const phantomRift = drawRift(scene, WIDTH / 2, HEIGHT / 2 + 300, SpecialEnemyConfig.pulseColor);
                        return [...phantomRift, quantumEcho];
                    }
                },
            ],
        };
    }
}
