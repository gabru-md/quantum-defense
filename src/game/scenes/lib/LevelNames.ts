export enum LevelNames {
    Introduction = 'Introduction',
    HelloGenie = 'Hello, Genie!',
    TrustMe = 'Trust Me',
    ThePhantom = 'The Phantom',
    RiseOfStatic = 'Rise of Static',
    Breakthrough = 'Breakthrough',
    TheCliffhanger = 'The Cliffhanger',
    Level2 = 'Level2',
    Level3 = 'Level3',
    Level4 = 'Level4',
    Level5 = 'Level5',
    Level6 = 'Level6',
    Level7 = 'Level7',
    Level8 = 'Level8',
    Level9 = 'Level9',
    Level10 = 'Level10',
    Level11 = 'Level11',
    Level12 = 'Level12',
    Level13 = 'Level13',
    Level14 = 'Level14',
    Level15 = 'Level15',
    MenuScene = 'MenuScene'
}

export function getStoryName(levelName: LevelNames): string {
    return `Story ${levelName}`;
}

export function getLevelName(levelNameStr: string): LevelNames {
    if (levelNameStr.startsWith("Story ")) {
        levelNameStr = levelNameStr.slice("Story ".length);
    }
    for (const levelName of Object.values(LevelNames)) {
        if (levelName === levelNameStr) {
            return levelName;
        }
    }
    throw new Error(`Invalid level name string: ${levelNameStr}`);
}

export function getLevelNameKey(levelNameStr: string): string {
    return Object.keys(LevelNames).find(key => LevelNames[key as keyof typeof LevelNames] === getLevelName(levelNameStr)) || '';
}
