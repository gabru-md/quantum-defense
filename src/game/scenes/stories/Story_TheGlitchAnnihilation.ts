import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {PlayerConfig} from "../../config/PlayerConfig.ts";
import {EnemyConfigs} from "../../config/EnemyConfigs.ts";
import {drawRift} from "../lib/StoryUtils.ts";
import {AppColors, phaserColor} from "../../scripts/Colors.ts";
import {createNexusObject, createPlayer, createStatic} from "../../scripts/EntityMaker.ts";
import {GameObject} from "../../core/GameObject.ts";

export class Story_TheGlitchAnnihilation extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_TheGlitchAnnihilation); // Corrected: Use LevelNames.Story_TheGlitchAnnihilation directly
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
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_TheGlitchAnnihilation],
            steps: [
                {
                    text: 'In the boundless expanse of the digital cosmos lies the Quantum Realm,\na domain of pure data and harmonious flow.',
                    action: scene => {
                        this.backgroundEffectsManager.enableDataStreamEffect(scene); // Ensure calm data stream
                        return []; // No specific game objects for this step, just background
                    },
                },
                {
                    text: 'But from the deepest void, Static emerged,\na malevolent entity corrupting all it touches with its Glitches.',
                    action: scene => {
                        this.backgroundEffectsManager.configureAndStartGlitchAnnihilationEffect(scene, 2000); // Transition to chaotic background


                        const [staticEnemy, ...genies] = createStatic(scene, WIDTH / 2, HEIGHT / 4);
                        scene.animateIn(staticEnemy);
                        this.onHover(staticEnemy, "Static");

                        const enemy1 = new GameObject(scene, WIDTH / 2 - 150, HEIGHT / 2 + 150, EnemyConfigs.enemy1.texture).setAlpha(0.4);
                        scene.add.existing(enemy1);
                        this.onHover(enemy1, EnemyConfigs.enemy1.name);
                        const enemy2 = new GameObject(scene, WIDTH / 2, HEIGHT / 2 + 150, EnemyConfigs.enemy2.texture).setAlpha(0.4);
                        scene.add.existing(enemy2);
                        this.onHover(enemy2, EnemyConfigs.enemy2.name);
                        const enemy3 = new GameObject(scene, WIDTH / 2 + 150, HEIGHT / 2 + 150, EnemyConfigs.enemy3.texture).setAlpha(0.4);
                        scene.add.existing(enemy3);
                        this.onHover(enemy3, EnemyConfigs.enemy3.name);
                        [enemy1, enemy2, enemy3].forEach(t => scene.animateIn(t));
                        return [staticEnemy, enemy1, enemy2, enemy3, ...genies];
                    },
                },
                {
                    text: 'You are the Guardian, the last line of defense.\nYour Resonance Wave is the only hope to restore balance.',
                    action: scene => {
                        const [player, genie] = createPlayer(scene, WIDTH / 2, HEIGHT * 3 / 4);
                        scene.animateIn(player);
                        this.onHover(player, "You");
                        return [player, genie];
                    },
                },
                {
                    text: 'Your first clash left a permanent scar – a rift, a reminder of the battles to come.',
                    action: scene => {
                        const playerRift = drawRift(scene, WIDTH * 3 / 4, HEIGHT / 4, PlayerConfig.resonanceWave.pulseColor);
                        const dormantRift = drawRift(scene, WIDTH / 4, HEIGHT * 3 / 4, phaserColor(AppColors.UI_DISABLED));
                        return [...playerRift, ...dormantRift];
                    },
                },
                {
                    text: 'The fight for the Quantum Realm has begun.\nProtect the Nexus at all costs!',
                    action: scene => {
                        const [nexus, ...genies] = createNexusObject(scene, WIDTH / 2, HEIGHT * 7 / 8);
                        scene.animateIn(nexus);
                        this.onHover(nexus, "Nexus");
                        scene.tweens.add({
                            targets: nexus,
                            scaleX: 0.8,
                            scaleY: 0.8,
                            duration: 2000,
                            yoyo: true,
                            repeat: -1,
                        });
                        return [nexus, ...genies];
                    },
                },
            ],
        };
    }
}
