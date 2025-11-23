import {LevelNames} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {createPhantom} from "../../scripts/EntityMaker.ts";

export class Story_ThePhantomArrival extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_ThePhantomArrival);
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'The Phantom\'s Arrival',
            nextScene: LevelNames.Gameplay_AFutileDefense, // Next scene is Level 9
            steps: [
                {
                    text: 'Genie: (grave, fearful) Guardian... I\'m detecting a new signature. It\'s... different. It\'s not like the other Glitches. It feels... cold. Empty.',
                    action: scene => {
                        this.backgroundEffectsManager.enableGhostlyClashEffect(scene);
                        return [];
                    },
                },
                {
                    text: 'Genie: No! Our weapons... they\'re phasing right through it! It\'s ignoring our defenses completely! It\'s... a phantom. We have no way to stop it!',
                    action: scene => {
                        const phantom = createPhantom(scene, WIDTH / 2, HEIGHT / 2);
                        scene.animateIn(phantom);
                        this.onHover(phantom, "Phantom");
                        return [phantom];
                    },
                },
                {
                    text: 'Genie: We have no way to stop it!',
                },
            ],
        };
    }
}
