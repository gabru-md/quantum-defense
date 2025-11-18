import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {EnemyConfigs} from "../../config/EnemyConfigs.ts";

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

                        return [staticEnemy];
                    },
                },
                {
                    text: 'This one is tanky and faster than the others!',
                    action: scene => {
                        const newGlitch = scene.add.sprite(WIDTH / 2, HEIGHT / 2 + 150, EnemyConfigs.upgradedEnemy.texture).setAlpha(0.65);
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
