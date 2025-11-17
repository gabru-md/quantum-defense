import {LevelNames} from '../lib/LevelNames.ts';
import {GameObject} from '../../core/GameObject.ts';
import {VisualPulse} from '../../components/VisualPulse.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {PlayerConfig} from "../../config/PlayerConfig.ts";
import {SpecialEnemyConfig} from "../../config/EnemyConfigs.ts";
import {drawRift} from "../lib/StoryUtils.ts";

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
            nextScene: LevelNames.Gameplay_TheResonanceWave, // Return to menu after final story
            steps: [
                {
                    text: 'Genie: The last Phantom falls! Static\'s core is exposed – a raw, pulsating mass!',
                    action: scene => {
                        this.backgroundEffectsManager.enableGlitchAnnihilationEffect(scene);
                        const staticCore = scene.add.sprite(WIDTH / 2, HEIGHT / 2, 'static').setAlpha(0.8).setScale(1.5, 1.5);
                        scene.animateIn(staticCore);
                        scene.tweens.add({
                            targets: staticCore,
                            scaleX: 1.6,
                            scaleY: 1.6,
                            duration: 700,
                            yoyo: true,
                            repeat: -1,
                        });
                        return staticCore;
                    },
                },
                {
                    text: 'It\'s invulnerable to Phantom Killer towers. They were for its extensions, not the source!',
                    action: scene => {
                        const phantomKiller = scene.add.sprite(WIDTH / 2 - 100, HEIGHT * 3 / 4, 'phantom_killer_tower_texture').setAlpha(0.8);
                        scene.animateIn(phantomKiller);
                        const staticCore = scene.add.sprite(WIDTH / 2 + 100, HEIGHT / 2, 'static').setAlpha(0.8);
                        scene.animateIn(staticCore);
                        // Show phantom killer ineffective
                        scene.tweens.add({
                            targets: phantomKiller,
                            alpha: 0.2,
                            duration: 300,
                            yoyo: true,
                            repeat: 1,
                        });
                        return [phantomKiller, staticCore];
                    },
                },
                {
                    text: 'Only your pure Resonance Wave, amplified by a final surge of Quantum Echoes, can destroy it!',
                    action: scene => {
                        const player = new GameObject(scene, WIDTH / 2 - 100, HEIGHT * 3 / 4, PlayerConfig.texture);
                        scene.add.existing(player);
                        scene.animateIn(player);
                        player.addComponent(
                            new VisualPulse(
                                PlayerConfig.resonanceWave.pulseColor,
                                PlayerConfig.resonanceWave.pulseDelay,
                                PlayerConfig.resonanceWave.pulseDuration,
                                PlayerConfig.resonanceWave.activationRange,
                                PlayerConfig.resonanceWave.pulseTotalPulses,
                                PlayerConfig.resonanceWave.pulseLineWidth
                            )
                        );
                        const quantumEcho = scene.add.sprite(WIDTH / 2 + 100, HEIGHT / 2, 'quantum_echo_texture').setAlpha(0.8);
                        scene.animateIn(quantumEcho);
                        return [player, quantumEcho];
                    },
                },
                {
                    text: 'Collect any remaining Echoes from the now-exposed, highly volatile rifts!',
                    action: scene => {
                        const volatileRift1 = drawRift(scene, WIDTH / 2 - 150, HEIGHT / 2, SpecialEnemyConfig.pulseColor, null, 0.9);
                        const volatileRift2 = drawRift(scene, WIDTH / 2, HEIGHT / 2, SpecialEnemyConfig.pulseColor, null, 0.9);
                        const volatileRift3 = drawRift(scene, WIDTH / 2 + 150, HEIGHT / 2, SpecialEnemyConfig.pulseColor, null, 0.9);
                        const quantumEcho = scene.add.sprite(WIDTH / 2, HEIGHT * 3 / 4, 'quantum_echo_texture').setAlpha(0.8);
                        scene.animateIn(quantumEcho);
                        return [...volatileRift1, ...volatileRift2, ...volatileRift3, quantumEcho];
                    },
                },
                {
                    text: 'Unleash the most powerful Resonance Wave of your life, Guardian!',
                    action: scene => {
                        const player = new GameObject(scene, WIDTH / 2, HEIGHT * 3 / 4, PlayerConfig.texture);
                        scene.add.existing(player);
                        scene.animateIn(player);
                        player.addComponent(
                            new VisualPulse(
                                PlayerConfig.resonanceWave.pulseColor,
                                100, // Faster pulse for final wave
                                500, // Shorter duration
                                PlayerConfig.resonanceWave.activationRange * 2, // Larger range
                                5, // More pulses
                                PlayerConfig.resonanceWave.pulseLineWidth * 2 // Thicker line
                            )
                        );
                        const staticCore = scene.add.sprite(WIDTH / 2, HEIGHT / 4, 'static').setAlpha(0.8).setScale(1.5, 1.5);
                        scene.animateIn(staticCore);
                        return [player, staticCore];
                    },
                },
                {
                    text: 'The Static is annihilated! The Quantum Realm is restored, forever changed, but free!',
                    action: scene => {
                        this.backgroundEffectsManager.enableDataStreamEffect(scene); // Return to calm data stream
                        const player = new GameObject(scene, WIDTH / 2, HEIGHT / 2, PlayerConfig.texture);
                        scene.add.existing(player);
                        scene.animateIn(player);
                        player.addComponent(
                            new VisualPulse(
                                PlayerConfig.resonanceWave.pulseColor,
                                PlayerConfig.resonanceWave.pulseDelay,
                                PlayerConfig.resonanceWave.pulseDuration,
                                PlayerConfig.resonanceWave.activationRange,
                                PlayerConfig.resonanceWave.pulseTotalPulses,
                                PlayerConfig.resonanceWave.pulseLineWidth
                            )
                        );
                        return player;
                    },
                },
            ],
        };
    }
}
