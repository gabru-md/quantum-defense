import { BaseStoryScene, StoryStep } from './lib/BaseStoryScene';

export class StoryScene extends BaseStoryScene {
    private story: string[] = [];
    private nextScene!: string;

    constructor(key: string, story: string[] = [], nextScene: string) {
        super(key);
        this.story = story;
        this.nextScene = nextScene;
    }

    getStoryConfig(): { steps: StoryStep[]; nextScene: string } {
        return {
            steps: this.story.map(text => ({ text })),
            nextScene: this.nextScene,
        };
    }
}
