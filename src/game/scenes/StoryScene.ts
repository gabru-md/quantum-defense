import {BaseStoryScene, StoryStep} from './lib/BaseStoryScene';

export class StoryScene extends BaseStoryScene {
    private story: string[] = [];
    private nextScene!: string;
    private title: string;

    constructor(key: string, story: string[] = [], nextScene: string, title: string = '') {
        super(key);
        this.story = story;
        this.nextScene = nextScene;
        if (title.length > 0) {
            this.title = title;
        } else {
            this.title = nextScene;
        }
    }

    getStoryConfig(): { title?: string; steps: StoryStep[]; nextScene: string } {
        return {
            title: this.title,
            steps: this.story.map(text => ({text})),
            nextScene: this.nextScene,
        };
    }
}
