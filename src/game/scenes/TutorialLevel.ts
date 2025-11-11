import * as Phaser from 'phaser';
import { Level } from './lib/Level';
import { GAME_HEIGHT, GAME_WIDTH } from "../scripts/Util.ts";
import { TutorialManager } from './lib/manager/TutorialManager';

export class TutorialLevel extends Level {
    private tutorialManager!: TutorialManager;

    constructor() {
        super('Tutorial');
    }

    create(): void {
        super.create(); // Call the base Level's create method
        this.tutorialManager = new TutorialManager(this);
        this.tutorialManager.setup();
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        const path = new Phaser.Curves.Path(0, GAME_HEIGHT / 2);
        path.lineTo(GAME_WIDTH, GAME_HEIGHT / 2);
        return { 'path1': path };
    }

    protected getTowerSlots(): { x: number; y: number }[] {
        return [
            { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 - 100 },
            { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 + 100 },
        ];
    }

    public getWaveConfig(wave: number): {
        type: string;
        texture: string;
        count: number;
        delay: number;
        health: number;
        speed: number;
        moneyValue: number;
        path: string;
    }[] {
        switch (wave) {
            case 1: // First enemy
                return [{ type: 'enemy', texture: 'enemy1', count: 1, delay: 1000, health: 100, speed: 50, moneyValue: 10, path: 'path1' }];
            case 2: // First special enemy
                return [{ type: 'specialEnemy', texture: 'specialEnemy', count: 1, delay: 1000, health: 100, speed: 50, moneyValue: 25, path: 'path1' }];
            case 3: // Final tutorial wave
                return [
                    { type: 'enemy', texture: 'enemy1', count: 5, delay: 1000, health: 100, speed: 50, moneyValue: 10, path: 'path1' },
                    { type: 'specialEnemy', texture: 'specialEnemy', count: 1, delay: 1000, health: 100, speed: 50, moneyValue: 25, path: 'path1' }
                ];
            default:
                return [];
        }
    }

    public nextScene(): string {
        return 'Level 1'; // After tutorial, go to Level 1
    }
}
