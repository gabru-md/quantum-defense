// src/main.ts
import * as Phaser from 'phaser';
import {AppColors} from './game/scripts/Colors.ts';

// New Menu and Playback Scenes
import {MainMenuScene} from './game/scenes/MainMenuScene.ts';
import {FullStoryPlaybackScene} from './game/scenes/FullStoryPlaybackScene.ts';

import {CreditsScene} from './game/scenes/CreditsScene.ts';
import {WinScene} from './game/scenes/WinScene.ts';
import {EndScene} from "./game/scenes/EndScene.ts";
import {ChapterSelectScene} from './game/scenes/ChapterSelectScene.ts'; // Import the new scene

// All Story Scenes (imported from the barrel file)
import {
    Story_TheFirstStand,
    Story_StaticNewGlitches,
    Story_ThePhantomArrival,
    Story_VolatileInterference,
    Story_InitialBreakthrough,
    Story_EchoesOfAncientLore,
    Story_TheFinalAssault,
    Story_TheResonanceWave,
    Story_DesigningTheBane,
    Story_TheGlitchAnnihilation,
    Story_TheDormantScars
} from './game/scenes/Stories.ts';

// All Gameplay Levels (with their new names)
import {InteractiveTutorial} from './game/scenes/levels/InteractiveTutorial.ts'; // Gameplay_Tutorial
import {Gameplay_TheGlitchAnnihilation} from './game/scenes/levels/Level1.ts';
import {Gameplay_HelloGenie} from './game/scenes/levels/Level2.ts';
import {Gameplay_TheDormantScars} from './game/scenes/levels/Level3.ts';
import {Gameplay_ExpandingFront_4} from './game/scenes/levels/Level4.ts';
import {Gameplay_TheFirstEcho} from './game/scenes/levels/Level5.ts';
import {Gameplay_TheEchoHunt_1} from './game/scenes/levels/Level6.ts';
import {Gameplay_TheEchoHunt_2} from './game/scenes/levels/Level7.ts';
import {Gameplay_BruteForce} from './game/scenes/levels/Level8.ts';
import {Gameplay_AFutileDefense} from './game/scenes/levels/Level9.ts';
import {Gameplay_TheInvestigation_1} from './game/scenes/levels/Level10.ts';
import {Gameplay_TheInvestigation_2} from './game/scenes/levels/Level11.ts';
import {Gameplay_ThePrototype} from './game/scenes/levels/Level12.ts';
import {Gameplay_TheAllOutWar_1} from './game/scenes/levels/Level13.ts';
import {Gameplay_TheAllOutWar_2} from './game/scenes/levels/Level14.ts';
import {Gameplay_TheCore} from './game/scenes/levels/Level15.ts';


const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    scale: {
        mode: Phaser.Scale.FIT,
    },
    scene: [
        MainMenuScene, // Set MainMenuScene as the initial scene
        ChapterSelectScene, // Added ChapterSelectScene
        FullStoryPlaybackScene,
        CreditsScene,
        WinScene,
        EndScene,

        // All Story Scenes (11 total)
        Story_TheFirstStand,
        Story_TheGlitchAnnihilation,
        Story_TheDormantScars,
        Story_VolatileInterference,
        Story_InitialBreakthrough,
        Story_StaticNewGlitches,
        Story_ThePhantomArrival,
        Story_EchoesOfAncientLore,
        Story_DesigningTheBane,
        Story_TheFinalAssault,
        Story_TheResonanceWave,

        // All Gameplay Levels (15 total)
        InteractiveTutorial, // Gameplay_Tutorial
        Gameplay_TheGlitchAnnihilation,
        Gameplay_HelloGenie,
        Gameplay_TheDormantScars,
        Gameplay_ExpandingFront_4,
        Gameplay_TheFirstEcho,
        Gameplay_TheEchoHunt_1,
        Gameplay_TheEchoHunt_2,
        Gameplay_BruteForce,
        Gameplay_AFutileDefense,
        Gameplay_TheInvestigation_1,
        Gameplay_TheInvestigation_2,
        Gameplay_ThePrototype,
        Gameplay_TheAllOutWar_1,
        Gameplay_TheAllOutWar_2,
        Gameplay_TheCore,
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