import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {GameObject} from '../../core/GameObject.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {EnemyConfigs, SpecialEnemyConfig} from "../../config/EnemyConfigs.ts";
import {TowerConfigs} from "../../config/TowerConfigs.ts";
import {drawRift} from "../lib/StoryUtils.ts";

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
                        const enemy1 = scene.add.sprite(WIDTH / 2 - 150, HEIGHT * 3 / 4, EnemyConfigs.enemy1.texture).setAlpha(0.4);
                        const enemy2 = scene.add.sprite(WIDTH / 2, HEIGHT * 3 / 4, EnemyConfigs.enemy2.texture).setAlpha(0.4);
                        const enemy3 = scene.add.sprite(WIDTH / 2 + 150, HEIGHT * 3 / 4, EnemyConfigs.enemy3.texture).setAlpha(0.4);
                        [enemy1, enemy2, enemy3].forEach(t => scene.animateIn(t));
                        return [staticEnemy, enemy1, enemy2, enemy3];
                    },
                },
                {
                    text: 'A colossal wave of every Glitch type, including unprecedented numbers of Phantoms!',
                    action: scene => {
                        const phantom1 = new GameObject(scene, WIDTH / 2 - 100, HEIGHT / 2, SpecialEnemyConfig.texture).setAlpha(0.8);
                        const phantom2 = new GameObject(scene, WIDTH / 2 + 100, HEIGHT / 2, SpecialEnemyConfig.texture).setAlpha(0.8);
                        [phantom1, phantom2].forEach(t => scene.animateIn(t));
                        return [phantom1, phantom2];
                    },
                },
                {
                    text: 'Strategically deploy Phantom Killer towers to neutralize the Phantom threat.',
                    action: scene => {
                        const phantomKiller1 = scene.add.sprite(WIDTH / 2 - 150, HEIGHT * 3 / 4, 'phantom_killer_tower_texture').setAlpha(0.8);
                        const phantomKiller2 = scene.add.sprite(WIDTH / 2 + 150, HEIGHT * 3 / 4, 'phantom_killer_tower_texture').setAlpha(0.8);
                        [phantomKiller1, phantomKiller2].forEach(t => scene.animateIn(t));
                        return [phantomKiller1, phantomKiller2];
                    },
                },
                {
                    text: 'Carefully manage tower placement around the still-malfunctioning rifts.',
                    action: scene => {
                        const phantomRift1 = drawRift(scene, WIDTH / 2 - 100, HEIGHT / 2, SpecialEnemyConfig.pulseColor);
                        const phantomRift2 = drawRift(scene, WIDTH / 2 + 100, HEIGHT / 2, SpecialEnemyConfig.pulseColor);
                        const tower = scene.add.sprite(WIDTH / 2, HEIGHT * 3 / 4, TowerConfigs.tower1.texture).setAlpha(0.5);
                        scene.animateIn(tower);
                        scene.tweens.add({
                            targets: tower,
                            alpha: 0.1,
                            scale: 0.8,
                            duration: 300,
                            yoyo: true,
                            repeat: -1,
                        });
                        return [...phantomRift1, ...phantomRift2, tower];
                    },
                },
            ],
        };
    }
}
