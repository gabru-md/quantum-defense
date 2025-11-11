import {Level} from './lib/Level.ts';
import {GAME_HEIGHT, GAME_WIDTH} from "../scripts/util.ts";

export class Level4 extends Level {
    constructor() {
        super('Level 4');
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        // @ts-ignore
        const path = this.add.path();

        const centerX = GAME_WIDTH / 2;
        const centerY = GAME_HEIGHT / 2;

        const totalRotations = 5; // More rotations to start from further out
        const pointsPerRotation = 60;
        const totalPoints = totalRotations * pointsPerRotation;

        // The angle offset will make the spiral start from the top (-PI/2)
        const angleOffset = -Math.PI / 2;

        // The starting radius needs to be large enough to be off-screen
        const startRadius = Math.max(GAME_WIDTH / 2, GAME_HEIGHT / 2) - 50;
        const endRadius = 0; // End at the center

        // Generate the spiral points
        for (let i = 0; i <= totalPoints; i++) {
            const progress = i / totalPoints;
            const angle = angleOffset + (progress * totalRotations * 2 * Math.PI);

            // Radius decreases as progress increases
            const radius = startRadius - (progress * (startRadius - endRadius));

            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            if (i === 0) {
                path.moveTo(x, y); // Start the path at the first point
            } else {
                path.lineTo(x, y);
            }
        }

        return {'first': path};
    }

    getWaveConfig(wave: number): {
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
                {
                    type: 'enemy',
                    texture: 'enemy1',
                    count: 10,
                    delay: 800,
                    health: 120,
                    speed: 60,
                    moneyValue: 10,
                    path: 'first'
                },
                {
                    type: 'enemy',
                    texture: 'enemy2',
                    count: 5,
                    delay: 800,
                    health: 60,
                    speed: 120,
                    moneyValue: 15,
                    path: 'first'
                },
                {
                    type: 'enemy',
                    texture: 'enemy3',
                    count: 2,
                    delay: 2000,
                    health: 600,
                    speed: 30,
                    moneyValue: 50,
                    path: 'first'
                },
                {
                    type: 'enemy',
                    texture: 'enemy1',
                    count: 10,
                    delay: 800,
                    health: 120,
                    speed: 60,
                    moneyValue: 10,
                    path: 'first'
                },
                {
                    type: 'enemy',
                    texture: 'enemy3',
                    count: 2,
                    delay: 2000,
                    health: 600,
                    speed: 30,
                    moneyValue: 50,
                    path: 'first'
                },
                {
                    type: 'enemy',
                    texture: 'enemy2',
                    count: 10,
                    delay: 800,
                    health: 60,
                    speed: 120,
                    moneyValue: 15,
                    path: 'first'
                },
                {
                    type: 'enemy',
                    texture: 'enemy3',
                    count: 2,
                    delay: 2000,
                    health: 600,
                    speed: 30,
                    moneyValue: 50,
                    path: 'first'
                }
            ]
        }
        return [];
    }

    nextScene(): string {
        return "Level 5";
    }
}
