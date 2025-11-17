import * as Phaser from 'phaser';
import {AppColors} from './game/scripts/Colors.ts';

// New Menu and Playback Scenes
import {MainMenuScene} from './game/scenes/MainMenuScene.ts';
import {FullStoryPlaybackScene} from './game/scenes/FullStoryPlaybackScene.ts';

// All Story Scenes (including Tutorial)
import {
    Story_Tutorial,
    Story_TheGlitchAnnihilation,
    Story_HelloGenie,
    Story_TheDormantScars,
    Story_ThePhantomArrival,
    Story_VolatileInterference,
    Story_SamplingTheEchoes,
    Story_InitialBreakthrough,
    Story_VolatileFrontierPart1,
    Story_VolatileFrontierPart2,
    Story_StaticNewGlitches,
    Story_AdvancedCountermeasures,
    Story_EchoesOfAncientLore,
    Story_DesigningTheBane,
    Story_TheFinalAssault,
    Story_TheResonanceWave
} from './game/scenes/Stories.ts';

// Existing Gameplay Levels (will be renamed in their respective files)
import {Gameplay_Tutorial} from './game/scenes/levels/Tutorial.ts'; // Renamed import
import {Gameplay_TheGlitchAnnihilation} from './game/scenes/levels/Level1.ts'; // Renamed import
import {Gameplay_HelloGenie} from './game/scenes/levels/Level2.ts'; // Renamed import
import {Gameplay_TheDormantScars} from './game/scenes/levels/Level3.ts'; // Renamed import
import {Gameplay_ThePhantomArrival} from './game/scenes/levels/Level4.ts'; // Renamed import
import {Gameplay_VolatileInterference} from './game/scenes/levels/Level5.ts'; // Renamed import
import {Gameplay_SamplingTheEchoes} from './game/scenes/levels/Level6.ts'; // Renamed import
import {Gameplay_InitialBreakthrough} from './game/scenes/levels/Level7.ts'; // Renamed import
import {Gameplay_VolatileFrontierPart1} from './game/scenes/levels/Level8.ts'; // Renamed import
import {Gameplay_VolatileFrontierPart2} from './game/scenes/levels/Level9.ts'; // Renamed import
import {Gameplay_StaticNewGlitches} from './game/scenes/levels/Level10.ts'; // Renamed import
import {Gameplay_AdvancedCountermeasures} from './game/scenes/levels/Level11.ts'; // Renamed import
import {Gameplay_EchoesOfAncientLore} from './game/scenes/levels/Level12.ts'; // Renamed import
import {Gameplay_DesigningTheBane} from './game/scenes/levels/Level13.ts'; // Renamed import
import {Gameplay_TheFinalAssault} from './game/scenes/levels/Level14.ts'; // Renamed import
import {Gameplay_TheResonanceWave} from './game/scenes/levels/Level15.ts'; // Renamed import


// Other Scenes
import {CreditsScene} from './game/scenes/CreditsScene.ts';
import {WinScene} from './game/scenes/WinScene.ts';


const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    scale: {
        mode: Phaser.Scale.FIT,
    },
    scene: [
        MainMenuScene, // Set MainMenuScene as the initial scene
        FullStoryPlaybackScene,
        CreditsScene,
        WinScene,

        // All Story Scenes
        Story_Tutorial,
        Story_TheGlitchAnnihilation,
        Story_HelloGenie,
        Story_TheDormantScars,
        Story_ThePhantomArrival,
        Story_VolatileInterference,
        Story_SamplingTheEchoes,
        Story_InitialBreakthrough,
        Story_VolatileFrontierPart1,
        Story_VolatileFrontierPart2,
        Story_StaticNewGlitches,
        Story_AdvancedCountermeasures,
        Story_EchoesOfAncientLore,
        Story_DesigningTheBane,
        Story_TheFinalAssault,
        Story_TheResonanceWave,

        // All Gameplay Levels
        Gameplay_Tutorial,
        Gameplay_TheGlitchAnnihilation,
        Gameplay_HelloGenie,
        Gameplay_TheDormantScars,
        Gameplay_ThePhantomArrival,
        Gameplay_VolatileInterference,
        Gameplay_SamplingTheEchoes,
        Gameplay_InitialBreakthrough,
        Gameplay_VolatileFrontierPart1,
        Gameplay_VolatileFrontierPart2,
        Gameplay_StaticNewGlitches,
        Gameplay_AdvancedCountermeasures,
        Gameplay_EchoesOfAncientLore,
        Gameplay_DesigningTheBane,
        Gameplay_TheFinalAssault,
        Gameplay_TheResonanceWave,
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
