import {LevelNames, STORY_TO_GAMEPLAY_MAP} from './lib/LevelNames.ts';
import {GameObject} from '../core/GameObject';
import {VisualPulse} from '../components/VisualPulse';
import {HEIGHT, WIDTH} from '../scripts/Util';
import {BaseStoryScene, StoryStep} from "./lib/BaseStoryScene.ts";
import {PlayerConfig} from "../config/PlayerConfig.ts";
import {EnemyConfigs, SpecialEnemyConfig} from "../config/EnemyConfigs.ts";
import {TowerConfigs} from "../config/TowerConfigs.ts";
import {GlitchAnnihilationEffect} from "../effects/GlitchAnnihilationEffect.ts";
import {AppColors, phaserColor} from "../scripts/Colors.ts";
import Phaser from "phaser";

// Helper to draw rifts with specific colors
function drawRift(scene: BaseStoryScene, x: number, y: number, color: number, secondaryColor: number | null = null, alpha: number = 0.3) {

    const glitchEffect = new GlitchAnnihilationEffect(scene);
    glitchEffect.createDistantRift({
        x: x,
        y: y,
        scale: 4.5,
        outcome: 'player' // This outcome might need to be dynamic based on rift type
    });

    const riftElements = scene.riftManager.drawRiftElements(x, y, 3, Phaser.Math.FloatBetween(0.5, 0.87), color, secondaryColor, alpha);
    scene.riftManager.animateRiftIdle(riftElements);

    return [
        riftElements.core,
        riftElements.innerGlow,
        riftElements.outerGlow,
        ...riftElements.rays,
        ...riftElements.fragments
    ];
}

export class Story_Tutorial extends BaseStoryScene {
    constructor() {
        super(LevelNames.Tutorial); // Corrected: Use LevelNames.Tutorial directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'Tutorial',
            nextScene: LevelNames.Gameplay_Tutorial,
            steps: [
                {
                    text: 'Welcome, Guardian, to the Quantum Realm!',
                    action: scene => {
                        const player = new GameObject(scene, WIDTH / 2, HEIGHT * 3 / 4, PlayerConfig.texture);
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
                {
                    text: 'Your mission is to defend the Nexus from incoming Glitches.',
                    action: scene => {
                        const nexus = scene.add.sprite(WIDTH / 2, HEIGHT / 4, 'nexus').setAlpha(0.3);
                        scene.animateIn(nexus);
                        scene.tweens.add({
                            targets: nexus,
                            scaleX: 1.1,
                            scaleY: 1.1,
                            duration: 2000,
                            yoyo: true,
                            repeat: -1,
                        });
                        const enemy = scene.add.sprite(WIDTH / 2, HEIGHT * 3 / 4, EnemyConfigs.enemy1.texture).setAlpha(0.4);
                        scene.animateIn(enemy);
                        return [nexus, enemy];
                    },
                },
                {
                    text: 'Deploy towers strategically to eliminate threats.',
                    action: scene => {
                        const tower = scene.add.sprite(WIDTH / 2, HEIGHT / 2, TowerConfigs.tower1.texture).setAlpha(0.5);
                        scene.animateIn(tower);
                        return tower;
                    },
                },
                {
                    text: 'Good luck, Guardian! The fate of the Quantum Realm rests on you.',
                },
            ],
        };
    }
}

export class Story_TheGlitchAnnihilation extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_TheGlitchAnnihilation); // Corrected: Use LevelNames.Story_TheGlitchAnnihilation directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this, 'laminar');
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'The Glitch Annihilation',
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_TheGlitchAnnihilation],
            steps: [
                {
                    text: 'In the boundless expanse of the digital cosmos lies the Quantum Realm, a domain of pure data and harmonious flow.',
                    action: scene => {
                        this.backgroundEffectsManager.enableDataStreamEffect(scene); // Ensure calm data stream
                        return []; // No specific game objects for this step, just background
                    },
                },
                {
                    text: 'But from the deepest void, Static emerged, a malevolent entity corrupting all it touches with its Glitches.',
                    action: scene => {
                        this.backgroundEffectsManager.enableGlitchAnnihilationEffect(scene); // Transition to chaotic background
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
                        const enemy1 = scene.add.sprite(WIDTH / 2 - 150, HEIGHT / 2, EnemyConfigs.enemy1.texture).setAlpha(0.4);
                        const enemy2 = scene.add.sprite(WIDTH / 2, HEIGHT / 2, EnemyConfigs.enemy2.texture).setAlpha(0.4);
                        const enemy3 = scene.add.sprite(WIDTH / 2 + 150, HEIGHT / 2, EnemyConfigs.enemy3.texture).setAlpha(0.4);
                        [enemy1, enemy2, enemy3].forEach(t => scene.animateIn(t));
                        return [staticEnemy, enemy1, enemy2, enemy3];
                    },
                },
                {
                    text: 'You are the Guardian, the last line of defense. Your Resonance Wave is the only hope to restore balance.',
                    action: scene => {
                        const player = new GameObject(scene, WIDTH / 2, HEIGHT * 3 / 4, PlayerConfig.texture);
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
                {
                    text: 'Your first clash left a permanent scar – a rift, a reminder of the battles to come.',
                    action: scene => {
                        const playerRift = drawRift(scene, WIDTH / 2, HEIGHT / 2, PlayerConfig.resonanceWave.pulseColor);
                        return [...playerRift];
                    },
                },
                {
                    text: 'The fight for the Quantum Realm has begun. Protect the Nexus at all costs!',
                    action: scene => {
                        const nexus = scene.add.sprite(WIDTH / 2, HEIGHT * 7 / 8, 'nexus').setAlpha(0.3).setScale(0.75, 0.75);
                        scene.animateIn(nexus);
                        scene.tweens.add({
                            targets: nexus,
                            scaleX: 0.8,
                            scaleY: 0.8,
                            duration: 2000,
                            yoyo: true,
                            repeat: -1,
                        });
                        return nexus;
                    },
                },
            ],
        };
    }
}

export class Story_HelloGenie extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_HelloGenie); // Corrected: Use LevelNames.Story_HelloGenie directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'Hello, Genie!',
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_HelloGenie],
            steps: [
                {
                    text: 'Hi! I am Genie.\nEven a Guardian needs a guide!',
                    action: scene => {
                        const player = new GameObject(scene, WIDTH / 2, HEIGHT * 3 / 4, PlayerConfig.texture);
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

                        const nexus = scene.add.sprite(WIDTH / 2, HEIGHT * 7 / 8, 'nexus').setAlpha(0.3).setScale(0.75, 0.75);
                        scene.animateIn(nexus);
                        scene.tweens.add({
                            targets: nexus,
                            scaleX: 0.8,
                            scaleY: 0.8,
                            duration: 2000,
                            yoyo: true,
                            repeat: -1,
                        });
                        return [player, nexus];
                    },
                },
                {
                    text: "Static's operations are rising rapidly,\nHe is sending out fleet of Glitches.",
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

                        const enemy1 = scene.add.sprite(WIDTH / 2 - 100, (HEIGHT * 5) / 8, EnemyConfigs.enemy1.texture).setAlpha(0.4);
                        const enemy2 = scene.add.sprite(WIDTH / 2, (HEIGHT * 5) / 8, EnemyConfigs.enemy2.texture).setAlpha(0.4);
                        const enemy3 = scene.add.sprite(WIDTH / 2 + 100, (HEIGHT * 5) / 8, EnemyConfigs.enemy3.texture).setAlpha(0.4);
                        [enemy1, enemy2, enemy3].forEach(t => scene.animateIn(t));
                        return [staticEnemy, enemy1, enemy2, enemy3];
                    },
                },
                {
                    text: 'These "scars" are residual energy from past battles. Currently dormant, but unstable.',
                    action: scene => {
                        const playerRift = drawRift(scene, WIDTH / 2 - 100, HEIGHT / 2, PlayerConfig.resonanceWave.pulseColor);
                        const dormantRift = drawRift(scene, WIDTH / 2 + 100, HEIGHT / 2, phaserColor(AppColors.UI_DISABLED));
                        return [...playerRift, ...dormantRift];
                    },
                },
                {
                    text: 'We need your help Guardian!'
                },
            ],
        };
    }
}

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
                        this.backgroundEffectsManager.enableGlitchAnnihilationEffect(scene);
                        const nexus = scene.add.sprite(WIDTH / 2, HEIGHT / 4, 'nexus').setAlpha(0.3);
                        scene.animateIn(nexus);
                        scene.tweens.add({
                            targets: nexus,
                            scaleX: 1.1,
                            scaleY: 1.1,
                            duration: 2000,
                            yoyo: true,
                            repeat: -1,
                        });

                        const enemy1 = scene.add.sprite(WIDTH / 2 - 100, (HEIGHT * 3) / 4, EnemyConfigs.enemy1.texture).setAlpha(0.8);
                        const enemy1_2 = scene.add.sprite(WIDTH / 2 - 50, (HEIGHT * 3) / 4, EnemyConfigs.enemy1.texture).setAlpha(0.8);
                        const enemy2 = scene.add.sprite(WIDTH / 2, (HEIGHT * 3) / 4, EnemyConfigs.enemy2.texture).setAlpha(0.8);
                        const enemy2_2 = scene.add.sprite(WIDTH / 2 + 50, (HEIGHT * 3) / 4, EnemyConfigs.enemy2.texture).setAlpha(0.8);
                        const enemy3 = scene.add.sprite(WIDTH / 2 + 100, (HEIGHT * 3) / 4, EnemyConfigs.enemy3.texture).setAlpha(0.8);
                        const enemy3_2 = scene.add.sprite(WIDTH / 2 + 150, (HEIGHT * 3) / 4, EnemyConfigs.enemy3.texture).setAlpha(0.8);
                        [enemy1, enemy1_2, enemy2, enemy2_2, enemy3, enemy3_2].forEach(t => scene.animateIn(t));
                        return [nexus, enemy1, enemy1_2, enemy2, enemy2_2, enemy3, enemy3_2];
                    },
                },
                {
                    text: "These dormant rifts block tower deployment. Too unstable for construction.",
                    action: scene => {
                        const dormantRift1 = drawRift(scene, WIDTH / 2 - 150, HEIGHT / 2, phaserColor(AppColors.UI_DISABLED));
                        const dormantRift2 = drawRift(scene, WIDTH / 2, HEIGHT / 2, phaserColor(AppColors.UI_DISABLED));
                        const dormantRift3 = drawRift(scene, WIDTH / 2 + 150, HEIGHT / 2, phaserColor(AppColors.UI_DISABLED));
                        return [...dormantRift1, ...dormantRift2, ...dormantRift3];
                    },
                },
                {
                    text: "But I can still count on you, right?",
                    action: scene => {
                        const player = new GameObject(scene, WIDTH / 2, HEIGHT / 2 + 100, PlayerConfig.texture);
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

export class Story_ThePhantomArrival extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_ThePhantomArrival); // Corrected: Use LevelNames.Story_ThePhantomArrival directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'The Phantom\'s Arrival',
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_ThePhantomArrival],
            steps: [
                {
                    text: 'Guardian, I have some grave news.',
                    action: scene => {
                        this.backgroundEffectsManager.enableGhostlyClashEffect(scene);
                        const player = new GameObject(scene, WIDTH / 2 - 100, HEIGHT / 2 - 100, PlayerConfig.texture);
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
                {
                    text: 'The Phantom is on the move! Its presence activates a new, dangerous rift!',
                    action: scene => {
                        this.backgroundEffectsManager.enableGlitchAnnihilationEffect(scene);
                        const phantom = new GameObject(scene, WIDTH / 2 + 100, HEIGHT / 2 - 100, SpecialEnemyConfig.texture).setAlpha(0.8);
                        scene.add.existing(phantom);
                        scene.animateIn(phantom);
                        phantom.addComponent(
                            new VisualPulse(
                                SpecialEnemyConfig.pulseColor,
                                PlayerConfig.resonanceWave.pulseDelay,
                                PlayerConfig.resonanceWave.pulseDuration,
                                SpecialEnemyConfig.deactivationRadius,
                                PlayerConfig.resonanceWave.pulseTotalPulses,
                                PlayerConfig.resonanceWave.pulseLineWidth
                            )
                        );
                        const phantomRift = drawRift(scene, WIDTH / 2, HEIGHT / 2 + 100, SpecialEnemyConfig.pulseColor);
                        return [phantom, ...phantomRift];
                    },
                },
                {
                    text: 'This active rift is highly volatile and dangerous to approach.',
                },
            ],
        };
    }
}

export class Story_VolatileInterference extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_VolatileInterference); // Corrected: Use LevelNames.Story_VolatileInterference directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'Volatile Interference',
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_VolatileInterference],
            steps: [
                {
                    text: "Genie: Guardian, I've made a disturbing discovery!",
                    action: scene => {
                        this.backgroundEffectsManager.enableGlitchAnnihilationEffect(scene);
                        const phantomRift = drawRift(scene, WIDTH / 2, HEIGHT / 2 - 100, SpecialEnemyConfig.pulseColor);
                        return [...phantomRift];
                    },
                },
                {
                    text: 'The chaotic energy from active rifts interferes with tower functions!',
                    action: scene => {
                        const tower1 = scene.add.sprite(WIDTH / 2 - 100, (HEIGHT * 3) / 4 - 100, TowerConfigs.tower1.texture).setAlpha(0.3);
                        const tower2 = scene.add.sprite(WIDTH / 2, (HEIGHT * 3) / 4 - 100, TowerConfigs.tower2.texture).setAlpha(0.3);
                        const tower3 = scene.add.sprite(WIDTH / 2 + 100, (HEIGHT * 3) / 4 - 100, TowerConfigs.tower3.texture).setAlpha(0.3);
                        [tower1, tower2, tower3].forEach(t => scene.animateIn(t));
                        // Simulate malfunction visually
                        scene.tweens.add({
                            targets: [tower1, tower2, tower3],
                            alpha: 0.1,
                            duration: 500,
                            yoyo: true,
                            repeat: -1,
                        });
                        return [tower1, tower2, tower3];
                    },
                },
                {
                    text: 'Towers placed too close malfunction, losing effectiveness. Adapt your strategy!',
                },
                {
                    text: 'These rifts also emit Quantum Echoes. Collect them, but beware the risk!',
                    action: scene => {
                        const quantumEcho = scene.add.sprite(WIDTH / 2, HEIGHT / 2 + 100, 'quantum_echo_texture').setAlpha(0.8); // Placeholder texture
                        scene.animateIn(quantumEcho);
                        scene.tweens.add({
                            targets: quantumEcho,
                            scale: 1.2,
                            duration: 700,
                            yoyo: true,
                            repeat: -1,
                        });
                        return quantumEcho;
                    },
                },
            ],
        };
    }
}

export class Story_SamplingTheEchoes extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_SamplingTheEchoes); // Corrected: Use LevelNames.Story_SamplingTheEchoes directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'Sampling the Echoes',
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_SamplingTheEchoes],
            steps: [
                {
                    text: "Genie: We need to understand Static's power. Collect Phantom remains and Quantum Echoes.",
                    action: scene => {
                        this.backgroundEffectsManager.enableGhostlyClashEffect(scene);
                        const phantom = new GameObject(scene, WIDTH / 2 - 100, HEIGHT / 2 - 100, SpecialEnemyConfig.texture).setAlpha(0.8);
                        scene.add.existing(phantom);
                        scene.animateIn(phantom);
                        phantom.addComponent(
                            new VisualPulse(
                                SpecialEnemyConfig.pulseColor,
                                PlayerConfig.resonanceWave.pulseDelay,
                                PlayerConfig.resonanceWave.pulseDuration,
                                SpecialEnemyConfig.deactivationRadius,
                                PlayerConfig.resonanceWave.pulseTotalPulses,
                                PlayerConfig.resonanceWave.pulseLineWidth
                            )
                        );
                        const quantumEcho = scene.add.sprite(WIDTH / 2 + 100, HEIGHT / 2 + 100, 'quantum_echo_texture').setAlpha(0.8);
                        scene.animateIn(quantumEcho);
                        return [phantom, quantumEcho];
                    },
                },
                {
                    text: 'Guardian, you must actively seek out echoes from dangerous rift zones.',
                    action: scene => {
                        const phantomRift = drawRift(scene, WIDTH / 2, HEIGHT / 2, SpecialEnemyConfig.pulseColor);
                        const player = new GameObject(scene, WIDTH / 2, HEIGHT * 3 / 4, PlayerConfig.texture);
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
                        return [...phantomRift, player];
                    },
                },
                {
                    text: 'Carefully navigate around the malfunctioning fields of active rifts.',
                },
            ],
        };
    }
}

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
                    text: 'Genie: Amazing work, Guardian! Your collected samples are yielding results!',
                    action: scene => {
                        const player = new GameObject(scene, WIDTH / 2 - 100, HEIGHT / 2 - 100, PlayerConfig.texture);
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
                {
                    text: 'The Quantum Echoes hold the key to enhancing tower capabilities!',
                    action: scene => {
                        const tower = scene.add.sprite(WIDTH / 2, HEIGHT / 2, TowerConfigs.tower1.texture).setAlpha(0.5);
                        scene.animateIn(tower);
                        scene.tweens.add({
                            targets: tower,
                            scale: 1.2,
                            alpha: 1,
                            duration: 500,
                            yoyo: true,
                            repeat: 1,
                        });
                        return tower;
                    },
                },
                {
                    text: 'This unlocks the first tier of tower upgrades! Keep collecting those echoes!',
                    action: scene => {
                        const quantumEcho = scene.add.sprite(WIDTH / 2 + 100, HEIGHT / 2 + 100, 'quantum_echo_texture').setAlpha(0.8);
                        scene.animateIn(quantumEcho);
                        return quantumEcho;
                    },
                },
            ],
        };
    }
}

export class Story_VolatileFrontierPart1 extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_VolatileFrontierPart1); // Corrected: Use LevelNames.Story_VolatileFrontierPart1 directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'The Volatile Frontier (Part 1)',
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_VolatileFrontierPart1],
            steps: [
                {
                    text: 'Genie: My research confirms, rifts are battle scars. Their colors tell tales.',
                    action: scene => {
                        const playerRift = drawRift(scene, WIDTH / 2 - 150, HEIGHT / 2, PlayerConfig.resonanceWave.pulseColor);
                        const phantomRift = drawRift(scene, WIDTH / 2, HEIGHT / 2, SpecialEnemyConfig.pulseColor);
                        const gradientRift = drawRift(scene, WIDTH / 2 + 150, HEIGHT / 2, PlayerConfig.resonanceWave.pulseColor, SpecialEnemyConfig.pulseColor);
                        return [...playerRift, ...phantomRift, ...gradientRift];
                    },
                },
                {
                    text: 'New maps feature complex, dangerous active rift layouts. Plan your placements!',
                    action: scene => {
                        this.backgroundEffectsManager.enableGlitchAnnihilationEffect(scene);
                        const tower = scene.add.sprite(WIDTH / 2, HEIGHT * 3 / 4, TowerConfigs.tower1.texture).setAlpha(0.5);
                        scene.animateIn(tower);
                        const phantomRift = drawRift(scene, WIDTH / 2, HEIGHT / 2, SpecialEnemyConfig.pulseColor);
                        return [tower, ...phantomRift];
                    },
                },
                {
                    text: 'Rift malfunctions are a primary tactical challenge. Avoid severe stat penalties.',
                    action: scene => {
                        const tower = scene.add.sprite(WIDTH / 2, HEIGHT * 3 / 4, TowerConfigs.tower1.texture).setAlpha(0.5);
                        scene.animateIn(tower);
                        const phantomRift = drawRift(scene, WIDTH / 2, HEIGHT / 2, SpecialEnemyConfig.pulseColor);
                        scene.tweens.add({
                            targets: tower,
                            alpha: 0.1,
                            scale: 0.8,
                            duration: 300,
                            yoyo: true,
                            repeat: -1,
                        });
                        return [tower, ...phantomRift];
                    },
                },
            ],
        };
    }
}

export class Story_VolatileFrontierPart2 extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_VolatileFrontierPart2); // Corrected: Use LevelNames.Story_VolatileFrontierPart2 directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'The Volatile Frontier (Part 2)',
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_VolatileFrontierPart2],
            steps: [
                {
                    text: 'Genie: Guardian, you must master navigating these volatile zones.',
                    action: scene => {
                        const player = new GameObject(scene, WIDTH / 2, HEIGHT * 3 / 4, PlayerConfig.texture);
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
                        const phantomRift = drawRift(scene, WIDTH / 2, HEIGHT / 2, SpecialEnemyConfig.pulseColor);
                        return [player, ...phantomRift];
                    },
                },
                {
                    text: 'Collect increasing amounts of Quantum Echoes for higher-tier upgrades.',
                    action: scene => {
                        const quantumEcho1 = scene.add.sprite(WIDTH / 2 - 100, HEIGHT / 2, 'quantum_echo_texture').setAlpha(0.8);
                        const quantumEcho2 = scene.add.sprite(WIDTH / 2 + 100, HEIGHT / 2, 'quantum_echo_texture').setAlpha(0.8);
                        [quantumEcho1, quantumEcho2].forEach(t => scene.animateIn(t));
                        return [quantumEcho1, quantumEcho2];
                    },
                },
                {
                    text: 'Second tier of tower upgrades available, including early "rift-resistant" modules!',
                    action: scene => {
                        const tower = scene.add.sprite(WIDTH / 2, HEIGHT / 2, TowerConfigs.tower2.texture).setAlpha(0.5);
                        scene.animateIn(tower);
                        scene.tweens.add({
                            targets: tower,
                            scale: 1.2,
                            alpha: 1,
                            duration: 500,
                            yoyo: true,
                            repeat: 1,
                        });
                        return tower;
                    },
                },
            ],
        };
    }
}

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
                    text: 'Genie: Static senses your growing strength, Guardian. It unleashes new Glitches!',
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
                        const newGlitch = scene.add.sprite(WIDTH / 2, HEIGHT * 3 / 4, EnemyConfigs.enemy3.texture).setAlpha(0.8);
                        scene.animateIn(newGlitch);
                        return [staticEnemy, newGlitch];
                    },
                },
                {
                    text: 'Some Glitches are immune to certain towers, others try to corrupt rifts!',
                    action: scene => {
                        const immuneGlitch = scene.add.sprite(WIDTH / 2 - 100, HEIGHT / 2, EnemyConfigs.enemy1.texture).setAlpha(0.8);
                        const corruptingGlitch = scene.add.sprite(WIDTH / 2 + 100, HEIGHT / 2, EnemyConfigs.enemy2.texture).setAlpha(0.8);
                        [immuneGlitch, corruptingGlitch].forEach(t => scene.animateIn(t));
                        return [immuneGlitch, corruptingGlitch];
                    },
                },
                {
                    text: 'Even worse, some can temporarily activate dormant rifts, intensifying malfunctions!',
                    action: scene => {
                        const dormantRift = drawRift(scene, WIDTH / 2 - 100, HEIGHT / 2, phaserColor(AppColors.UI_DISABLED));
                        const glitch = scene.add.sprite(WIDTH / 2 + 100, HEIGHT / 2, EnemyConfigs.enemy3.texture).setAlpha(0.8);
                        scene.animateIn(glitch);
                        // Simulate activation
                        scene.tweens.add({
                            targets: dormantRift[0], // Target the core of the rift
                            alpha: 0.8,
                            tint: SpecialEnemyConfig.pulseColor, // Becomes Phantom-colored active
                            duration: 500,
                            yoyo: true,
                            repeat: 0,
                            onComplete: () => {
                                // Replace with an active rift visual
                                drawRift(scene, WIDTH / 2 - 100, HEIGHT / 2, SpecialEnemyConfig.pulseColor, null, 0.8);
                            }
                        });
                        return [...dormantRift, glitch];
                    },
                },
            ],
        };
    }
}

export class Story_AdvancedCountermeasures extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_AdvancedCountermeasures); // Corrected: Use LevelNames.Story_AdvancedCountermeasures directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'Advanced Countermeasures',
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_AdvancedCountermeasures],
            steps: [
                {
                    text: 'Genie: I\'m working tirelessly on countermeasures, Guardian. But I need more Echoes!',
                    action: scene => {
                        const quantumEcho = scene.add.sprite(WIDTH / 2, HEIGHT / 2, 'quantum_echo_texture').setAlpha(0.8);
                        scene.animateIn(quantumEcho);
                        scene.tweens.add({
                            targets: quantumEcho,
                            scale: 1.2,
                            duration: 700,
                            yoyo: true,
                            repeat: -1,
                        });
                        return quantumEcho;
                    },
                },
                {
                    text: 'We need specialized tower upgrades, including stronger rift-resistance modules.',
                    action: scene => {
                        const tower = scene.add.sprite(WIDTH / 2 - 100, HEIGHT / 2, TowerConfigs.tower3.texture).setAlpha(0.5);
                        scene.animateIn(tower);
                        const upgradeIcon = scene.add.sprite(WIDTH / 2 + 100, HEIGHT / 2, 'upgrade_icon_texture').setAlpha(0.8);
                        scene.animateIn(upgradeIcon);
                        return [tower, upgradeIcon];
                    },
                },
                {
                    text: 'Third tier of tower upgrades available, including specialized counter-Glitches!',
                    action: scene => {
                        const tower = scene.add.sprite(WIDTH / 2, HEIGHT / 2, TowerConfigs.tower3.texture).setAlpha(0.5);
                        scene.animateIn(tower);
                        scene.tweens.add({
                            targets: tower,
                            scale: 1.2,
                            alpha: 1,
                            duration: 500,
                            yoyo: true,
                            repeat: 1,
                        });
                        return tower;
                    },
                },
            ],
        };
    }
}

export class Story_EchoesOfAncientLore extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_EchoesOfAncientLore); // Corrected: Use LevelNames.Story_EchoesOfAncientLore directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'Echoes of Ancient Lore',
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_EchoesOfAncientLore],
            steps: [
                {
                    text: 'Genie: Through extensive analysis of Echoes from ancient Guardian-colored rifts...',
                    action: scene => {
                        const playerRift = drawRift(scene, WIDTH / 2, HEIGHT / 2, PlayerConfig.resonanceWave.pulseColor);
                        const quantumEcho = scene.add.sprite(WIDTH / 2, HEIGHT / 2, 'quantum_echo_texture').setAlpha(0.8);
                        scene.animateIn(quantumEcho);
                        return [...playerRift, quantumEcho];
                    },
                },
                {
                    text: 'I\'ve uncovered fragments of forgotten lore. Phantoms are not just Glitches!',
                    action: scene => {
                        const phantom = new GameObject(scene, WIDTH / 2, HEIGHT / 2, SpecialEnemyConfig.texture).setAlpha(0.8);
                        scene.add.existing(phantom);
                        scene.animateIn(phantom);
                        return phantom;
                    },
                },
                {
                    text: 'They are direct manifestations of Static\'s core essence – "mini-Statics"!',
                    action: scene => {
                        const staticEnemy = scene.add.sprite(WIDTH / 2 - 100, HEIGHT / 2, 'static').setAlpha(0.3);
                        const phantom = new GameObject(scene, WIDTH / 2 + 100, HEIGHT / 2, SpecialEnemyConfig.texture).setAlpha(0.8);
                        scene.add.existing(phantom);
                        scene.animateIn(phantom);
                        return [staticEnemy, phantom];
                    },
                },
                {
                    text: 'This explains their immunity, disruptive power, and why they amplify rift chaos.',
                    action: scene => {
                        const phantomRift = drawRift(scene, WIDTH / 2, HEIGHT / 2, SpecialEnemyConfig.pulseColor);
                        const phantom = new GameObject(scene, WIDTH / 2, HEIGHT / 2, SpecialEnemyConfig.texture).setAlpha(0.8);
                        scene.add.existing(phantom);
                        scene.animateIn(phantom);
                        return [...phantomRift, phantom];
                    },
                },
            ],
        };
    }
}

export class Story_DesigningTheBane extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_DesigningTheBane); // Corrected: Use LevelNames.Story_DesigningTheBane directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'Designing the Bane',
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_DesigningTheBane],
            steps: [
                {
                    text: 'Genie: Armed with this knowledge, Guardian, I\'ve designed the ultimate weapon!',
                    action: scene => {
                        const genie = scene.add.sprite(WIDTH / 2, HEIGHT * 3 / 4, 'genie_texture').setAlpha(0.8);
                        scene.animateIn(genie);
                        return genie;
                    },
                },
                {
                    text: 'The Phantom Killer tower! It disrupts their connection to Static, rendering them vulnerable.',
                    action: scene => {
                        const phantomKiller = scene.add.sprite(WIDTH / 2, HEIGHT / 2, 'phantom_killer_tower_texture').setAlpha(0.8);
                        scene.animateIn(phantomKiller);
                        const phantom = new GameObject(scene, WIDTH / 2 + 150, HEIGHT / 2, SpecialEnemyConfig.texture).setAlpha(0.8);
                        scene.add.existing(phantom);
                        scene.animateIn(phantom);
                        scene.tweens.add({
                            targets: phantom,
                            alpha: 0.2,
                            duration: 500,
                            yoyo: true,
                            repeat: -1,
                        });
                        return [phantomKiller, phantom];
                    },
                },
                {
                    text: 'But building the prototype requires a massive amount of Quantum Echoes!',
                    action: scene => {
                        const quantumEcho1 = scene.add.sprite(WIDTH / 2 - 100, HEIGHT / 2, 'quantum_echo_texture').setAlpha(0.8);
                        const quantumEcho2 = scene.add.sprite(WIDTH / 2, HEIGHT / 2, 'quantum_echo_texture').setAlpha(0.8);
                        const quantumEcho3 = scene.add.sprite(WIDTH / 2 + 100, HEIGHT / 2, 'quantum_echo_texture').setAlpha(0.8);
                        [quantumEcho1, quantumEcho2, quantumEcho3].forEach(t => scene.animateIn(t));
                        return [quantumEcho1, quantumEcho2, quantumEcho3];
                    },
                },
                {
                    text: 'Obtainable only from the most dangerous, Phantom-dominated rifts. A perilous mission awaits!',
                    action: scene => {
                        const phantomRift = drawRift(scene, WIDTH / 2, HEIGHT / 2, SpecialEnemyConfig.pulseColor, null, 0.8);
                        const player = new GameObject(scene, WIDTH / 2, HEIGHT * 3 / 4, PlayerConfig.texture);
                        scene.add.existing(player);
                        scene.animateIn(player);
                        return [...phantomRift, player];
                    },
                },
            ],
        };
    }
}

export class Story_TheFinalAssault extends BaseStoryScene {
    constructor() {
        super(LevelNames.Story_TheFinalAssault); // Corrected: Use LevelNames.Story_TheFinalAssault directly
    }

    preload() {
        this.backgroundEffectsManager.enableDataStreamEffect(this);
        super.preload();
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: LevelNames } {
        return {
            title: 'The Final Assault',
            nextScene: STORY_TO_GAMEPLAY_MAP[LevelNames.Story_TheFinalAssault],
            steps: [
                {
                    text: 'Genie: Static is enraged! It launches an all-out, desperate assault!',
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
                        const enemy1 = scene.add.sprite(WIDTH / 2 - 150, HEIGHT * 3 / 4, EnemyConfigs.enemy1.texture).setAlpha(0.4);
                        const enemy2 = scene.add.sprite(WIDTH / 2, HEIGHT * 3 / 4, EnemyConfigs.enemy2.texture).setAlpha(0.4);
                        const enemy3 = scene.add.sprite(WIDTH / 2 + 150, HEIGHT * 3 / 4, EnemyConfigs.enemy3.texture).setAlpha(0.4);
                        [enemy1, enemy2, enemy3].forEach(t => scene.animateIn(t));
                        return [staticEnemy, enemy1, enemy2, enemy3];
                    },
                },
                {
                    text: 'A colossal wave of every Glitch type, including unprecedented numbers of Phantoms!',
                    action: scene => {
                        const phantom1 = new GameObject(scene, WIDTH / 2 - 100, HEIGHT / 2, SpecialEnemyConfig.texture).setAlpha(0.8);
                        const phantom2 = new GameObject(scene, WIDTH / 2 + 100, HEIGHT / 2, SpecialEnemyConfig.texture).setAlpha(0.8);
                        [phantom1, phantom2].forEach(t => scene.animateIn(t));
                        return [phantom1, phantom2];
                    },
                },
                {
                    text: 'Strategically deploy Phantom Killer towers to neutralize the Phantom threat.',
                    action: scene => {
                        const phantomKiller1 = scene.add.sprite(WIDTH / 2 - 150, HEIGHT * 3 / 4, 'phantom_killer_tower_texture').setAlpha(0.8);
                        const phantomKiller2 = scene.add.sprite(WIDTH / 2 + 150, HEIGHT * 3 / 4, 'phantom_killer_tower_texture').setAlpha(0.8);
                        [phantomKiller1, phantomKiller2].forEach(t => scene.animateIn(t));
                        return [phantomKiller1, phantomKiller2];
                    },
                },
                {
                    text: 'Carefully manage tower placement around the still-malfunctioning rifts.',
                    action: scene => {
                        const phantomRift1 = drawRift(scene, WIDTH / 2 - 100, HEIGHT / 2, SpecialEnemyConfig.pulseColor);
                        const phantomRift2 = drawRift(scene, WIDTH / 2 + 100, HEIGHT / 2, SpecialEnemyConfig.pulseColor);
                        const tower = scene.add.sprite(WIDTH / 2, HEIGHT * 3 / 4, TowerConfigs.tower1.texture).setAlpha(0.5);
                        scene.animateIn(tower);
                        scene.tweens.add({
                            targets: tower,
                            alpha: 0.1,
                            scale: 0.8,
                            duration: 300,
                            yoyo: true,
                            repeat: -1,
                        });
                        return [...phantomRift1, ...phantomRift2, tower];
                    },
                },
            ],
        };
    }
}

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
