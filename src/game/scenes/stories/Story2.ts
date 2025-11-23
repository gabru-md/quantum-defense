import {LevelNames} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {TowerConfigs} from "../../config/TowerConfigs.ts";
import {createNexusObject, createPlayer} from "../../scripts/EntityMaker.ts";
import {GameObject} from "../../core/GameObject.ts";

export class Story_TheFirstStand extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_TheFirstStand);
    }

    preload() {
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'The First Stand',
            nextScene: LevelNames.Gameplay_TheGlitchAnnihilation,
            steps: [
                {
                    text: 'Genie: Guardian! Can you hear me? I am... a fragment of the Nexus. Static\'s corruption is overwhelming... the Nexus is exposed!',
                    action: scene => {
                        this.backgroundEffectsManager.enableDataStreamEffect(scene);
                        this.backgroundEffectsManager.configureAndStartGlitchAnnihilationEffect(scene, 1250);
                        this.backgroundEffectsManager.enableGhostlyClashEffect(scene);
                        const [player, genie] = createPlayer(scene, WIDTH / 2, HEIGHT / 2 + 100);
                        scene.animateIn(player);
                        this.onHover(player, "This is you, Guardian!");
                        const [nexus, ...genies] = createNexusObject(this, WIDTH / 2, HEIGHT / 4);
                        scene.animateIn(nexus);
                        this.onHover(nexus, "The Nexus!");
                        return [player, genie, nexus, ...genies];
                    },
                },
                {
                    text: 'Genie: You must defend the Nexus! Your energy can manifest defensive towers. Do not let them through!',
                    action: scene => {
                        const enemy1 = new GameObject(scene, WIDTH / 2 - 100, HEIGHT / 2 + 250, 'enemy1');
                        scene.add.existing(enemy1);
                        this.onHover(enemy1, "Stutters");

                        const enemy2 = new GameObject(scene, WIDTH / 2 + 100, HEIGHT / 2 + 250, 'enemy2');
                        scene.add.existing(enemy2);
                        this.onHover(enemy2, "Surges");

                        [enemy1, enemy2].forEach(e => scene.animateIn(e));
                        return [enemy1, enemy2];
                    },
                },
                {
                    text: 'Genie: Deploy towers strategically to eliminate threats.',
                    action: scene => {
                        let towers: any = [];
                        let xPadding = -100;
                        for (let tower of [TowerConfigs.tower1, TowerConfigs.tower2]) { // Only show basic towers
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
                    text: 'Genie: You did it! Your connection to the Nexus is strong. But this is just the beginning. Static knows you are here now.',
                },
            ],
        };
    }
}
