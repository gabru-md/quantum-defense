import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {EnemyConfigs} from "../../config/EnemyConfigs.ts";
import {drawRift} from "../lib/StoryUtils.ts";
import {AppColors, phaserColor} from "../../scripts/Colors.ts";
import {createNexusObject, createPlayer} from "../../scripts/EntityMaker.ts";
import {GameObject} from "../../core/GameObject.ts";

export class Story_TheDormantScars extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_TheDormantScars); // Corrected: Use LevelNames.Story_TheDormantScars directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'The Dormant Scars',
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_TheDormantScars],
            steps: [
                {
                    text: "The Glitches have identified more paths to the nexus\nIt's not looking good.",
                    action: scene => {
                        this.backgroundEffectsManager.configureAndStartGlitchAnnihilationEffect(scene, 1250);
                        const [nexus, ...genies] = createNexusObject(scene, WIDTH / 2, HEIGHT / 4);
                        scene.animateIn(nexus);
                        this.onHover(nexus, "The Nexus!");
                        scene.tweens.add({
                            targets: nexus,
                            scaleX: 1.1,
                            scaleY: 1.1,
                            duration: 2000,
                            yoyo: true,
                            repeat: -1,
                        });

                        const enemy1 = new GameObject(scene, WIDTH / 2 - 100, (HEIGHT * 3) / 4, EnemyConfigs.enemy1.texture).setAlpha(0.8);
                        scene.add.existing(enemy1);
                        this.onHover(enemy1, EnemyConfigs.enemy1.name);
                        const enemy1_2 = new GameObject(scene, WIDTH / 2 - 50, (HEIGHT * 3) / 4, EnemyConfigs.enemy1.texture).setAlpha(0.8);
                        scene.add.existing(enemy1_2);
                        this.onHover(enemy1_2, EnemyConfigs.enemy1.name);
                        const enemy2 = new GameObject(scene, WIDTH / 2, (HEIGHT * 3) / 4, EnemyConfigs.enemy2.texture).setAlpha(0.8);
                        scene.add.existing(enemy2);
                        this.onHover(enemy2, EnemyConfigs.enemy2.name);
                        const enemy2_2 = new GameObject(scene, WIDTH / 2 + 50, (HEIGHT * 3) / 4, EnemyConfigs.enemy2.texture).setAlpha(0.8);
                        scene.add.existing(enemy2_2);
                        this.onHover(enemy2_2, EnemyConfigs.enemy2.name);
                        const enemy3 = new GameObject(scene, WIDTH / 2 + 100, (HEIGHT * 3) / 4, EnemyConfigs.enemy3.texture).setAlpha(0.8);
                        scene.add.existing(enemy3);
                        this.onHover(enemy3, EnemyConfigs.enemy3.name);
                        const enemy3_2 = new GameObject(scene, WIDTH / 2 + 150, (HEIGHT * 3) / 4, EnemyConfigs.enemy3.texture).setAlpha(0.8);
                        scene.add.existing(enemy3_2);
                        this.onHover(enemy3_2, EnemyConfigs.enemy3.name);
                        [enemy1, enemy1_2, enemy2, enemy2_2, enemy3, enemy3_2].forEach(t => scene.animateIn(t));
                        return [nexus, enemy1, enemy1_2, enemy2, enemy2_2, enemy3, enemy3_2, ...genies];
                    },
                },
                {
                    text: "These dormant rifts block tower deployment.\nToo unstable for construction.",
                    action: scene => {

                        this.visuals.forEach(v => scene.fadeOut(v));
                        const dormantRift1 = drawRift(scene, WIDTH / 2 - 550, HEIGHT / 2, phaserColor(AppColors.UI_DISABLED));
                        const dormantRift2 = drawRift(scene, WIDTH / 2, HEIGHT / 2 + 300, phaserColor(AppColors.UI_DISABLED));
                        const dormantRift3 = drawRift(scene, WIDTH / 2 + 550, HEIGHT / 2, phaserColor(AppColors.UI_DISABLED));
                        return [...dormantRift1, ...dormantRift2, ...dormantRift3];
                    },
                },
                {
                    text: "But I can still count on you, right?",
                    action: scene => {
                        const [player, genie] = createPlayer(scene, WIDTH / 2, HEIGHT / 2 + 100);
                        scene.animateIn(player);
                        this.onHover(player, "This is you, Guardian!");
                        return [player, genie];
                    },
                },
            ],
        };
    }
}
