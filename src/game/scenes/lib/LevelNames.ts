export enum LevelNames {
    // Main Menu
    MainMenu = 'MainMenu',

    // Tutorial
    Tutorial = 'Tutorial', // Story scene for the tutorial
    Gameplay_Tutorial = 'Gameplay_Tutorial', // Actual playable tutorial level

    // Story Scenes (15 levels)
    Story_TheGlitchAnnihilation = 'Story_The Glitch Annihilation',
    Story_HelloGenie = 'Story_Hello, Genie!',
    Story_TheDormantScars = 'Story_The Dormant Scars',
    Story_ThePhantomArrival = 'Story_The Phantom\'s Arrival',
    Story_VolatileInterference = 'Story_Volatile Interference',
    Story_SamplingTheEchoes = 'Story_Sampling the Echoes',
    Story_InitialBreakthrough = 'Story_Initial Breakthrough',
    Story_VolatileFrontierPart1 = 'Story_Volatile Frontier (Part 1)',
    Story_VolatileFrontierPart2 = 'Story_Volatile Frontier (Part 2)',
    Story_StaticNewGlitches = 'Story_Static\'s New Glitches',
    Story_AdvancedCountermeasures = 'Story_Advanced Countermeasures',
    Story_EchoesOfAncientLore = 'Story_Echoes of Ancient Lore',
    Story_DesigningTheBane = 'Story_Designing the Bane',
    Story_TheFinalAssault = 'Story_The Final Assault',
    Story_TheResonanceWave = 'Story_The Resonance Wave',

    // Actual Gameplay Levels (corresponding to the 15 story levels)
    Gameplay_TheGlitchAnnihilation = 'Gameplay_The Glitch Annihilation',
    Gameplay_HelloGenie = 'Gameplay_Hello, Genie!',
    Gameplay_TheDormantScars = 'Gameplay_The Dormant Scars',
    Gameplay_ThePhantomArrival = 'Gameplay_The Phantom\'s Arrival',
    Gameplay_VolatileInterference = 'Gameplay_Volatile Interference',
    Gameplay_SamplingTheEchoes = 'Gameplay_Sampling the Echoes',
    Gameplay_InitialBreakthrough = 'Gameplay_Initial Breakthrough',
    Gameplay_VolatileFrontierPart1 = 'Gameplay_Volatile Frontier (Part 1)',
    Gameplay_VolatileFrontierPart2 = 'Gameplay_Volatile Frontier (Part 2)',
    Gameplay_StaticNewGlitches = 'Gameplay_Static\'s New Glitches',
    Gameplay_AdvancedCountermeasures = 'Gameplay_Advanced Countermeasures',
    Gameplay_EchoesOfAncientLore = 'Gameplay_Echoes of Ancient Lore',
    Gameplay_DesigningTheBane = 'Gameplay_Designing the Bane',
    Gameplay_TheFinalAssault = 'Gameplay_The Final Assault',
    Gameplay_TheResonanceWave = 'Gameplay_The Resonance Wave',

    // Special Playback Scene
    FullStoryPlayback = 'FullStoryPlayback'
}

export function getStoryName(levelName: LevelNames): string {
    // // Remove 'Story_' prefix for display if present
    if (levelName.startsWith('Story_')) {
        return levelName.substring('Story_'.length);
    }
    return levelName;
}

export function getLevelName(levelNameStr: string): LevelNames {
    // This function needs to be robust to handle both raw enum values and display names
    // For now, it assumes levelNameStr is one of the enum values directly.
    // If you pass a display name (e.g., "The Glitch Annihilation"), it won't find it directly.
    // A more robust solution would involve a lookup map.
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
    LevelNames.Story_TheGlitchAnnihilation,
    LevelNames.Story_HelloGenie,
    LevelNames.Story_TheDormantScars,
    LevelNames.Story_ThePhantomArrival,
    LevelNames.Story_VolatileInterference,
    LevelNames.Story_SamplingTheEchoes,
    LevelNames.Story_InitialBreakthrough,
    LevelNames.Story_VolatileFrontierPart1,
    LevelNames.Story_VolatileFrontierPart2,
    LevelNames.Story_StaticNewGlitches,
    LevelNames.Story_AdvancedCountermeasures,
    LevelNames.Story_EchoesOfAncientLore,
    LevelNames.Story_DesigningTheBane,
    LevelNames.Story_TheFinalAssault,
    LevelNames.Story_TheResonanceWave,
];

// Map story scenes to their corresponding gameplay levels
export const STORY_TO_GAMEPLAY_MAP: Record<LevelNames, LevelNames> = {
    [LevelNames.Story_TheGlitchAnnihilation]: LevelNames.Gameplay_TheGlitchAnnihilation,
    [LevelNames.Story_HelloGenie]: LevelNames.Gameplay_HelloGenie,
    [LevelNames.Story_TheDormantScars]: LevelNames.Gameplay_TheDormantScars,
    [LevelNames.Story_ThePhantomArrival]: LevelNames.Gameplay_ThePhantomArrival,
    [LevelNames.Story_VolatileInterference]: LevelNames.Gameplay_VolatileInterference,
    [LevelNames.Story_SamplingTheEchoes]: LevelNames.Gameplay_SamplingTheEchoes,
    [LevelNames.Story_InitialBreakthrough]: LevelNames.Gameplay_InitialBreakthrough,
    [LevelNames.Story_VolatileFrontierPart1]: LevelNames.Gameplay_VolatileFrontierPart1,
    [LevelNames.Story_VolatileFrontierPart2]: LevelNames.Gameplay_VolatileFrontierPart2,
    [LevelNames.Story_StaticNewGlitches]: LevelNames.Gameplay_StaticNewGlitches,
    [LevelNames.Story_AdvancedCountermeasures]: LevelNames.Gameplay_AdvancedCountermeasures,
    [LevelNames.Story_EchoesOfAncientLore]: LevelNames.Gameplay_EchoesOfAncientLore,
    [LevelNames.Story_DesigningTheBane]: LevelNames.Gameplay_DesigningTheBane,
    [LevelNames.Story_TheFinalAssault]: LevelNames.Gameplay_TheFinalAssault,
    [LevelNames.Story_TheResonanceWave]: LevelNames.Gameplay_TheResonanceWave,

    // Add other non-story levels to avoid TypeScript errors, mapping them to themselves or a default
    [LevelNames.MainMenu]: LevelNames.MainMenu,
    [LevelNames.Tutorial]: LevelNames.Gameplay_Tutorial, // Tutorial story leads to gameplay tutorial
    [LevelNames.Gameplay_Tutorial]: LevelNames.Gameplay_Tutorial,
    [LevelNames.FullStoryPlayback]: LevelNames.FullStoryPlayback,

    // Placeholder mappings for actual gameplay levels if they are ever looked up from this map
    [LevelNames.Gameplay_TheGlitchAnnihilation]: LevelNames.Gameplay_TheGlitchAnnihilation,
    [LevelNames.Gameplay_HelloGenie]: LevelNames.Gameplay_HelloGenie,
    [LevelNames.Gameplay_TheDormantScars]: LevelNames.Gameplay_TheDormantScars,
    [LevelNames.Gameplay_ThePhantomArrival]: LevelNames.Gameplay_ThePhantomArrival,
    [LevelNames.Gameplay_VolatileInterference]: LevelNames.Gameplay_VolatileInterference,
    [LevelNames.Gameplay_SamplingTheEchoes]: LevelNames.Gameplay_SamplingTheEchoes,
    [LevelNames.Gameplay_InitialBreakthrough]: LevelNames.Gameplay_InitialBreakthrough,
    [LevelNames.Gameplay_VolatileFrontierPart1]: LevelNames.Gameplay_VolatileFrontierPart1,
    [LevelNames.Gameplay_VolatileFrontierPart2]: LevelNames.Gameplay_VolatileFrontierPart2,
    [LevelNames.Gameplay_StaticNewGlitches]: LevelNames.Gameplay_StaticNewGlitches,
    [LevelNames.Gameplay_AdvancedCountermeasures]: LevelNames.Gameplay_AdvancedCountermeasures,
    [LevelNames.Gameplay_EchoesOfAncientLore]: LevelNames.Gameplay_EchoesOfAncientLore,
    [LevelNames.Gameplay_DesigningTheBane]: LevelNames.Gameplay_DesigningTheBane,
    [LevelNames.Gameplay_TheFinalAssault]: LevelNames.Gameplay_TheFinalAssault,
    [LevelNames.Gameplay_TheResonanceWave]: LevelNames.Gameplay_TheResonanceWave,
};
