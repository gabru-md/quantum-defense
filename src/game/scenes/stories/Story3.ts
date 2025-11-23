import {LevelNames} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {drawRift} from "../lib/StoryUtils.ts";
import {AppColors, phaserColor} from "../../scripts/Colors.ts";

export class Story_TheDormantScars extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_TheDormantScars);
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    create() {
        super.create();
        this.audioManager.playMusic('MainMenuMusic')
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'The Dormant Scars',
            nextScene: LevelNames.Gameplay_HelloGenie,
            steps: [
                {
                    text: 'Genie: Guardian, look. The battles fought here long ago have left scars on the realm itself. We call them Rifts.',
                    action: scene => {
                        this.backgroundEffectsManager.enableDataStreamEffect(scene);
                        this.backgroundEffectsManager.configureAndStartGlitchAnnihilationEffect(scene, 1500);
                        return [];
                    },
                },
                {
                    text: 'Genie: These dormant fields are too unstable to build on. Their residual energy disrupts construction. We\'ll have to work around them.',
                    action: scene => {
                        const dormantRift1 = drawRift(scene, WIDTH / 4, HEIGHT / 2, phaserColor(AppColors.UI_DISABLED));
                        const dormantRift2 = drawRift(scene, WIDTH * 3 / 4, HEIGHT / 2, phaserColor(AppColors.UI_DISABLED));
                        return [...dormantRift1, ...dormantRift2];
                    },
                },
                {
                    text: 'Genie: Be careful, I sense Static\'s forces are learning to use these paths.',
                },
            ],
        };
    }
}
