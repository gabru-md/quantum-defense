import {LevelNames} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {EnemyConfigs} from "../../config/EnemyConfigs.ts";
import {createStatic} from "../../scripts/EntityMaker.ts";
import {GameObject} from "../../core/GameObject.ts";

export class Story_StaticNewGlitches extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_StaticNewGlitches);
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'Static\'s New Glitches',
            nextScene: LevelNames.Gameplay_BruteForce, // Next scene is Level 8
            steps: [
                {
                    text: 'Genie: (alarmed) Static is adapting to our new strength! It\'s reinforcing its Glitches, creating a new variant.',
                    action: scene => {
                        this.backgroundEffectsManager.enableGlitchAnnihilationEffect(scene);
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
                        return [staticEnemy, ...genies];
                    },
                },
                {
                    text: 'Genie: My scans indicate it\'s slower, but incredibly durable. A "Brute."',
                    action: scene => {
                        const brute = new GameObject(scene, WIDTH / 2, HEIGHT / 2 + 150, EnemyConfigs.enemy3.texture).setScale(0.1);
                        scene.add.existing(brute);
                        this.onHover(brute, EnemyConfigs.enemy3.name);
                        scene.animateIn(brute);
                        return [brute];
                    }
                },
                {
                    text: 'Genie: Our base towers are struggling against its armor! We need to focus fire. And we *definitely* need more upgrades.',
                },
            ],
        };
    }
}
