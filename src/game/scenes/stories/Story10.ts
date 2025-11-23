import {LevelNames} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {EnemyConfigs} from "../../config/EnemyConfigs.ts";
import {createPhantom, createStatic} from "../../scripts/EntityMaker.ts";
import {GameObject} from "../../core/GameObject.ts";

export class Story_TheFinalAssault extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_TheFinalAssault);
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'The Final Assault',
            nextScene: LevelNames.Gameplay_TheAllOutWar_1, // Next scene is Level 13
            steps: [
                {
                    text: 'Genie: (urgent) Static is enraged! It knows we have a weapon that can harm its Phantoms. It\'s throwing everything it has at us in one final, desperate wave to destroy the Nexus before we can fully deploy our counter-attack!',
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
                        const enemy1 = new GameObject(scene, WIDTH / 2 - 75, HEIGHT / 2 + 100, EnemyConfigs.enemy1.texture).setScale(0.1);
                        scene.add.existing(enemy1);
                        this.onHover(enemy1, EnemyConfigs.enemy1.name);
                        const enemy2 = new GameObject(scene, WIDTH / 2 - 25, HEIGHT / 2 + 100, EnemyConfigs.enemy2.texture).setScale(0.1);
                        scene.add.existing(enemy2);
                        this.onHover(enemy2, EnemyConfigs.enemy2.name);
                        const enemy3 = new GameObject(scene, WIDTH / 2 + 25, HEIGHT / 2 + 100, EnemyConfigs.enemy3.texture).setScale(0.1);
                        scene.add.existing(enemy3);
                        this.onHover(enemy3, EnemyConfigs.enemy3.name);
                        [enemy1, enemy2, enemy3].forEach(t => scene.animateIn(t));
                        return [staticEnemy, enemy1, enemy2, enemy3, ...genies];
                    },
                },
                {
                    text: 'Genie: A colossal wave of every Glitch type, including unprecedented numbers of Phantoms!',
                    action: scene => {
                        const phantom1 = createPhantom(scene, WIDTH / 2 - 150, HEIGHT / 2 + 150);
                        scene.animateIn(phantom1);
                        this.onHover(phantom1, "Phantom");
                        const phantom2 = createPhantom(scene, WIDTH / 2 + 150, HEIGHT / 2 + 150);
                        scene.animateIn(phantom2);
                        this.onHover(phantom2, "Phantom");
                        return [phantom1, phantom2];
                    },
                },
                {
                    text: 'Genie: Hold the line, Guardian! This is for everything!',
                },
            ],
        };
    }
}
