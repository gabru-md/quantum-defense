import {StoryScene} from './StoryScene.ts';
import {getStoryName, LevelNames} from "./levels/LevelNames.ts";

export class StoryLevel1 extends StoryScene {
    constructor() {
        super(
            getStoryName(LevelNames.HelloGenie),
            [
                'Even a Guardian needs a guide\nHi I am Genie!',
                "Static's operations are rising rapidly,\nHe is sending out fleet of Glitches.",
                'We need your help Guardian!',
            ],
            LevelNames.HelloGenie
        );
    }
}

export class StoryLevel2 extends StoryScene {
    constructor() {
        super(
            getStoryName(LevelNames.TrustMe),
            [
                "The Glitches have identified more paths to the nexus\nIt's not looking good.",
                "The Glitches have identified more paths to the nexus\nIt's not looking good.\n\nBut I can still count on you, right?",
            ],
            LevelNames.TrustMe
        );
    }
}

export class StoryLevel3 extends StoryScene {
    constructor() {
        super(
            getStoryName(LevelNames.ThePhantom),
            [
                'I have some news for you Guardian.',
                'The Phantom is on the move!',
                'Remember Guardian:\n\n- It disables all towers\n- Only you can defeat the Phantom!',
                'Good Luck Guardian!',
            ],
            LevelNames.ThePhantom
        );
    }
}

export class StoryLevel4 extends StoryScene {
    constructor() {
        super(
            getStoryName(LevelNames.RiseOfStatic),
            [
                "We don't know the source of Static's Power",
                'But with your help we can sample the remains of Phantom.',
                'And maybe we can put an end to it all!',
                'Oh no, there are more glitches!!',
                'You are needed Guardian!',
            ],
            LevelNames.RiseOfStatic
        );
    }
}

export class StoryLevel5 extends StoryScene {
    constructor() {
        super(
            getStoryName(LevelNames.Breakthrough),
            [
                'That was amazing, I know we can count on you!',
                'Also, I am close to sampling Phantom\nI need maybe 2 more for a breakthrough',
                'Can you do that, Guardian?',
            ],
            LevelNames.Breakthrough
        );
    }
}
