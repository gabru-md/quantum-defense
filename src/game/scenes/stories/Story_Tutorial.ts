import {LevelNames} from '../lib/LevelNames.ts';
import {GameObject} from '../../core/GameObject.ts';
import {VisualPulse} from '../../components/VisualPulse.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {PlayerConfig} from "../../config/PlayerConfig.ts";
import {EnemyConfigs} from "../../config/EnemyConfigs.ts";
import {TowerConfigs} from "../../config/TowerConfigs.ts";

export class Story_Tutorial extends BaseStoryScene {
    constructor() {
        super(LevelNames.Tutorial); // Corrected: Use LevelNames.Tutorial directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'Tutorial',
            nextScene: LevelNames.Gameplay_Tutorial,
            steps: [
                {
                    text: 'Welcome, Guardian, to the Quantum Realm!',
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
                        return player;
                    },
                },
                {
                    text: 'Your mission is to defend the Nexus from incoming Glitches.',
                    action: scene => {
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
                        const enemy = scene.add.sprite(WIDTH / 2, HEIGHT * 3 / 4, EnemyConfigs.enemy1.texture).setAlpha(0.4);
                        scene.animateIn(enemy);
                        return [nexus, enemy];
                    },
                },
                {
                    text: 'Deploy towers strategically to eliminate threats.',
                    action: scene => {
                        const tower = scene.add.sprite(WIDTH / 2, HEIGHT / 2, TowerConfigs.tower1.texture).setAlpha(0.5);
                        scene.animateIn(tower);
                        return tower;
                    },
                },
                {
                    text: 'Good luck, Guardian! The fate of the Quantum Realm rests on you.',
                },
            ],
        };
    }
}
