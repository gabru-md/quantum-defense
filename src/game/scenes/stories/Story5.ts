import {LevelNames} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {GameObject} from "../../core/GameObject.ts";

export class Story_InitialBreakthrough extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_InitialBreakthrough);
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'Initial Breakthrough',
            nextScene: LevelNames.Gameplay_TheEchoHunt_1, // Next scene is Level 6
            steps: [
                {
                    text: 'Genie: (excited) It worked! Guardian, your collection of Quantum Echoes is incredible. I\'ve analyzed their structure and I can use their chaotic energy to overclock our tower protocols.',
                    action: scene => {
                        this.backgroundEffectsManager.enableDataStreamEffect(scene);
                        return [];
                    },
                },
                {
                    text: 'Genie: The Quantum Echoes hold the key to enhancing tower capabilities!',
                    action: scene => {
                        const quantumEcho = new GameObject(scene, WIDTH / 2, HEIGHT / 2, 'quantum_echo_texture').setAlpha(0.8);
                        scene.add.existing(quantumEcho);
                        this.onHover(quantumEcho, "Quantum Echo");
                        scene.fadeIn(quantumEcho);
                        return [quantumEcho];
                    },
                },
                {
                    text: 'Genie: By collecting more Echoes, we can permanently upgrade our defenses. This is the edge we needed! Let\'s push back!',
                },
            ],
        };
    }
}
