import {LevelNames} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {TowerConfigs} from "../../config/TowerConfigs.ts";
import {GameObject} from "../../core/GameObject.ts";

export class Story_DesigningTheBane extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_DesigningTheBane);
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'Designing the Bane',
            nextScene: LevelNames.Gameplay_ThePrototype, // Next scene is Level 12
            steps: [
                {
                    text: 'Genie: If Phantoms exist on a different layer, we can\'t fight them on ours. We need a weapon that can attack across dimensions. Using the data from the Guardian Rifts, I\'ve designed a new tower schematic.',
                    action: scene => {
                        this.backgroundEffectsManager.enableDataStreamEffect(scene);
                        return [];
                    },
                },
                {
                    text: 'Genie: It\'s a resonance cannon that should be able to lock onto the Phantom\'s unique frequency. The Phantom Killer tower!',
                    action: scene => {
                        const phantomKiller = new GameObject(scene, WIDTH / 2, HEIGHT / 2, TowerConfigs.specialTower.texture).setScale(0.1);
                        scene.add.existing(phantomKiller);
                        this.onHover(phantomKiller, TowerConfigs.specialTower.name);
                        scene.animateIn(phantomKiller);
                        return [phantomKiller];
                    },
                },
                {
                    text: 'Genie: It\'s just a theory, and building it will require a massive amount of energy. But it\'s our only hope. We must protect the Nexus while we gather the resources to deploy it.',
                },
            ],
        };
    }
}
