import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {drawRift} from "../lib/StoryUtils.ts";
import {SpecialEnemyConfig} from "../../config/EnemyConfigs.ts";
import {createPlayer} from "../../scripts/EntityMaker.ts";

export class Story_VolatileFrontierPart2 extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_VolatileFrontierPart2);
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
                        const [player, genie] = createPlayer(scene, WIDTH / 2, HEIGHT * 3 / 4);
                        scene.animateIn(player);
                        return [player, genie];
                    },
                },
                {
                    text: 'Collect increasing amounts of Quantum Echoes for faster tower upgrades.',
                    action: scene => {
                        const phantomRift = drawRift(scene, WIDTH / 2, HEIGHT / 2 - 200, SpecialEnemyConfig.pulseColor);
                        const quantumEcho1 = scene.add.sprite(WIDTH / 2 - 100, HEIGHT / 2 - 200, 'quantum_echo_texture').setAlpha(0.8);
                        const quantumEcho2 = scene.add.sprite(WIDTH / 2 + 100, HEIGHT / 2 - 200, 'quantum_echo_texture').setAlpha(0.8);
                        [quantumEcho1, quantumEcho2].forEach(t => scene.fadeIn(t));
                        return [...phantomRift, quantumEcho1, quantumEcho2];
                    },
                },
                {
                    text: 'Buckle up, Guardian!',
                }
            ],
        };
    }
}
