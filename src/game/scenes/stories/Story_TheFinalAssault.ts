import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {EnemyConfigs, SpecialEnemyConfig} from "../../config/EnemyConfigs.ts";
import {drawRift} from "../lib/StoryUtils.ts";
import {PlayerConfig} from "../../config/PlayerConfig.ts";
import {createPhantom, createPlayer, createStatic} from "../../scripts/EntityMaker.ts";

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
                        const enemy1 = scene.add.sprite(WIDTH / 2 - 75, HEIGHT / 2 + 100, EnemyConfigs.enemy1.texture).setAlpha(0.4);
                        const enemy2 = scene.add.sprite(WIDTH / 2 - 25, HEIGHT / 2 + 100, EnemyConfigs.enemy2.texture).setAlpha(0.4);
                        const enemy3 = scene.add.sprite(WIDTH / 2 + 25, HEIGHT / 2 + 100, EnemyConfigs.enemy3.texture).setAlpha(0.4);
                        const upgradedEnemy = scene.add.sprite(WIDTH / 2 + 75, HEIGHT / 2 + 100, EnemyConfigs.upgradedEnemy.texture).setAlpha(0.4);
                        [enemy1, enemy2, enemy3, upgradedEnemy].forEach(t => scene.animateIn(t));
                        return [staticEnemy, enemy1, enemy2, enemy3, upgradedEnemy, ...genies];
                    },
                },
                {
                    text: 'A colossal wave of every Glitch type, including unprecedented numbers of Phantoms!',
                    action: scene => {
                        const phantom = createPhantom(scene, WIDTH / 2, HEIGHT / 2 - 75);
                        scene.animateIn(phantom);
                        const [player, genie] = createPlayer(scene, WIDTH / 2, HEIGHT * 3 / 4);
                        scene.animateIn(player);
                        return [phantom, player, genie];
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
