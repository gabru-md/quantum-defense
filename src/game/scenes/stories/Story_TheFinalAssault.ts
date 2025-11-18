import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {GameObject} from '../../core/GameObject.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {EnemyConfigs, SpecialEnemyConfig} from "../../config/EnemyConfigs.ts";
import {drawRift} from "../lib/StoryUtils.ts";
import {VisualPulse} from "../../components/VisualPulse.ts";
import {PlayerConfig} from "../../config/PlayerConfig.ts";
import {Genie} from "../../entities/Genie.ts";

export class Story_TheFinalAssault extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_TheFinalAssault); // Corrected: Use LevelNames.Story_TheFinalAssault directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'The Final Assault',
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_TheFinalAssault],
            steps: [
                {
                    text: 'Genie: Static is enraged! It launches an all-out, desperate assault!',
                    action: scene => {
                        this.backgroundEffectsManager.configureAndStartGlitchAnnihilationEffect(scene, 800);
                        const staticEnemy = scene.add.sprite(WIDTH / 2, HEIGHT / 4, 'static').setAlpha(0.3).setScale(1.15, 1.15);
                        scene.animateIn(staticEnemy);
                        scene.tweens.add({
                            targets: staticEnemy,
                            scaleX: 1.1,
                            scaleY: 1.1,
                            duration: 1000,
                            yoyo: true,
                            repeat: -1,
                        });
                        const enemy1 = scene.add.sprite(WIDTH / 2 - 75, HEIGHT / 2 + 100, EnemyConfigs.enemy1.texture).setAlpha(0.4);
                        const enemy2 = scene.add.sprite(WIDTH / 2 - 25, HEIGHT / 2 + 100, EnemyConfigs.enemy2.texture).setAlpha(0.4);
                        const enemy3 = scene.add.sprite(WIDTH / 2 + 25, HEIGHT / 2 + 100, EnemyConfigs.enemy3.texture).setAlpha(0.4);
                        const upgradedEnemy = scene.add.sprite(WIDTH / 2 + 75, HEIGHT / 2 + 100, EnemyConfigs.upgradedEnemy.texture).setAlpha(0.4);
                        [enemy1, enemy2, enemy3, upgradedEnemy].forEach(t => scene.animateIn(t));
                        return [staticEnemy, enemy1, enemy2, enemy3, upgradedEnemy];
                    },
                },
                {
                    text: 'A colossal wave of every Glitch type, including unprecedented numbers of Phantoms!',
                    action: scene => {
                        const phantom = new GameObject(scene, WIDTH / 2, HEIGHT / 2 - 75, SpecialEnemyConfig.texture).setAlpha(0.8);
                        scene.add.existing(phantom);
                        scene.animateIn(phantom);
                        phantom.addComponent(
                            new VisualPulse(
                                SpecialEnemyConfig.pulseColor,
                                PlayerConfig.resonanceWave.pulseDelay,
                                PlayerConfig.resonanceWave.pulseDuration,
                                SpecialEnemyConfig.deactivationRadius,
                                PlayerConfig.resonanceWave.pulseTotalPulses,
                                PlayerConfig.resonanceWave.pulseLineWidth
                            )
                        );
                        const player = new GameObject(scene, WIDTH / 2, HEIGHT * 3 / 4, PlayerConfig.texture);
                        scene.add.existing(player);
                        scene.animateIn(player);
                        const genie = new Genie(this, player);
                        scene.add.existing(genie);
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
                        return [phantom, player];
                    },
                },
                {
                    text: 'Strategically deploy Phantom Killer towers to neutralize the Phantom threat.',
                    action: scene => {
                        const phantomKiller1 = scene.add.sprite(WIDTH / 2 - 50, HEIGHT / 2 + 200, 'specialTower').setAlpha(0.8);
                        const phantomKiller2 = scene.add.sprite(WIDTH / 2 + 50, HEIGHT / 2 + 200, 'specialTower').setAlpha(0.8);
                        [phantomKiller1, phantomKiller2].forEach(t => scene.animateIn(t));
                        return [phantomKiller1, phantomKiller2];
                    },
                },
                {
                    text: 'Carefully manage tower placement around the still-malfunctioning rifts.',
                    action: scene => {
                        const phantomRift1 = drawRift(scene, WIDTH / 2 - 400, HEIGHT / 4, SpecialEnemyConfig.pulseColor);
                        const phantomRift2 = drawRift(scene, WIDTH / 2 + 400, HEIGHT / 4, SpecialEnemyConfig.pulseColor);
                        const playerRift1 = drawRift(scene, WIDTH / 2 - 400, HEIGHT * 3 / 4, PlayerConfig.resonanceWave.pulseColor);
                        const playerRift2 = drawRift(scene, WIDTH / 2 + 400, HEIGHT * 3 / 4, PlayerConfig.resonanceWave.pulseColor);
                        return [...phantomRift1, ...phantomRift2, ...playerRift1, ...playerRift2];
                    },
                },
            ],
        };
    }
}
