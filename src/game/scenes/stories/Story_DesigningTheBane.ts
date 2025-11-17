import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {GameObject} from '../../core/GameObject.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {SpecialEnemyConfig} from "../../config/EnemyConfigs.ts";
import {drawRift} from "../lib/StoryUtils.ts";
import {PlayerConfig} from "../../config/PlayerConfig.ts";

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
