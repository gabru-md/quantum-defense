import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {TowerConfigs} from "../../config/TowerConfigs.ts";
import {createPlayer} from "../../scripts/EntityMaker.ts";
import {GameObject} from "../../core/GameObject.ts";
export class Story_InitialBreakthrough extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_InitialBreakthrough); // Corrected: Use LevelNames.Story_InitialBreakthrough directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'Initial Breakthrough',
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_InitialBreakthrough],
            steps: [
                {
                    text: 'Genie: Amazing work, Guardian!\nYour collected samples are yielding results!',
                    action: scene => {
                        const [player, genie] = createPlayer(scene, WIDTH / 2, HEIGHT / 2 - 100);
                        scene.animateIn(player);
                        this.onHover(player, "You");
                        return [player, genie];
                    },
                },
                {
                    text: 'The Quantum Echoes hold the key to enhancing tower capabilities!',
                    action: scene => {
                        const quantumEcho = new GameObject(scene, WIDTH / 2, HEIGHT / 2 + 60, 'quantum_echo_texture').setAlpha(0.7);
                        scene.add.existing(quantumEcho);
                        this.onHover(quantumEcho, "Quantum Echo");
                        scene.animateIn(quantumEcho);
                        return quantumEcho;
                    },
                },
                {
                    text: 'This unlocks the first tier of tower upgrades!\nWe need to gather more!',
                    action: scene => {
                        let el = [];
                        let padding = 75;
                        for(let towerConfig of [TowerConfigs.tower1, TowerConfigs.tower2, TowerConfigs.tower3]) {
                            const tower = new GameObject(scene, WIDTH / 2 - 50, HEIGHT / 2 + 100 + padding, towerConfig.texture).setAlpha(0.5);
                            scene.add.existing(tower);
                            this.onHover(tower, towerConfig.name);
                            const tower_upgraded = new GameObject(scene, WIDTH / 2 + 50, HEIGHT / 2 + 100 + padding, towerConfig.upgradedTexture).setAlpha(0.5);
                            scene.add.existing(tower_upgraded);
                            this.onHover(tower_upgraded, towerConfig.upgradedName);
                            scene.animateIn(tower);
                            scene.animateIn(tower_upgraded);
                            scene.tweens.add({
                                targets: [tower, tower_upgraded],
                                scale: 1.2,
                                alpha: 1,
                                duration: 1000,
                                yoyo: true,
                                repeat: -1,
                            });
                            el.push(tower);
                            el.push(tower_upgraded);

                            // Add arrow between them with scene graphics
                            const graphics = scene.add.graphics({ lineStyle: { width: 4, color: 0xffffff, alpha: 0.8 } });
                            const startX = tower.x + tower.width / 2;
                            const startY = tower.y;
                            const endX = tower_upgraded.x - tower_upgraded.width / 2;
                            const endY = tower_upgraded.y;
                            graphics.lineBetween(startX, startY, endX, endY);
                            // Add arrowhead
                            graphics.fillTriangle(endX - 10, endY - 10, endX, endY, endX - 10, endY + 10);
                            el.push(graphics);

                            padding+=75;
                        }
                        return el;
                    }
                },
            ],
        };
    }
}
