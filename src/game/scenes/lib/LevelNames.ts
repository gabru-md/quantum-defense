export enum LevelNames {
    // Main Menu
    MainMenu = 'MainMenu',

    // End Scene
    EndScene = 'EndScene',

    // Tutorial
    Tutorial = 'Tutorial', // Story scene for the tutorial
    Gameplay_Tutorial = 'Gameplay_Tutorial', // Actual playable tutorial level

    // Story Scenes (11 chapters)
    Story_TheGlitchAnnihilation = 'Story_The Glitch Annihilation', // Chapter 1
    Story_TheFirstStand = 'Story_The First Stand', // Chapter 2 (The First Stand)
    Story_TheDormantScars = 'Story_The Dormant Scars', // Chapter 3
    Story_VolatileInterference = 'Story_Volatile Interference', // Chapter 4
    Story_InitialBreakthrough = 'Story_Initial Breakthrough', // Chapter 5
    Story_StaticNewGlitches = 'Story_Static\'s New Glitches', // Chapter 6
    Story_ThePhantomArrival = 'Story_The Phantom\'s Arrival', // Chapter 7
    Story_EchoesOfAncientLore = 'Story_Echoes of Ancient Lore', // Chapter 8
    Story_DesigningTheBane = 'Story_Designing the Bane', // Chapter 9
    Story_TheFinalAssault = 'Story_The Final Assault', // Chapter 10
    Story_TheResonanceWave = 'Story_The Resonance Wave', // Chapter 11

    // Actual Gameplay Levels (15 levels)
    Gameplay_TheGlitchAnnihilation = 'Gameplay_The Glitch Annihilation', // Level 1 (Original Level1.ts)
    Gameplay_HelloGenie = 'Gameplay_Hello, Genie!', // Level 2 (Original Level2.ts)
    Gameplay_TheDormantScars = 'Gameplay_The Dormant Scars', // Level 3 (Original Level3.ts)
    Gameplay_ExpandingFront_4 = 'Gameplay_Expanding Front 4', // Level 4 (Original Level4.ts)
    Gameplay_TheFirstEcho = 'Gameplay_The First Echo', // Level 5 (Original Level5.ts)
    Gameplay_TheEchoHunt_1 = 'Gameplay_The Echo Hunt 1', // Level 6 (Original Level6.ts)
    Gameplay_TheEchoHunt_2 = 'Gameplay_The Echo Hunt 2', // Level 7 (Original Level7.ts)
    Gameplay_BruteForce = 'Gameplay_Brute Force', // Level 8 (Original Level8.ts)
    Gameplay_AFutileDefense = 'Gameplay_A Futile Defense', // Level 9 (Original Level9.ts)
    Gameplay_TheInvestigation_1 = 'Gameplay_The Investigation 1', // Level 10 (Original Level10.ts)
    Gameplay_TheInvestigation_2 = 'Gameplay_The Investigation 2', // Level 11 (Original Level11.ts)
    Gameplay_ThePrototype = 'Gameplay_The Prototype', // Level 12 (Original Level12.ts)
    Gameplay_TheAllOutWar_1 = 'Gameplay_The All Out War 1', // Level 13 (Original Level13.ts)
    Gameplay_TheAllOutWar_2 = 'Gameplay_The All Out War 2', // Level 14 (Original Level14.ts)
    Gameplay_TheCore = 'Gameplay_The Core', // Level 15 (Original Level15.ts)

    // Special Playback Scene
    FullStoryPlayback = 'FullStoryPlayback'
}

export function getStoryName(levelName: LevelNames): string {
    // Remove 'Story_' prefix for display if present
    if (levelName.startsWith('Story_')) {
        return levelName.substring('Story_'.length);
    }
    return levelName;
}

export function getLevelName(levelNameStr: string): LevelNames {
    for (const levelName of Object.values(LevelNames)) {
        if (levelName === levelNameStr) {
            return levelName;
        }
    }
    throw new Error(`Invalid level name string: ${levelNameStr}`);
}

export function getLevelNameKey(levelNameStr: string): string {
    const foundKey = Object.keys(LevelNames).find(key => LevelNames[key as keyof typeof LevelNames] === levelNameStr);
    if (foundKey) {
        return foundKey;
    }
    throw new Error(`Invalid level name string: ${levelNameStr}`);
}

// Array to define the order of story levels for sequential playback and menu generation
export const STORY_LEVEL_ORDER: LevelNames[] = [
    LevelNames.Story_TheGlitchAnnihilation, // Chapter 1 - The Tutorial
    LevelNames.Story_TheFirstStand, // Chapter 2
    LevelNames.Story_TheDormantScars, // Chapter 3
    LevelNames.Story_VolatileInterference, // Chapter 4
    LevelNames.Story_InitialBreakthrough, // Chapter 5
    LevelNames.Story_StaticNewGlitches, // Chapter 6
    LevelNames.Story_ThePhantomArrival, // Chapter 7
    LevelNames.Story_EchoesOfAncientLore, // Chapter 8
    LevelNames.Story_DesigningTheBane, // Chapter 9
    LevelNames.Story_TheFinalAssault, // Chapter 10
    LevelNames.Story_TheResonanceWave, // Chapter 11
];

// Map story scenes to their corresponding gameplay levels
// @ts-ignore
export const STORY_TO_GAMEPLAY_MAP: Record<LevelNames, LevelNames> = {
    [LevelNames.Story_TheGlitchAnnihilation]: LevelNames.Gameplay_Tutorial, // Prologue leads to Gameplay_Tutorial
    [LevelNames.Story_TheFirstStand]: LevelNames.Gameplay_Tutorial, // Tutorial story leads to Gameplay_Tutorial
    [LevelNames.Story_TheDormantScars]: LevelNames.Gameplay_TheGlitchAnnihilation, // Chapter 3 leads to Level 1
    [LevelNames.Story_VolatileInterference]: LevelNames.Gameplay_TheFirstEcho, // Chapter 4 leads to Level 5
    [LevelNames.Story_InitialBreakthrough]: LevelNames.Gameplay_TheEchoHunt_1, // Chapter 5 leads to Level 6
    [LevelNames.Story_StaticNewGlitches]: LevelNames.Gameplay_BruteForce, // Chapter 6 leads to Level 8
    [LevelNames.Story_ThePhantomArrival]: LevelNames.Gameplay_AFutileDefense, // Chapter 7 leads to Level 9
    [LevelNames.Story_EchoesOfAncientLore]: LevelNames.Gameplay_TheInvestigation_1, // Chapter 8 leads to Level 10
    [LevelNames.Story_DesigningTheBane]: LevelNames.Gameplay_ThePrototype, // Chapter 9 leads to Level 12
    [LevelNames.Story_TheFinalAssault]: LevelNames.Gameplay_TheAllOutWar_1, // Chapter 10 leads to Level 13
    [LevelNames.Story_TheResonanceWave]: LevelNames.Gameplay_TheCore, // Chapter 11 leads to Level 15

    // Add other non-story levels to avoid TypeScript errors, mapping them to themselves or a default
    [LevelNames.MainMenu]: LevelNames.MainMenu,
    [LevelNames.EndScene]: LevelNames.EndScene,
    [LevelNames.Gameplay_Tutorial]: LevelNames.Gameplay_Tutorial,
    [LevelNames.FullStoryPlayback]: LevelNames.FullStoryPlayback,

    // Placeholder mappings for actual gameplay levels if they are ever looked up from this map
    [LevelNames.Gameplay_TheGlitchAnnihilation]: LevelNames.Gameplay_TheGlitchAnnihilation,
    [LevelNames.Gameplay_HelloGenie]: LevelNames.Gameplay_HelloGenie,
    [LevelNames.Gameplay_TheDormantScars]: LevelNames.Gameplay_TheDormantScars,
    [LevelNames.Gameplay_ExpandingFront_4]: LevelNames.Gameplay_ExpandingFront_4,
    [LevelNames.Gameplay_TheFirstEcho]: LevelNames.Gameplay_TheFirstEcho,
    [LevelNames.Gameplay_TheEchoHunt_1]: LevelNames.Gameplay_TheEchoHunt_1,
    [LevelNames.Gameplay_TheEchoHunt_2]: LevelNames.Gameplay_TheEchoHunt_2,
    [LevelNames.Gameplay_BruteForce]: LevelNames.Gameplay_BruteForce,
    [LevelNames.Gameplay_AFutileDefense]: LevelNames.Gameplay_AFutileDefense,
    [LevelNames.Gameplay_TheInvestigation_1]: LevelNames.Gameplay_TheInvestigation_1,
    [LevelNames.Gameplay_TheInvestigation_2]: LevelNames.Gameplay_TheInvestigation_2,
    [LevelNames.Gameplay_ThePrototype]: LevelNames.Gameplay_ThePrototype,
    [LevelNames.Gameplay_TheAllOutWar_1]: LevelNames.Gameplay_TheAllOutWar_1,
    [LevelNames.Gameplay_TheAllOutWar_2]: LevelNames.Gameplay_TheAllOutWar_2,
    [LevelNames.Gameplay_TheCore]: LevelNames.Gameplay_TheCore,
};