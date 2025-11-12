import * as Phaser from 'phaser';
import {MenuScene} from './game/scenes/MenuScene';
import {CreditsScene} from './game/scenes/CreditsScene';
import {TutorialLevel} from './game/scenes/TutorialLevel';
import {Level1} from './game/scenes/Level1';
import {Level2} from './game/scenes/Level2';
import {Level3} from './game/scenes/Level3';
import {Level4} from './game/scenes/Level4';
import {Level5} from './game/scenes/Level5';
import {AppColors} from "./game/scripts/Colors.ts";
import {WinScene} from "./game/scenes/WinScene.ts";
import {LoreScene} from "./game/scenes/LoreScene.ts";

const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    scene: [MenuScene, LoreScene, CreditsScene, TutorialLevel, Level1, Level2, Level3, Level4, Level5, WinScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0,
                x: 0
            },
            debug: false
        }
    },
    backgroundColor: AppColors.GAME_BACKGROUND
};

// Start the game
new Phaser.Game(gameConfig);
