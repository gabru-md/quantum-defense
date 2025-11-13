import {Level} from '../lib/Level.ts';
import {GAME_HEIGHT, GAME_WIDTH} from "../../scripts/Util.ts";
import {getStoryName, LevelNames} from "./LevelNames.ts";

export class Level4 extends Level {
    constructor() {
        super(LevelNames.RiseOfStatic);
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        // @ts-ignore
        const path = this.add.path();

        const centerX = GAME_WIDTH / 2;
        const centerY = GAME_HEIGHT / 2;

        const totalRotations = 5;
        const pointsPerRotation = 60;
        const totalPoints = totalRotations * pointsPerRotation;

        const angleOffset = -Math.PI / 2;

        const startRadius = Math.max(GAME_WIDTH / 2, GAME_HEIGHT / 2) - 175;
        const endRadius = 0;

        for (let i = 0; i <= totalPoints; i++) {
            const progress = i / totalPoints;
            const angle = angleOffset + (progress * totalRotations * 2 * Math.PI);
            const radius = startRadius - (progress * (startRadius - endRadius));
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            if (i === 0) {
                path.moveTo(x, y);
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
        switch (wave) {
            case 1:
                return [
                    {type: 'enemy', texture: 'enemy1', count: 15, delay: 800, health: 130, speed: 65, moneyValue: 15, path: 'first'},
                    {type: 'enemy', texture: 'enemy2', count: 10, delay: 600, health: 90, speed: 120, moneyValue: 20, path: 'first'},
                ];
            case 2:
                return [
                    {type: 'enemy', texture: 'enemy3', count: 5, delay: 1500, health: 700, speed: 35, moneyValue: 60, path: 'first'},
                    {type: 'enemy', texture: 'enemy1', count: 10, delay: 800, health: 130, speed: 65, moneyValue: 15, path: 'first'},
                ];
            case 3:
                return [
                    {type: 'enemy', texture: 'enemy2', count: 20, delay: 500, health: 90, speed: 130, moneyValue: 20, path: 'first'},
                    {type: 'specialEnemy', texture: 'specialEnemy', count: 2, delay: 5000, health: 250, speed: 80, moneyValue: 120, path: 'first'},
                ];
            default:
                return [];
        }
    }

    nextScene(): string {
        return getStoryName(LevelNames.Breakthrough);
    }
}
