export enum LevelNames {
    Introduction = 'Introduction',
    HelloGenie = 'Hello, Genie!',
    TrustMe = 'Trust Me',
    ThePhantom = 'The Phantom',
    RiseOfStatic = 'Rise of Static',
    Breakthrough = 'Breakthrough',
    TheCliffhanger = 'The Cliffhanger',
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
