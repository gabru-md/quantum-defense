import {LevelNames, STORY_TO_GAMEPLAY_MAP} from '../lib/LevelNames.ts';
import {GameObject} from '../../core/GameObject.ts';
import {HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {BaseStoryScene, StoryStep} from "../lib/BaseStoryScene.ts";
import {PlayerConfig} from "../../config/PlayerConfig.ts";
import {SpecialEnemyConfig} from "../../config/EnemyConfigs.ts";
import {drawRift} from "../lib/StoryUtils.ts";

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
