import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {EnemyConfigs} from "../../config/EnemyConfigs.ts";
import {createStatic} from "../../scripts/EntityMaker.ts";
import {GameObject} from "../../core/GameObject.ts";

export class Story_StaticNewGlitches extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_StaticNewGlitches); // Corrected: Use LevelNames.Story_StaticNewGlitches directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'Static\'s New Glitches',
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_StaticNewGlitches],
            steps: [
                {
                    text: 'Genie: Static senses your growing strength, Guardian.\nIt has unleashed a new Glitch!',
                    action: scene => {
                        this.backgroundEffectsManager.enableGlitchAnnihilationEffect(scene);
                        const [staticEnemy, ...genies] = createStatic(scene,WIDTH / 2, HEIGHT / 4);
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
                    text: 'This one is tanky and faster than the others!',
                    action: scene => {
                        const newGlitch = new GameObject(scene, WIDTH / 2, HEIGHT / 2 + 150, EnemyConfigs.upgradedEnemy.texture).setAlpha(0.65);
                        scene.add.existing(newGlitch);
                        this.onHover(newGlitch, EnemyConfigs.upgradedEnemy.name);
                        scene.animateIn(newGlitch);
                        return [newGlitch];
                    }
                },
                {
                    text: 'Beware of them, Guardian!\nRemember, I am with you!',
                },
            ],
        };
    }
}
