import {getStoryName, LevelNames} from './lib/LevelNames.ts';
import {GameObject} from '../core/GameObject';
import {AppColors, phaserColor} from '../scripts/Colors';
import {VisualPulse} from '../components/VisualPulse';
import {HEIGHT, WIDTH} from '../scripts/Util';
import {BaseStoryScene, StoryStep} from "./lib/BaseStoryScene.ts";
import {PlayerConfig} from "../config/PlayerConfig.ts";
import {EnemyConfigs, SpecialEnemyConfig} from "../config/EnemyConfigs.ts";
import {TowerConfigs} from "../config/TowerConfigs.ts";

export class StoryLevel1 extends BaseStoryScene {
    constructor() {
        super(
            getStoryName(LevelNames.HelloGenie)
        );
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: string } {
        return {
            title: 'Hello Genie',
            nextScene: LevelNames.HelloGenie,
            steps: [
                {
                    text: 'Hi! I am Genie.\nEven a Guardian needs a guide!',
                    action: scene => {
                        const player = new GameObject(scene, WIDTH / 2, HEIGHT * 3 / 4, PlayerConfig.texture);
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
                    text: 'We need your help Guardian!'
                },
            ],
        };
    }
}

export class StoryLevel2 extends BaseStoryScene {
    constructor() {
        super(
            getStoryName(LevelNames.TrustMe)
        );
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: string } {
        return {
            title: 'Trust Me',
            nextScene: LevelNames.TrustMe,
            steps: [
                {
                    text: "The Glitches have identified more paths to the nexus\nIt's not looking good.",
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
                    text: "But I can still count on you, right?",
                    action: scene => {
                        const player = new GameObject(scene, WIDTH / 2, HEIGHT / 2 + 100, PlayerConfig.texture);
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

export class StoryLevel3 extends BaseStoryScene {
    constructor() {
        super(
            getStoryName(LevelNames.ThePhantom)
        );
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: string } {
        return {
            title: 'The Phantom',
            nextScene: LevelNames.ThePhantom,
            steps: [
                {
                    text: 'I have some news for you Guardian.',
                    action: scene => {
                        const player = new GameObject(scene, WIDTH / 2 - 100, HEIGHT / 2 - 100, PlayerConfig.texture);
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
                    text: 'The Phantom is on the move!',
                    action: scene => {
                        const phantom = new GameObject(scene, WIDTH / 2 + 100, HEIGHT / 2 - 100, SpecialEnemyConfig.texture).setAlpha(0.8);
                        scene.animateIn(phantom);
                        phantom.addComponent(
                            new VisualPulse(
                                SpecialEnemyConfig.pulseColor,
                                PlayerConfig.resonanceWave.pulseDelay, // Reusing player pulse delay for visual consistency
                                PlayerConfig.resonanceWave.pulseDuration, // Reusing player pulse duration
                                SpecialEnemyConfig.deactivationRadius,
                                PlayerConfig.resonanceWave.pulseTotalPulses, // Reusing player pulse total pulses
                                PlayerConfig.resonanceWave.pulseLineWidth // Reusing player pulse line width
                            )
                        );
                        return phantom;
                    },
                },
                {
                    text: 'It disables all towers',
                    action: scene => {
                        const tower1 = scene.add.sprite(WIDTH / 2 - 100, (HEIGHT * 3) / 4 - 100, TowerConfigs.tower1.texture).setAlpha(0.3);
                        const tower2 = scene.add.sprite(WIDTH / 2, (HEIGHT * 3) / 4 - 100, TowerConfigs.tower2.texture).setAlpha(0.3);
                        const tower3 = scene.add.sprite(WIDTH / 2 + 100, (HEIGHT * 3) / 4 - 100, TowerConfigs.tower3.texture).setAlpha(0.3);
                        [tower1, tower2, tower3].forEach(t => scene.animateIn(t));
                        return [tower1, tower2, tower3];
                    },
                },
                {
                    text: 'Only you can defeat the Phantom!',

                },
                {
                    text: 'Good Luck Guardian!',
                },
            ],
        };
    }
}

export class StoryLevel4 extends BaseStoryScene {
    constructor() {
        super(
            getStoryName(LevelNames.RiseOfStatic)
        );
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: string } {
        return {
            title: 'Rise of Static',
            nextScene: LevelNames.RiseOfStatic,
            steps: [
                {
                    text: "We don't know the source of Static's Power",
                    action: scene => {
                        const staticEnemy = scene.add.sprite(WIDTH / 2, HEIGHT / 4, 'static').setAlpha(0.3);
                        scene.animateIn(staticEnemy);
                        scene.tweens.add({
                            targets: staticEnemy,
                            scaleX: 1.1,
                            scaleY: 1.1,
                            duration: 1000,
                            yoyo: true,
                            repeat: -1,
                        });
                        return staticEnemy;
                    },
                },
                {
                    text: 'But with your help We can sample the remains of Phantom.',
                    action: scene => {
                        const phantom = new GameObject(scene, WIDTH / 2, HEIGHT / 2 - 100, SpecialEnemyConfig.texture).setAlpha(0.8);
                        scene.animateIn(phantom);
                        phantom.addComponent(
                            new VisualPulse(
                                SpecialEnemyConfig.pulseColor,
                                PlayerConfig.resonanceWave.pulseDelay, // Reusing player pulse delay for visual consistency
                                PlayerConfig.resonanceWave.pulseDuration, // Reusing player pulse duration
                                SpecialEnemyConfig.deactivationRadius,
                                PlayerConfig.resonanceWave.pulseTotalPulses, // Reusing player pulse total pulses
                                PlayerConfig.resonanceWave.pulseLineWidth // Reusing player pulse line width
                            )
                        );
                        return phantom;
                    },
                },
                {
                    text: 'And maybe together we can put an end to it all!',
                    action: scene => {
                        const player = new GameObject(scene, WIDTH / 2, HEIGHT / 2 + 100, PlayerConfig.texture);
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
                        return [player];
                    },
                },
                {
                    text: 'Oh no, there are more glitches!!',
                    action: scene => {
                        const enemy1 = scene.add.sprite(WIDTH / 2 - 100, (HEIGHT * 3) / 4, EnemyConfigs.enemy1.texture).setAlpha(0.8);
                        const enemy2 = scene.add.sprite(WIDTH / 2, (HEIGHT * 3) / 4, EnemyConfigs.enemy2.texture).setAlpha(0.8);
                        const enemy3 = scene.add.sprite(WIDTH / 2 + 100, (HEIGHT * 3) / 4, EnemyConfigs.enemy3.texture).setAlpha(0.8);
                        [enemy1, enemy2, enemy3].forEach(t => scene.animateIn(t));
                        return [enemy1, enemy2, enemy3];
                    },
                },
                {
                    text: 'You are needed Guardian!',
                },
            ],
        };
    }
}

export class StoryLevel5 extends BaseStoryScene {
    constructor() {
        super(
            getStoryName(LevelNames.Breakthrough)
        );
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: string } {
        return {
            title: 'Breakthrough',
            nextScene: LevelNames.Breakthrough,
            steps: [
                {
                    text: 'That was amazing, I know we can count on you!',
                    action: scene => {
                        const player = new GameObject(scene, WIDTH / 2 - 100, HEIGHT / 2 - 100, PlayerConfig.texture);
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
                    text: 'Also, I am close to sampling Phantom\nI need maybe 2 more for a breakthrough',
                    action: scene => {
                        const phantom = new GameObject(scene, WIDTH / 2 + 100, HEIGHT / 2 - 100, SpecialEnemyConfig.texture).setAlpha(0.8);
                        scene.animateIn(phantom);
                        phantom.addComponent(
                            new VisualPulse(
                                SpecialEnemyConfig.pulseColor,
                                PlayerConfig.resonanceWave.pulseDelay, // Reusing player pulse delay for visual consistency
                                PlayerConfig.resonanceWave.pulseDuration, // Reusing player pulse duration
                                SpecialEnemyConfig.deactivationRadius,
                                PlayerConfig.resonanceWave.pulseTotalPulses, // Reusing player pulse total pulses
                                PlayerConfig.resonanceWave.pulseLineWidth // Reusing player pulse line width
                            )
                        );
                        return phantom;
                    },
                },
                {
                    text: 'Can you do that, Guardian?'
                },
            ],
        };
    }
}

export class StoryLevel6 extends BaseStoryScene {
    constructor() {
        super(
            getStoryName(LevelNames.TheCliffhanger),
        );
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: string } {
        return {
            title: 'The Cliffhanger',
            nextScene: 'MenuScene',
            steps: [
                {
                    text: 'Even the Genie couldn\'t figure out',
                },
                {
                    text: 'But the developer might!',
                },
                {
                    text: 'Please reach out if you would like the story to proceed...',
                },
            ],
        };
    }
}
