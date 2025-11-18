import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {PlayerConfig} from "../../config/PlayerConfig.ts";
import {SpecialEnemyConfig} from "../../config/EnemyConfigs.ts";
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
                    text: 'My research confirms, rifts are battle scars with energy.\nTheir colors tell tales of the battle.',
                    action: scene => {
                        this.backgroundEffectsManager.enableGlitchAnnihilationEffect(scene);
                        return [];
                    },
                },
                {
                    text: 'Some rifts have large amount of Nexus energy.\nSignalling to the power of the Guardian that fought the war\nIt\'s waves can kill Phantom!',
                    action: scene => {
                        const playerRift = drawRift(scene, WIDTH / 2 - 400, HEIGHT / 2 + 300, PlayerConfig.resonanceWave.pulseColor);
                        return [...playerRift];
                    },
                },
                {
                    text: 'Sometimes the rift is flowing with Static Energy\nThey cause disruptions to the towers nearby.',
                    action: scene => {
                        const phantomRift = drawRift(scene, WIDTH / 2 + 400, HEIGHT / 2 + 300, SpecialEnemyConfig.pulseColor);
                        return [...phantomRift];
                    },
                },
                {
                    text: 'An evenly fought battle creates a Gradient Rift\nThe energy inside it changes with time\nIt really must be close battle.',
                    action: scene => {
                        const gradientRift = drawRift(scene, WIDTH / 2, HEIGHT / 2 + 300, PlayerConfig.resonanceWave.pulseColor, SpecialEnemyConfig.pulseColor);
                        return [...gradientRift];
                    },
                },
                {
                    text: 'Rift malfunctions are a primary tactical challenge.\nBeware of the rifts when placing towers!'
                },
            ],
        };
    }
}
