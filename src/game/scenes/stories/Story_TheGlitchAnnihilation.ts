import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {GameObject} from '../../core/GameObject.ts';
import {VisualPulse} from '../../components/VisualPulse.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {PlayerConfig} from "../../config/PlayerConfig.ts";
import {EnemyConfigs} from "../../config/EnemyConfigs.ts";
import {drawRift} from "../lib/StoryUtils.ts";

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
