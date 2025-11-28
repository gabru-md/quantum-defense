import {LevelNames} from '../lib/LevelNames.ts';
import {GameObject} from '../../core/GameObject.ts';
import {VisualPulse} from '../../components/VisualPulse.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {PlayerConfig} from "../../config/PlayerConfig.ts";
import {createPlayer, createStatic} from "../../scripts/EntityMaker.ts";
import {TowerConfigs} from "../../config/TowerConfigs.ts";

export class Story_TheResonanceWave extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_TheResonanceWave);
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'The Resonance Wave',
            nextScene: LevelNames.Gameplay_TheCore, // Next scene is Level 15
            steps: [
                {
                    text: 'Genie: The last Phantom falls! Static\'s core is exposed – a raw, pulsating mass!',
                    action: scene => {
                        this.backgroundEffectsManager.configureAndStartGlitchAnnihilationEffect(scene, 550);
                        const [staticCore, ...genies] = createStatic(scene, WIDTH / 2, HEIGHT / 4);
                        scene.animateIn(staticCore);
                        this.onHover(staticCore, "Static's Core");
                        scene.tweens.add({
                            targets: staticCore,
                            scaleX: 1,
                            scaleY: 1,
                            duration: 2000,
                            yoyo: true,
                            repeat: -1,
                        });
                        return [staticCore, ...genies];
                    },
                },
                {
                    text: 'Genie: It\'s invulnerable to Phantom Killer towers. They were for its extensions, not the source!',
                    action: scene => {
                        const phantomKiller = new GameObject(scene, WIDTH / 2, HEIGHT * 3 / 4 - 100, 'specialTower');
                        scene.add.existing(phantomKiller);
                        this.onHover(phantomKiller, TowerConfigs.specialTower.name);
                        scene.animateIn(phantomKiller);
                        scene.tweens.add({
                            targets: phantomKiller,
                            alpha: 0.6,
                            scale: 1.2,
                            duration: 500,
                            yoyo: true,
                            repeat: -1,
                        });
                        return [phantomKiller];
                    },
                },
                {
                    text: 'Genie: It\'s invulnerable... We can\'t stop it. Wait... the energy readings... The Core is unstable, exposed. It\'s not immune to everything. It\'s vulnerable to a pure, focused wave of the very energy it opposes. It\'s vulnerable to *you*.',
                    action: scene => {
                        const [player, genie] = createPlayer(scene, WIDTH / 2, HEIGHT * 3 / 4);
                        scene.animateIn(player);
                        this.onHover(player, "You");
                        return [player, genie];
                    },
                },
                {
                    text: 'Genie: Guardian, focus all your power. Your Resonance Wave... if you can amplify it with the residual energy from this final battle... you can wipe it out in one blow! This is our last chance!',
                    action: scene => {
                        // find player from visuals
                        for (const visual of scene.visuals) {
                            if (visual instanceof GameObject) {
                                if (visual.texture.key === PlayerConfig.texture) {
                                    visual.addComponentOverriding(new VisualPulse(
                                        PlayerConfig.resonanceWave.pulseColor,
                                        150, // Faster pulse for final wave
                                        500, // Shorter duration
                                        PlayerConfig.resonanceWave.activationRange * 2, // Larger range
                                        5, // More pulses
                                        PlayerConfig.resonanceWave.pulseLineWidth * 2 // Thicker line
                                    ))
                                }
                            }
                        }
                    },
                },
            ],
        };
    }
}
