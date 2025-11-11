import * as Phaser from 'phaser';
import {Level1} from './game/scenes/Level1';
import {Level2} from './game/scenes/Level2';
import {Level3} from './game/scenes/Level3';
import {Level4} from './game/scenes/Level4';
import {Level5} from './game/scenes/Level5';
import {AppColors} from "./game/scripts/Colors.ts"; // Import AppColors

const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    // scene: [Level1, Level2, Level3, Level4, Level5],
    scene: [Level5],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    },
    backgroundColor: AppColors.GAME_BACKGROUND // Use color constant
};

// Start the game
new Phaser.Game(gameConfig);
