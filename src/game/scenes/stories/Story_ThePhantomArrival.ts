import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {SpecialEnemyConfig} from "../../config/EnemyConfigs.ts";
import {drawRift} from "../lib/StoryUtils.ts";
import {createPhantom, createPlayer} from "../../scripts/EntityMaker.ts";

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
                        const [player, genie] = createPlayer(scene, WIDTH / 2 - 100, HEIGHT / 2 - 100);
                        scene.animateIn(player);
                        return [player, genie];
                    },
                },
                {
                    text: 'The Phantom is on the move!\nIts presence activates a new, dangerous rift!',
                    action: scene => {
                        this.backgroundEffectsManager.enableGlitchAnnihilationEffect(scene);
                        const phantom = createPhantom(scene, WIDTH / 2 + 100, HEIGHT / 2 - 100);
                        scene.animateIn(phantom);
                        return [phantom];
                    },
                },
                {
                    text: 'This active rift is highly volatile and dangerous to approach.',
                    action: scene => {
                        const phantomRift = drawRift(scene, WIDTH / 2, HEIGHT / 2 + 300, SpecialEnemyConfig.pulseColor);
                        return [...phantomRift];
                    }
                },
            ],
        };
    }
}
