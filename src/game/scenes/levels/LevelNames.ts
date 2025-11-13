export enum LevelNames {
    Introduction = "Introduction",
    HelloGenie = "Hello, Genie!",
    TrustMe = "Trust Me",
    ThePhantom = "The Phantom",
    RiseOfStatic = "Rise of Static",
    Breakthrough = "Breakthrough"
}

export function getStoryName(levelName: LevelNames): string {
    return `Story ${levelName}`;
}