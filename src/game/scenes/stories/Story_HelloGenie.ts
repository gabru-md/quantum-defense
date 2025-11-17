import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {GameObject} from '../../core/GameObject.ts';
import {VisualPulse} from '../../components/VisualPulse.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {PlayerConfig} from "../../config/PlayerConfig.ts";
import {EnemyConfigs} from "../../config/EnemyConfigs.ts";
import {drawRift} from "../lib/StoryUtils.ts";
import {AppColors, phaserColor} from "../../scripts/Colors.ts";

export class Story_HelloGenie extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_HelloGenie); // Corrected: Use LevelNames.Story_HelloGenie directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'Hello, Genie!',
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_HelloGenie],
            steps: [
                {
                    text: 'Hi! I am Genie.\nEven a Guardian needs a guide!',
                    action: scene => {
                        const player = new GameObject(scene, WIDTH / 2, HEIGHT * 3 / 4, PlayerConfig.texture);
                        scene.add.existing(player);
                        scene.animateIn(player);
                        player.addComponent(
                            new VisualPulse(
                                PlayerConfig.resonanceWave.pulseColor,
                                PlayerConfig.resonanceWave.pulseDelay,
                                PlayerConfig.resonanceWave.pulseDuration,
                                PlayerConfig.resonanceWave.activationRange,
                                PlayerConfig.resonanceWave.pulseTotalPulses,
                                PlayerConfig.resonanceWave.pulseLineWidth
                            )
                        );

                        const nexus = scene.add.sprite(WIDTH / 2, HEIGHT * 7 / 8, 'nexus').setAlpha(0.3).setScale(0.75, 0.75);
                        scene.animateIn(nexus);
                        scene.tweens.add({
                            targets: nexus,
                            scaleX: 0.8,
                            scaleY: 0.8,
                            duration: 2000,
                            yoyo: true,
                            repeat: -1,
                        });
                        return [player, nexus];
                    },
                },
                {
                    text: "Static's operations are rising rapidly,\nHe is sending out fleet of Glitches.",
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

                        const enemy1 = scene.add.sprite(WIDTH / 2 - 100, (HEIGHT * 5) / 8, EnemyConfigs.enemy1.texture).setAlpha(0.4);
                        const enemy2 = scene.add.sprite(WIDTH / 2, (HEIGHT * 5) / 8, EnemyConfigs.enemy2.texture).setAlpha(0.4);
                        const enemy3 = scene.add.sprite(WIDTH / 2 + 100, (HEIGHT * 5) / 8, EnemyConfigs.enemy3.texture).setAlpha(0.4);
                        [enemy1, enemy2, enemy3].forEach(t => scene.animateIn(t));
                        return [staticEnemy, enemy1, enemy2, enemy3];
                    },
                },
                {
                    text: 'These "scars" are residual energy from past battles. Currently dormant, but unstable.',
                    action: scene => {
                        const playerRift = drawRift(scene, WIDTH / 2 - 100, HEIGHT / 2, PlayerConfig.resonanceWave.pulseColor);
                        const dormantRift = drawRift(scene, WIDTH / 2 + 100, HEIGHT / 2, phaserColor(AppColors.UI_DISABLED));
                        return [...playerRift, ...dormantRift];
                    },
                },
                {
                    text: 'We need your help Guardian!'
                },
            ],
        };
    }
}
