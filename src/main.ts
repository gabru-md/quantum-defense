import * as Phaser from 'phaser';
import { MenuScene } from './game/scenes/MenuScene';
import { CreditsScene } from './game/scenes/CreditsScene';
import { Tutorial } from './game/scenes/Tutorial.ts';
import { Level1 } from './game/scenes/levels/Level1.ts';
import { Level2 } from './game/scenes/levels/Level2.ts';
import { Level3 } from './game/scenes/levels/Level3.ts';
import { Level4 } from './game/scenes/levels/Level4.ts';
import { Level5 } from './game/scenes/levels/Level5.ts';
import { AppColors } from './game/scripts/Colors.ts';
import { WinScene } from './game/scenes/WinScene.ts';
import { Introduction } from './game/scenes/Introduction.ts';
import { StoryLevel1, StoryLevel2, StoryLevel3, StoryLevel4, StoryLevel5 } from './game/scenes/Stories.ts';

const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
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
        WinScene,
        StoryLevel1,
        StoryLevel2,
        StoryLevel3,
        StoryLevel4,
        StoryLevel5,
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
