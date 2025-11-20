import {LevelNames} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {TowerConfigs} from "../../config/TowerConfigs.ts";
import {createNexusObject, createPhantom, createPlayer} from "../../scripts/EntityMaker.ts";
import {GameObject} from "../../core/GameObject.ts";

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
                        this.onHover(player, "This is you, Guardian!")
                        return [player, genie];
                    },
                },
                {
                    text: 'Your mission is to defend the Nexus from incoming Glitches.',
                    action: scene => {
                        const [nexus, ...genies] = createNexusObject(this, WIDTH / 2, HEIGHT / 4);
                        scene.animateIn(nexus);
                        this.onHover(nexus, "The Nexus!")
                        const padding = 100;
                        const phantom = createPhantom(this, WIDTH / 2, HEIGHT / 2 + 200 + padding);
                        scene.animateIn(phantom);
                        this.onHover(phantom, "The Phantom")

                        const enemy1 = new GameObject(scene, WIDTH / 2 - 35, HEIGHT / 2 + 250 + padding, 'enemy1');
                        scene.add.existing(enemy1);
                        this.onHover(enemy1, "Stutters")

                        const enemy2 = new GameObject(scene, WIDTH / 2 + 35, HEIGHT / 2 + 250 + padding, 'enemy2');
                        scene.add.existing(enemy2);
                        this.onHover(enemy2, "Surges")

                        const enemy3 = new GameObject(scene, WIDTH / 2 - 70, HEIGHT / 2 + 300 + padding, 'enemy3');
                        scene.add.existing(enemy3);
                        this.onHover(enemy3, "Brutes")

                        const upgradedEnemy = new GameObject(scene, WIDTH / 2 + 70, HEIGHT / 2 + 300 + padding, 'upgradedEnemy');
                        scene.add.existing(upgradedEnemy);
                        this.onHover(upgradedEnemy, "Brutus");

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
                            const towerSprite = new GameObject(scene, WIDTH / 2 + xPadding, HEIGHT / 2 + 200, tower.texture).setAlpha(0.8);
                            scene.add.existing(towerSprite);
                            scene.animateIn(towerSprite);
                            towers.push(towerSprite);
                            xPadding += 100;
                            this.onHover(towerSprite, tower.name);
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
