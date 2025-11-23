import {LevelNames} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {drawRift} from "../lib/StoryUtils.ts";
import {createPhantom} from "../../scripts/EntityMaker.ts";
import {PlayerConfig} from "../../config/PlayerConfig.ts";

export class Story_EchoesOfAncientLore extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_EchoesOfAncientLore);
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'Echoes of Ancient Lore',
            nextScene: LevelNames.Gameplay_TheInvestigation_1, // Next scene is Level 10
            steps: [
                {
                    text: 'Genie: That Phantom... its energy signature is unlike anything I\'ve seen. But it resonates with the Rifts. Guardian, I have a desperate theory. The oldest Rifts, the ones left by ancient Guardians, might hold the key. We need to analyze the Echoes from those specific locations. It will be dangerous.',
                    action: scene => {
                        this.backgroundEffectsManager.enableDataStreamEffect(scene);
                        return [];
                    },
                },
                {
                    text: 'Genie: I have it... The data is fragmented, but it\'s clear. Phantoms aren\'t just Glitches. They are direct, raw manifestations of Static\'s core essence. Mini-Statics. That\'s why they\'re immune.',
                    action: scene => {
                        const guardianRift = drawRift(scene, WIDTH / 2, HEIGHT / 2, PlayerConfig.resonanceWave.pulseColor);
                        const phantom = createPhantom(scene, WIDTH / 2 + 200, HEIGHT / 2 + 100);
                        scene.animateIn(phantom);
                        this.onHover(phantom, "Phantom");
                        return [...guardianRift, phantom];
                    },
                },
                {
                    text: 'Genie: This explains their immunity, disruptive power, and why they amplify rift chaos.',
                },
            ],
        };
    }
}
