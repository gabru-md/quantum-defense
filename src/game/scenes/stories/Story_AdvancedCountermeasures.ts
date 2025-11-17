import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {TowerConfigs} from "../../config/TowerConfigs.ts";

export class Story_AdvancedCountermeasures extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_AdvancedCountermeasures); // Corrected: Use LevelNames.Story_AdvancedCountermeasures directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'Advanced Countermeasures',
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_AdvancedCountermeasures],
            steps: [
                {
                    text: 'Genie: I\'m working tirelessly on countermeasures, Guardian. But I need more Echoes!',
                    action: scene => {
                        const quantumEcho = scene.add.sprite(WIDTH / 2, HEIGHT / 2, 'quantum_echo_texture').setAlpha(0.8);
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
                {
                    text: 'We need specialized tower upgrades, including stronger rift-resistance modules.',
                    action: scene => {
                        const tower = scene.add.sprite(WIDTH / 2 - 100, HEIGHT / 2, TowerConfigs.tower3.texture).setAlpha(0.5);
                        scene.animateIn(tower);
                        const upgradeIcon = scene.add.sprite(WIDTH / 2 + 100, HEIGHT / 2, 'upgrade_icon_texture').setAlpha(0.8);
                        scene.animateIn(upgradeIcon);
                        return [tower, upgradeIcon];
                    },
                },
                {
                    text: 'Third tier of tower upgrades available, including specialized counter-Glitches!',
                    action: scene => {
                        const tower = scene.add.sprite(WIDTH / 2, HEIGHT / 2, TowerConfigs.tower3.texture).setAlpha(0.5);
                        scene.animateIn(tower);
                        scene.tweens.add({
                            targets: tower,
                            scale: 1.2,
                            alpha: 1,
                            duration: 500,
                            yoyo: true,
                            repeat: 1,
                        });
                        return tower;
                    },
                },
            ],
        };
    }
}
