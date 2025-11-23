import {LevelNames} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {EnemyConfigs} from "../../config/EnemyConfigs.ts";
import {createPlayer, createStatic} from "../../scripts/EntityMaker.ts";
import {GameObject} from "../../core/GameObject.ts";

export class Story_TheGlitchAnnihilation extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_TheGlitchAnnihilation);
    }

    preload() {
        super.preload();
    }

    create() {
        this.backgroundEffectsManager.enableDataStreamEffect(this, 'laminar');
        super.create();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'The Glitch Annihilation',
            nextScene: LevelNames.Gameplay_Tutorial, // Next scene is the Tutorial level
            steps: [
                {
                    text: 'NARRATOR (V.O.): In the boundless expanse of the digital cosmos lies the Quantum Realm, a domain of pure data and harmonious flow, watched over by the Nexus.',
                    action: scene => {
                        this.backgroundEffectsManager.enableDataStreamEffect(scene); // Serene System background
                        return [];
                    },
                },
                {
                    text: 'NARRATOR (V.O.): But from the deepest void, a corruption emerged. A sentient entropy named Static. It consumed all it touched, twisting perfect code into mindless, aggressive Glitches.',
                    action: scene => {
                        this.backgroundEffectsManager.configureAndStartGlitchAnnihilationEffect(scene, 2000); // Corrupted Frontier background
                        const [staticEnemy, ...genies] = createStatic(scene, WIDTH / 2, HEIGHT / 4);
                        scene.animateIn(staticEnemy);
                        this.onHover(staticEnemy, "Static");

                        const enemy1 = new GameObject(scene, WIDTH / 2 - 150, HEIGHT / 2 + 150, EnemyConfigs.enemy1.texture);
                        scene.add.existing(enemy1);
                        this.onHover(enemy1, EnemyConfigs.enemy1.name);
                        const enemy2 = new GameObject(scene, WIDTH / 2, HEIGHT / 2 + 150, EnemyConfigs.enemy2.texture);
                        scene.add.existing(enemy2);
                        this.onHover(enemy2, EnemyConfigs.enemy2.name);
                        const enemy3 = new GameObject(scene, WIDTH / 2 + 150, HEIGHT / 2 + 150, EnemyConfigs.enemy3.texture);
                        scene.add.existing(enemy3);
                        this.onHover(enemy3, EnemyConfigs.enemy3.name);
                        [enemy1, enemy2, enemy3].forEach(t => scene.animateIn(t));
                        return [staticEnemy, enemy1, enemy2, enemy3, ...genies];
                    },
                },
                {
                    text: 'NARRATOR (V.O.): In its darkest hour, the Nexus awakened its last defense. A single fragment of its own perfect code, forged into a weapon of order. The Guardian.',
                    action: scene => {
                        const [player, genie] = createPlayer(scene, WIDTH / 2, HEIGHT * 3 / 4);
                        scene.animateIn(player);
                        this.onHover(player, "The Guardian");
                        return [player, genie];
                    },
                },
            ],
        };
    }
}
