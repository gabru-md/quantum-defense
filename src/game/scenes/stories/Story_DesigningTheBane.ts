import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {SpecialEnemyConfig} from "../../config/EnemyConfigs.ts";
import {drawRift} from "../lib/StoryUtils.ts";
import {createPhantom, createPlayer} from "../../scripts/EntityMaker.ts";

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
                        this.backgroundEffectsManager.configureAndStartGlitchAnnihilationEffect(this, 850);
                        const [player, genie] = createPlayer(scene, WIDTH / 2, HEIGHT * 3 / 4);
                        scene.animateIn(player);
                        return [player, genie];
                    },
                },
                {
                    text: 'The Phantom Killer tower!\nIt disrupts their connection to Static, rendering them vulnerable.',
                    action: scene => {
                        const phantomKiller = scene.add.sprite(WIDTH / 2, HEIGHT / 2 + 150, 'specialTower').setAlpha(0.8);
                        scene.animateIn(phantomKiller);
                        const phantom = createPhantom(scene, WIDTH / 2, HEIGHT / 2 - 150);
                        scene.animateIn(phantom);
                        scene.tweens.add({
                            targets: [phantom, phantomKiller],
                            scale: 1.2,
                            alpha: 1,
                            duration: 1000,
                            yoyo: true,
                            repeat: -1,
                        });

                        return [phantomKiller, phantom];
                    },
                },
                {
                    text: 'But building the prototype requires a massive amount of Quantum Echoes and Energy!',
                    action: scene => {
                        const quantumEcho1 = scene.add.sprite(WIDTH / 2 - 100, HEIGHT / 2 - 50, 'quantum_echo_texture').setAlpha(0.8);
                        const quantumEcho2 = scene.add.sprite(WIDTH / 2, HEIGHT / 2 - 50, 'quantum_echo_texture').setAlpha(0.8);
                        const quantumEcho3 = scene.add.sprite(WIDTH / 2 + 100, HEIGHT / 2 - 50, 'quantum_echo_texture').setAlpha(0.8);
                        [quantumEcho1, quantumEcho2, quantumEcho3].forEach(t => scene.animateIn(t));
                        return [quantumEcho1, quantumEcho2, quantumEcho3];
                    },
                },
                {
                    text: 'Obtainable only from the most dangerous, Phantom-dominated rifts.\nA perilous mission awaits!',
                    action: scene => {
                        const phantomRift = drawRift(scene, WIDTH - 275, HEIGHT / 4, SpecialEnemyConfig.pulseColor, null, 0.8);
                        return [...phantomRift];
                    },
                },
            ],
        };
    }
}
