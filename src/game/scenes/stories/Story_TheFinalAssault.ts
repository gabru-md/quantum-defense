import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {EnemyConfigs, SpecialEnemyConfig} from "../../config/EnemyConfigs.ts";
import {drawRift} from "../lib/StoryUtils.ts";
import {PlayerConfig} from "../../config/PlayerConfig.ts";
import {createPhantom, createPlayer, createStatic} from "../../scripts/EntityMaker.ts";
import {GameObject} from "../../core/GameObject.ts";
import {TowerConfigs} from "../../config/TowerConfigs.ts";

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
                        this.onHover(staticEnemy, "Static");
                        scene.tweens.add({
                            targets: staticEnemy,
                            scaleX: 1.1,
                            scaleY: 1.1,
                            duration: 1000,
                            yoyo: true,
                            repeat: -1,
                        });
                        const enemy1 = new GameObject(scene, WIDTH / 2 - 75, HEIGHT / 2 + 100, EnemyConfigs.enemy1.texture).setAlpha(0.4);
                        scene.add.existing(enemy1);
                        this.onHover(enemy1, EnemyConfigs.enemy1.name);
                        const enemy2 = new GameObject(scene, WIDTH / 2 - 25, HEIGHT / 2 + 100, EnemyConfigs.enemy2.texture).setAlpha(0.4);
                        scene.add.existing(enemy2);
                        this.onHover(enemy2, EnemyConfigs.enemy2.name);
                        const enemy3 = new GameObject(scene, WIDTH / 2 + 25, HEIGHT / 2 + 100, EnemyConfigs.enemy3.texture).setAlpha(0.4);
                        scene.add.existing(enemy3);
                        this.onHover(enemy3, EnemyConfigs.enemy3.name);
                        const upgradedEnemy = new GameObject(scene, WIDTH / 2 + 75, HEIGHT / 2 + 100, EnemyConfigs.upgradedEnemy.texture).setAlpha(0.4);
                        scene.add.existing(upgradedEnemy);
                        this.onHover(upgradedEnemy, EnemyConfigs.upgradedEnemy.name);
                        [enemy1, enemy2, enemy3, upgradedEnemy].forEach(t => scene.animateIn(t));
                        return [staticEnemy, enemy1, enemy2, enemy3, upgradedEnemy, ...genies];
                    },
                },
                {
                    text: 'A colossal wave of every Glitch type, including unprecedented numbers of Phantoms!',
                    action: scene => {
                        const phantom = createPhantom(scene, WIDTH / 2, HEIGHT / 2 - 75);
                        scene.animateIn(phantom);
                        this.onHover(phantom, "Phantom");
                        const [player, genie] = createPlayer(scene, WIDTH / 2, HEIGHT * 3 / 4);
                        scene.animateIn(player);
                        this.onHover(player, "You");
                        return [phantom, player, genie];
                    },
                },
                {
                    text: 'Strategically deploy Phantom Killer towers to neutralize the Phantom threat.',
                    action: scene => {
                        const phantomKiller1 = new GameObject(scene, WIDTH / 2 - 50, HEIGHT / 2 + 200, 'specialTower').setAlpha(0.8);
                        scene.add.existing(phantomKiller1);
                        this.onHover(phantomKiller1, TowerConfigs.specialTower.name);
                        const phantomKiller2 = new GameObject(scene, WIDTH / 2 + 50, HEIGHT / 2 + 200, 'specialTower').setAlpha(0.8);
                        scene.add.existing(phantomKiller2);
                        this.onHover(phantomKiller2, TowerConfigs.specialTower.name);
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
