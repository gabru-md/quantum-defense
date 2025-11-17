import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {GameObject} from '../../core/GameObject.ts';
import {VisualPulse} from '../../components/VisualPulse.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {PlayerConfig} from "../../config/PlayerConfig.ts";
import {EnemyConfigs} from "../../config/EnemyConfigs.ts";
import {drawRift} from "../lib/StoryUtils.ts";
import {AppColors, phaserColor} from "../../scripts/Colors.ts";

export class Story_TheDormantScars extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_TheDormantScars); // Corrected: Use LevelNames.Story_TheDormantScars directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'The Dormant Scars',
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_TheDormantScars],
            steps: [
                {
                    text: "The Glitches have identified more paths to the nexus\nIt's not looking good.",
                    action: scene => {
                        this.backgroundEffectsManager.enableGlitchAnnihilationEffect(scene);
                        const nexus = scene.add.sprite(WIDTH / 2, HEIGHT / 4, 'nexus').setAlpha(0.3);
                        scene.animateIn(nexus);
                        scene.tweens.add({
                            targets: nexus,
                            scaleX: 1.1,
                            scaleY: 1.1,
                            duration: 2000,
                            yoyo: true,
                            repeat: -1,
                        });

                        const enemy1 = scene.add.sprite(WIDTH / 2 - 100, (HEIGHT * 3) / 4, EnemyConfigs.enemy1.texture).setAlpha(0.8);
                        const enemy1_2 = scene.add.sprite(WIDTH / 2 - 50, (HEIGHT * 3) / 4, EnemyConfigs.enemy1.texture).setAlpha(0.8);
                        const enemy2 = scene.add.sprite(WIDTH / 2, (HEIGHT * 3) / 4, EnemyConfigs.enemy2.texture).setAlpha(0.8);
                        const enemy2_2 = scene.add.sprite(WIDTH / 2 + 50, (HEIGHT * 3) / 4, EnemyConfigs.enemy2.texture).setAlpha(0.8);
                        const enemy3 = scene.add.sprite(WIDTH / 2 + 100, (HEIGHT * 3) / 4, EnemyConfigs.enemy3.texture).setAlpha(0.8);
                        const enemy3_2 = scene.add.sprite(WIDTH / 2 + 150, (HEIGHT * 3) / 4, EnemyConfigs.enemy3.texture).setAlpha(0.8);
                        [enemy1, enemy1_2, enemy2, enemy2_2, enemy3, enemy3_2].forEach(t => scene.animateIn(t));
                        return [nexus, enemy1, enemy1_2, enemy2, enemy2_2, enemy3, enemy3_2];
                    },
                },
                {
                    text: "These dormant rifts block tower deployment. Too unstable for construction.",
                    action: scene => {
                        const dormantRift1 = drawRift(scene, WIDTH / 2 - 150, HEIGHT / 2, phaserColor(AppColors.UI_DISABLED));
                        const dormantRift2 = drawRift(scene, WIDTH / 2, HEIGHT / 2, phaserColor(AppColors.UI_DISABLED));
                        const dormantRift3 = drawRift(scene, WIDTH / 2 + 150, HEIGHT / 2, phaserColor(AppColors.UI_DISABLED));
                        return [...dormantRift1, ...dormantRift2, ...dormantRift3];
                    },
                },
                {
                    text: "But I can still count on you, right?",
                    action: scene => {
                        const player = new GameObject(scene, WIDTH / 2, HEIGHT / 2 + 100, PlayerConfig.texture);
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
                        return player;
                    },
                },
            ],
        };
    }
}
