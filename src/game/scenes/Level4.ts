import {BaseTowerDefenseLevel, GAME_WIDTH, GAME_HEIGHT} from './BaseTowerDefenseLevel';

export class Level4 extends BaseTowerDefenseLevel {
    constructor() {
        super('Level4');
    }

    protected definePaths(): void {
        const p = 100; // Padding from edges
        const s = 100; // Spacing between path rings

        const path = this.add.path(GAME_WIDTH - p, -50); // Start off-screen top-right

        // --- Define the 4 rings of the spiral ---
        // Ring 1 (Outer)
        path.lineTo(GAME_WIDTH - p, p);
        path.lineTo(p, p);
        path.lineTo(p, GAME_HEIGHT - p);
        path.lineTo(GAME_WIDTH - p, GAME_HEIGHT - p);
        path.lineTo(GAME_WIDTH - p, p + s);

        // Ring 2
        path.lineTo(p + s, p + s);
        path.lineTo(p + s, GAME_HEIGHT - p - s);
        path.lineTo(GAME_WIDTH - p - s, GAME_HEIGHT - p - s);
        path.lineTo(GAME_WIDTH - p - s, p + 2 * s);

        // Ring 3
        path.lineTo(p + 2 * s, p + 2 * s);
        path.lineTo(p + 2 * s, GAME_HEIGHT - p - 2 * s);
        path.lineTo(GAME_WIDTH - p - 2 * s, GAME_HEIGHT - p - 2 * s);
        path.lineTo(GAME_WIDTH - p - 2 * s, p + 3 * s);

        // Ring 4 (Inner)
        path.lineTo(p + 3 * s, p + 3 * s);
        path.lineTo(p + 3 * s, GAME_HEIGHT - p - 3 * s);


        // --- End in the center ---
        path.lineTo(GAME_WIDTH / 2, GAME_HEIGHT - p - 3 * s);
        path.lineTo(GAME_WIDTH / 2, GAME_HEIGHT / 2);

        this.paths = {'first': path};
    }

    protected getTowerSlots(): { x: number; y: number }[] {
        // Place tower slots in the empty spaces between the spiral rings
        return [
            // Center area
            {x: 400, y: 200},
            {x: 400, y: 580},
            // Mid-ring gaps
            {x: 170, y: 170},
            {x: 630, y: 170},
            {x: 170, y: 600},
            {x: 630, y: 600},
            // Outer corners
            {x: 50, y: 400},
            {x: 750, y: 400},
        ];
    }

    protected getWaveConfig(wave: number): {
        type: string;
        texture: string;
        count: number;
        delay: number;
        health: number;
        speed: number;
        moneyValue: number;
        path: string;
    }[] {
        if (wave === 1) {
            return [
                {type: 'enemy', texture: 'enemy1', count: 5, delay: 800, health: 100, speed: 50, moneyValue: 10, path: 'first'},
                {type: 'enemy', texture: 'enemy2', count: 2, delay: 800, health: 50, speed: 100, moneyValue: 15, path: 'first'},
                {type: 'enemy', texture: 'enemy3', count: 1, delay: 2000, health: 500, speed: 25, moneyValue: 50, path: 'first'},
                {type: 'enemy', texture: 'enemy1', count: 5, delay: 800, health: 100, speed: 50, moneyValue: 10, path: 'first'},
                {type: 'enemy', texture: 'enemy3', count: 1, delay: 2000, health: 500, speed: 25, moneyValue: 50, path: 'first'},
                {type: 'enemy', texture: 'enemy2', count: 5, delay: 800, health: 50, speed: 100, moneyValue: 15, path: 'first'},
                {type: 'enemy', texture: 'enemy3', count: 1, delay: 2000, health: 500, speed: 25, moneyValue: 50, path: 'first'}
            ]
        }
        return [];
    }

    protected nextScene(): string {
        return "Level5";
    }
}
