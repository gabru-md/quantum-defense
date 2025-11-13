import {StoryScene} from "./StoryScene.ts";

export class StoryLevel1 extends StoryScene {
    constructor() {
        super('Story Level 1', ['Even a Guardian needs a guide\nHi I am Genie!', 'Static\'s operations are rising rapidly,\nHe is sending out fleet of Glitches.', 'We need your help Guardian!'], 'Level 1');
    }
}

export class StoryLevel2 extends StoryScene {
    constructor() {
        super('Story Level 2', ['The Glitches have identified more paths to the nexus\nIt\'s not looking good.', 'The Glitches have identified more paths to the nexus\nIt\'s not looking good.\n\nBut I can still count on you, right?'], 'Level 2');
    }
}

export class StoryLevel3 extends StoryScene {
    constructor() {
        super('Story Level 3', ['I have some news for you Guardian.', 'The Phantom is on the move!', 'Remember Guardian:\n\n- It disables all towers\n- Only you can defeat the Phantom!', 'Good Luck Guardian!'], 'Level 3');
    }
}

export class StoryLevel4 extends StoryScene {
    constructor() {
        super('Story Level 4', ['We don\'t know the source of Static\'s Power', 'But with your help we can sample the remains of Phantom.', 'And maybe we can put an end to it all!', 'Oh no, there are more glitches!!', 'You are needed Guardian!'], 'Level 4');
    }
}

export class StoryLevel5 extends StoryScene {
    constructor() {
        super('Story Level 5', ['That was amazing, I know we can count on you!', 'Also, I am close to sampling Phantom\nI need maybe 2 more for a breakthrough', 'Can you do that, Guardian?'], 'Level 5');
    }
}