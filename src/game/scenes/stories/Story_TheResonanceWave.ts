import {LevelNames} from '../lib/LevelNames.ts';
import {GameObject} from '../../core/GameObject.ts';
import {VisualPulse} from '../../components/VisualPulse.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {PlayerConfig} from "../../config/PlayerConfig.ts";
import {SpecialEnemyConfig} from "../../config/EnemyConfigs.ts";
import {drawRift} from "../lib/StoryUtils.ts";
import {createPlayer, createStatic} from "../../scripts/EntityMaker.ts";
import {TowerConfigs} from "../../config/TowerConfigs.ts";

export class Story_TheResonanceWave extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_TheResonanceWave); // Corrected: Use LevelNames.Story_TheResonanceWave directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'The Resonance Wave',
            nextScene: LevelNames.Gameplay_ResonanceWave, // Return to menu after final story
            steps: [
                {
                    text: 'Genie: The last Phantom falls!\nStatic\'s core is exposed – a raw, pulsating mass!',
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
                    text: 'It\'s invulnerable to Phantom Killer towers.\nThey were for its extensions, not the source!',
                    action: scene => {
                        const phantomKiller = new GameObject(scene, WIDTH / 2, HEIGHT * 3 / 4 - 100, 'specialTower').setAlpha(0.8);
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
                    text: 'Only your pure Resonance Wave,\namplified by a final surge of Quantum Echoes, can destroy it!',
                    action: scene => {
                        const [player, genie] = createPlayer(scene, WIDTH / 2, HEIGHT * 3 / 4);
                        scene.animateIn(player);
                        this.onHover(player, "You");
                        return [player, genie];
                    },
                },
                {
                    text: 'Collect any remaining Echoes from the now-exposed,\nhighly volatile rifts!',
                    action: scene => {
                        const volatileRift1 = drawRift(scene, WIDTH / 2 - 400, HEIGHT / 4, PlayerConfig.resonanceWave.pulseColor, null, 0.9);
                        const volatileRift2 = drawRift(scene, WIDTH / 2, HEIGHT * 7 / 8, PlayerConfig.resonanceWave.pulseColor, SpecialEnemyConfig.pulseColor, 0.9);
                        const volatileRift3 = drawRift(scene, WIDTH / 2 + 400, HEIGHT / 4, SpecialEnemyConfig.pulseColor, null, 0.9);
                        return [...volatileRift1, ...volatileRift2, ...volatileRift3];
                    },
                },
                {
                    text: 'Unleash the most powerful Resonance Wave of your life, Guardian!',
                    action: scene => {
                        // find player from visuals
                        for (const visual of scene.visuals) {
                            if (visual instanceof GameObject) {
                                if (visual.texture.key === PlayerConfig.texture) {
                                    visual.addComponentOverriding(new VisualPulse(
                                        PlayerConfig.resonanceWave.pulseColor,
                                        100, // Faster pulse for final wave
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
