import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {EnemyConfigs} from "../../config/EnemyConfigs.ts";
import {drawRift} from "../lib/StoryUtils.ts";
import {AppColors, phaserColor} from "../../scripts/Colors.ts";
import {createPlayer, createStatic} from "../../scripts/EntityMaker.ts";

export class Story_HelloGenie extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_HelloGenie); // Corrected: Use LevelNames.Story_HelloGenie directly
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
            title: 'Hello, Genie!',
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_HelloGenie],
            steps: [
                {
                    text: 'Hi! I am Genie.\nEven a Guardian needs a guide!',
                    action: scene => {
                        const [player, genie] = createPlayer(scene, WIDTH / 2, HEIGHT * 3 / 4);
                        scene.animateIn(player);
                        return [player, genie];
                    },
                },
                {
                    text: "Static's operations are rising rapidly,\nHe is sending out fleet of Glitches.",
                    action: scene => {
                        this.backgroundEffectsManager.configureAndStartGlitchAnnihilationEffect(scene, 1500);
                        const [staticEnemy, ...genies] = createStatic(scene, WIDTH / 2, HEIGHT / 4);
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
                        return [staticEnemy, enemy1, enemy2, enemy3, ...genies];
                    },
                },
                {
                    text: 'These "scars" are residual energy from past battles.\nCurrently dormant, but unstable.',
                    action: scene => {
                        const playerRift = drawRift(scene, WIDTH / 4, HEIGHT / 4, phaserColor(AppColors.UI_DISABLED));
                        const dormantRift = drawRift(scene, WIDTH * 3 / 4, HEIGHT * 3 / 4, phaserColor(AppColors.UI_DISABLED));
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
