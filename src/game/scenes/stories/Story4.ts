import {LevelNames} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {SpecialEnemyConfig} from "../../config/EnemyConfigs.ts";
import {drawRift} from "../lib/StoryUtils.ts";
import {GameObject} from "../../core/GameObject.ts";

export class Story_VolatileInterference extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_VolatileInterference);
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'Volatile Interference',
            nextScene: LevelNames.Gameplay_TheFirstEcho, // Next scene is Level 5
            steps: [
                {
                    text: 'Genie: A new threat! Some of the Rifts are no longer dormant. Their chaotic energy is interfering with our towers!',
                    action: scene => {
                        this.backgroundEffectsManager.enableGlitchAnnihilationEffect(scene);
                        const staticRift = drawRift(scene, WIDTH / 2, HEIGHT / 4, SpecialEnemyConfig.pulseColor);
                        return [...staticRift];
                    },
                },
                {
                    text: 'Genie: Our towers are malfunctioning near the active rift! But... wait. My sensors are picking up something else. The rift\'s chaotic energy is condensing into fragments... "Quantum Echoes." They are unstable, but potent.',
                    action: scene => {
                        const quantumEcho = new GameObject(scene, WIDTH / 2, HEIGHT / 2 + 100, 'quantum_echo_texture').setAlpha(0.8).setScale(1.25);
                        scene.add.existing(quantumEcho);
                        scene.animateIn(quantumEcho);
                        this.onHover(quantumEcho, "Quantum Echo");
                        return [quantumEcho];
                    },
                },
                {
                    text: 'Genie: If you can get close enough to collect them, I might be able to use their energy.',
                },
            ],
        };
    }
}
