import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {EnemyConfigs, SpecialEnemyConfig} from "../../config/EnemyConfigs.ts";
import {drawRift} from "../lib/StoryUtils.ts";
import {AppColors, phaserColor} from "../../scripts/Colors.ts";

export class Story_StaticNewGlitches extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_StaticNewGlitches); // Corrected: Use LevelNames.Story_StaticNewGlitches directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'Static\'s New Glitches',
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_StaticNewGlitches],
            steps: [
                {
                    text: 'Genie: Static senses your growing strength, Guardian. It unleashes new Glitches!',
                    action: scene => {
                        this.backgroundEffectsManager.enableGlitchAnnihilationEffect(scene);
                        const staticEnemy = scene.add.sprite(WIDTH / 2, HEIGHT / 4, 'static').setAlpha(0.3).setScale(1.25, 1.25);
                        scene.animateIn(staticEnemy);
                        scene.tweens.add({
                            targets: staticEnemy,
                            scaleX: 1.1,
                            scaleY: 1.1,
                            duration: 1000,
                            yoyo: true,
                            repeat: -1,
                        });
                        const newGlitch = scene.add.sprite(WIDTH / 2, HEIGHT * 3 / 4, EnemyConfigs.enemy3.texture).setAlpha(0.8);
                        scene.animateIn(newGlitch);
                        return [staticEnemy, newGlitch];
                    },
                },
                {
                    text: 'Some Glitches are immune to certain towers, others try to corrupt rifts!',
                    action: scene => {
                        const immuneGlitch = scene.add.sprite(WIDTH / 2 - 100, HEIGHT / 2, EnemyConfigs.enemy1.texture).setAlpha(0.8);
                        const corruptingGlitch = scene.add.sprite(WIDTH / 2 + 100, HEIGHT / 2, EnemyConfigs.enemy2.texture).setAlpha(0.8);
                        [immuneGlitch, corruptingGlitch].forEach(t => scene.animateIn(t));
                        return [immuneGlitch, corruptingGlitch];
                    },
                },
                {
                    text: 'Even worse, some can temporarily activate dormant rifts, intensifying malfunctions!',
                    action: scene => {
                        const dormantRift = drawRift(scene, WIDTH / 2 - 100, HEIGHT / 2, phaserColor(AppColors.UI_DISABLED));
                        const glitch = scene.add.sprite(WIDTH / 2 + 100, HEIGHT / 2, EnemyConfigs.enemy3.texture).setAlpha(0.8);
                        scene.animateIn(glitch);
                        // Simulate activation
                        scene.tweens.add({
                            targets: dormantRift[0], // Target the core of the rift
                            alpha: 0.8,
                            tint: SpecialEnemyConfig.pulseColor, // Becomes Phantom-colored active
                            duration: 500,
                            yoyo: true,
                            repeat: 0,
                            onComplete: () => {
                                // Replace with an active rift visual
                                drawRift(scene, WIDTH / 2 - 100, HEIGHT / 2, SpecialEnemyConfig.pulseColor, null, 0.8);
                            }
                        });
                        return [...dormantRift, glitch];
                    },
                },
            ],
        };
    }
}
