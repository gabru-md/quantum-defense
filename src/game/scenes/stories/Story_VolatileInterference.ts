import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {SpecialEnemyConfig} from "../../config/EnemyConfigs.ts";
import {TowerConfigs} from "../../config/TowerConfigs.ts";
import {drawRift} from "../lib/StoryUtils.ts";

export class Story_VolatileInterference extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_VolatileInterference); // Corrected: Use LevelNames.Story_VolatileInterference directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'Volatile Interference',
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_VolatileInterference],
            steps: [
                {
                    text: "Genie: Guardian, I've made a disturbing discovery!",
                    action: scene => {
                        this.backgroundEffectsManager.enableGlitchAnnihilationEffect(scene);
                        const phantomRift = drawRift(scene, WIDTH / 2, HEIGHT / 2 - 100, SpecialEnemyConfig.pulseColor);
                        return [...phantomRift];
                    },
                },
                {
                    text: 'The chaotic energy from active rifts interferes with tower functions!',
                    action: scene => {
                        const tower1 = scene.add.sprite(WIDTH / 2 - 100, (HEIGHT * 3) / 4 - 100, TowerConfigs.tower1.texture).setAlpha(0.3);
                        const tower2 = scene.add.sprite(WIDTH / 2, (HEIGHT * 3) / 4 - 100, TowerConfigs.tower2.texture).setAlpha(0.3);
                        const tower3 = scene.add.sprite(WIDTH / 2 + 100, (HEIGHT * 3) / 4 - 100, TowerConfigs.tower3.texture).setAlpha(0.3);
                        [tower1, tower2, tower3].forEach(t => scene.animateIn(t));
                        // Simulate malfunction visually
                        scene.tweens.add({
                            targets: [tower1, tower2, tower3],
                            alpha: 0.1,
                            duration: 500,
                            yoyo: true,
                            repeat: -1,
                        });
                        return [tower1, tower2, tower3];
                    },
                },
                {
                    text: 'Towers placed too close malfunction, losing effectiveness. Adapt your strategy!',
                },
                {
                    text: 'These rifts also emit Quantum Echoes. Collect them, but beware the risk!',
                    action: scene => {
                        const quantumEcho = scene.add.sprite(WIDTH / 2, HEIGHT / 2 + 100, 'quantum_echo_texture').setAlpha(0.8); // Placeholder texture
                        scene.animateIn(quantumEcho);
                        scene.tweens.add({
                            targets: quantumEcho,
                            scale: 1.2,
                            duration: 700,
                            yoyo: true,
                            repeat: -1,
                        });
                        return quantumEcho;
                    },
                },
            ],
        };
    }
}
