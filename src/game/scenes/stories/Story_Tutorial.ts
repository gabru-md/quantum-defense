import {LevelNames} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {EnemyConfigs} from "../../config/EnemyConfigs.ts";
import {TowerConfigs} from "../../config/TowerConfigs.ts";
import {createNexusObject, createPhantom, createPlayer} from "../../scripts/EntityMaker.ts";

export class Story_Tutorial extends BaseStoryScene {
    constructor() {
        super(LevelNames.Tutorial);
    }

    preload() {
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'Introduction',
            nextScene: LevelNames.Gameplay_Tutorial, // Ensure this points to the new InteractiveTutorial
            steps: [
                {
                    text: 'Welcome, Guardian, to the Quantum Realm!',
                    action: scene => {
                        this.backgroundEffectsManager.enableDataStreamEffect(scene);
                        this.backgroundEffectsManager.configureAndStartGlitchAnnihilationEffect(scene, 1250);
                        this.backgroundEffectsManager.enableGhostlyClashEffect(scene);
                        const [player, genie] = createPlayer(scene, WIDTH / 2, HEIGHT / 2 + 100);
                        scene.animateIn(player);
                        return [player, genie];
                    },
                },
                {
                    text: 'Your mission is to defend the Nexus from incoming Glitches.',
                    action: scene => {
                        const [nexus, ...genies] = createNexusObject(this, WIDTH / 2, HEIGHT / 4);
                        scene.animateIn(nexus);
                        const padding = 100;
                        const phantom = createPhantom(this, WIDTH / 2, HEIGHT / 2 + 200 + padding);
                        scene.animateIn(phantom);
                        const enemy1 = scene.add.sprite(WIDTH / 2 - 35, HEIGHT / 2 + 250 + padding, EnemyConfigs.enemy1.texture).setAlpha(0.8);
                        const enemy2 = scene.add.sprite(WIDTH / 2 + 35, HEIGHT / 2 + 250 + padding, EnemyConfigs.enemy2.texture).setAlpha(0.8);
                        const enemy3 = scene.add.sprite(WIDTH / 2 - 70, HEIGHT / 2 + 300 + padding, EnemyConfigs.enemy3.texture).setAlpha(0.8);
                        const upgradedEnemy = scene.add.sprite(WIDTH / 2 + 70, HEIGHT / 2 + 300 + padding, EnemyConfigs.upgradedEnemy.texture).setAlpha(0.8);
                        [enemy1, enemy2, enemy3, upgradedEnemy].forEach(e => scene.animateIn(e));
                        return [nexus, phantom, enemy1, enemy2, enemy3, upgradedEnemy, ...genies];
                    },
                },
                {
                    text: 'Deploy towers strategically to eliminate threats.',
                    action: scene => {
                        let towers: any = [];
                        let xPadding = -100;
                        for (let tower of [TowerConfigs.tower1, TowerConfigs.tower2, TowerConfigs.tower3]) {
                            const towerSprite = scene.add.sprite(WIDTH / 2 + xPadding, HEIGHT / 2 + 200, tower.texture).setAlpha(0.8);
                            scene.animateIn(towerSprite);
                            towers.push(towerSprite);
                            xPadding += 100;
                        }
                        return towers;
                    },
                },
                {
                    text: 'Good luck, Guardian!\nThe fate of the Quantum Realm rests on you.',
                },
            ],
        };
    }
}
