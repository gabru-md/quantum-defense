import * as Phaser from 'phaser';
import {MenuScene} from './game/scenes/MenuScene';
import {CreditsScene} from './game/scenes/CreditsScene';
import {Tutorial} from './game/scenes/levels/Tutorial.ts';
import {Level1} from './game/scenes/levels/Level1.ts';
import {Level2} from './game/scenes/levels/Level2.ts';
import {Level3} from './game/scenes/levels/Level3.ts';
import {Level4} from './game/scenes/levels/Level4.ts';
import {Level6} from './game/scenes/levels/Level6.ts';
import {Level7} from './game/scenes/levels/Level7.ts';
import {Level8} from './game/scenes/levels/Level8.ts';
import {Level9} from './game/scenes/levels/Level9.ts';
import {Level10} from './game/scenes/levels/Level10.ts';
import {Level11} from './game/scenes/levels/Level11.ts';
import {Level12} from './game/scenes/levels/Level12.ts';
import {Level13} from './game/scenes/levels/Level13.ts';
import {Level14} from './game/scenes/levels/Level14.ts';
import {Level15} from './game/scenes/levels/Level15.ts';
import {AppColors} from './game/scripts/Colors.ts';
import {WinScene} from './game/scenes/WinScene.ts';
import {Introduction} from './game/scenes/Introduction.ts';
import {StoryLevel1, StoryLevel2, StoryLevel3, StoryLevel4} from './game/scenes/Stories.ts';
import {Level5} from "./game/scenes/levels/Level5.ts";

const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    scale: {
        mode: Phaser.Scale.FIT,

    },
    scene: [
        MenuScene,
        Introduction,
        CreditsScene,
        Tutorial,
        Level1,
        Level2,
        Level3,
        Level4,
        Level5,
        Level6,
        Level7,
        Level8,
        Level9,
        Level10,
        Level11,
        Level12,
        Level13,
        Level14,
        Level15,
        WinScene,
        StoryLevel1,
        StoryLevel2,
        StoryLevel3,
        StoryLevel4
    ],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0,
                x: 0,
            },
            debug: false,
        },
    },
    backgroundColor: AppColors.GAME_BACKGROUND,
};

// Start the game
new Phaser.Game(gameConfig);
