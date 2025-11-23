import * as Phaser from 'phaser';
import {Level} from '../lib/Level.ts';
import {GAME_HEIGHT, GAME_WIDTH} from '../../scripts/Util.ts';
import {LevelNames} from '../lib/LevelNames.ts';
import {PathMaker} from "../lib/PathMaker.ts";
import {QuantumEcho} from "../../entities/QuantumEcho.ts";

export class Gameplay_TheFirstEcho extends Level {
    constructor() {
        super(LevelNames.Gameplay_TheFirstEcho);
    }

    private firstPath(): Phaser.Curves.Path {
        const path = new PathMaker(GAME_WIDTH / 2, GAME_HEIGHT / 2)
            .down(200)
            .right(500)
            .up(600)
            .left(1100)
            .down(650)
            .right(135)
            .down(200)
            .reverse()
            .create(this)
        return path;
    }

    private secondPath(): Phaser.Curves.Path {
        const path = new PathMaker(GAME_WIDTH / 2, GAME_HEIGHT / 2)
            .down(200)
            .right(500)
            .up(250)
            .right(150)
            .down(500)
            .reverse()
            .create(this);
        return path;
    }

    create() {
        super.create();
        // Keep the static rift for interference
        this.createRift(1080, GAME_HEIGHT - 100, 'static');
        this.createRift(400, GAME_HEIGHT / 2, 'dormant'); // Keep dormant rift
        this.createMiniRift(925, GAME_HEIGHT / 2 - 225, 'dormant'); // Keep dormant rift

        // Introduce Quantum Echoes
        this.quantumEchoes.add(new QuantumEcho(this, 200, 200));
        this.quantumEchoes.add(new QuantumEcho(this, GAME_WIDTH - 200, 200));
        this.quantumEchoes.add(new QuantumEcho(this, GAME_WIDTH / 2, GAME_HEIGHT / 2));
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        return {
            first: this.firstPath(),
            second: this.secondPath(),
        };
    }

    getWaveConfig(wave: number): {
        type: string;
        texture: string;
        count: number;
        delay: number;
        health: number;
        speed: number;
        energyValue: number;
        path: string;
    }[] {
        switch (wave) {
            case 1:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 15, delay: 1500, health: 130, speed: 60, energyValue: 12, path: 'first' },
                    { type: 'enemy', texture: 'enemy1', count: 15, delay: 1500, health: 130, speed: 60, energyValue: 12, path: 'second' },
                ];
            case 2:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 20, delay: 1200, health: 140, speed: 65, energyValue: 15, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 5, delay: 1800, health: 100, speed: 80, energyValue: 18, path: 'second' },
                ];
            case 3:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 25, delay: 1000, health: 150, speed: 70, energyValue: 15, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 8, delay: 1600, health: 110, speed: 85, energyValue: 20, path: 'second' },
                ];
            case 4:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 20, delay: 900, health: 160, speed: 75, energyValue: 18, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 10, delay: 1400, health: 120, speed: 90, energyValue: 22, path: 'first' },
                ];
            case 5:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 30, delay: 800, health: 170, speed: 80, energyValue: 18, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 12, delay: 1200, health: 130, speed: 95, energyValue: 25, path: 'second' },
                ];
            case 6:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 25, delay: 700, health: 180, speed: 85, energyValue: 20, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 15, delay: 1100, health: 140, speed: 100, energyValue: 28, path: 'first' },
                ];
            case 7:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 30, delay: 600, health: 190, speed: 90, energyValue: 20, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 18, delay: 1000, health: 150, speed: 105, energyValue: 30, path: 'second' },
                ];
            case 8:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 35, delay: 550, health: 200, speed: 95, energyValue: 22, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 20, delay: 900, health: 160, speed: 110, energyValue: 32, path: 'first' },
                ];
            case 9:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 40, delay: 500, health: 210, speed: 100, energyValue: 25, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 22, delay: 800, health: 170, speed: 115, energyValue: 35, path: 'second' },
                ];
            case 10:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 45, delay: 400, health: 220, speed: 105, energyValue: 28, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 25, delay: 700, health: 180, speed: 120, energyValue: 38, path: 'first' },
                ];
            default:
                return [];
        }
    }

    nextScene(): LevelNames {
        return LevelNames.Story_InitialBreakthrough;
    }
}
