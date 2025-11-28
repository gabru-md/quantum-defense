import {Level} from '../lib/Level.ts';
import {LevelNames} from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import {PathMaker} from "../lib/PathMaker.ts";
import {GAME_HEIGHT, GAME_WIDTH} from "../../scripts/Util.ts";
import {QuantumEcho} from "../../entities/QuantumEcho.ts";

export class Gameplay_TheEchoHunt_1 extends Level {
    constructor() {
        super(LevelNames.Gameplay_TheEchoHunt_1);
    }

    private getFirstPath(): Phaser.Curves.Path {
        const path = new PathMaker(GAME_WIDTH * 3 / 4, 100)
            .down(400)
            .left(400)
            .up(225)
            .left(500)
            .down(500)
            .create(this)
        return path;
    }

    private getSecondPath(): Phaser.Curves.Path {
        const path = new PathMaker(GAME_WIDTH * 7 / 8, GAME_HEIGHT - 150)
            .to(GAME_WIDTH * 7 / 8, 500)
            .to(1140, 500)
            .left(400)
            .up(225)
            .left(500)
            .down(500)
            .create(this)
        return path;
    }

    create() {
        super.create();
        this.createRift(950, 850, 'gradient'); // Keep gradient rift
        this.createRift(375, 150, 'nexus'); // Keep guardian rift
        this.createMiniRift(GAME_WIDTH - 75, 235, 'dormant'); // Keep dormant rift

        // Introduce Quantum Echoes
        this.quantumEchoes.add(new QuantumEcho(this, 300, 300));
        this.quantumEchoes.add(new QuantumEcho(this, GAME_WIDTH - 300, 300));
        this.quantumEchoes.add(new QuantumEcho(this, GAME_WIDTH / 2, GAME_HEIGHT - 200));
        this.quantumEchoes.add(new QuantumEcho(this, 100, GAME_HEIGHT / 2));
        this.quantumEchoes.add(new QuantumEcho(this, GAME_WIDTH - 100, GAME_HEIGHT / 2));
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        return {
            first: this.getFirstPath(),
            second: this.getSecondPath()
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
                    { type: 'enemy', texture: 'enemy1', count: 15, delay: 1400, health: 140, speed: 65, energyValue: 15, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 5, delay: 1800, health: 105, speed: 80, energyValue: 18, path: 'second' },
                ];
            case 2:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 20, delay: 1100, health: 150, speed: 70, energyValue: 18, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 8, delay: 1600, health: 115, speed: 85, energyValue: 20, path: 'second' },
                ];
            case 3:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 25, delay: 900, health: 160, speed: 75, energyValue: 18, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 10, delay: 1400, health: 125, speed: 90, energyValue: 22, path: 'first' },
                ];
            case 4:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 30, delay: 800, health: 170, speed: 80, energyValue: 20, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 12, delay: 1200, health: 135, speed: 95, energyValue: 25, path: 'second' },
                ];
            case 5:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 28, delay: 700, health: 180, speed: 85, energyValue: 20, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 15, delay: 1100, health: 145, speed: 100, energyValue: 28, path: 'first' },
                ];
            case 6:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 32, delay: 600, health: 190, speed: 90, energyValue: 22, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 18, delay: 1000, health: 155, speed: 105, energyValue: 30, path: 'second' },
                ];
            case 7:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 35, delay: 550, health: 200, speed: 95, energyValue: 22, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 20, delay: 900, health: 165, speed: 110, energyValue: 32, path: 'first' },
                ];
            case 8:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 30, delay: 500, health: 210, speed: 100, energyValue: 25, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 22, delay: 800, health: 175, speed: 115, energyValue: 35, path: 'second' },
                ];
            case 9:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 35, delay: 450, health: 220, speed: 105, energyValue: 28, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 25, delay: 700, health: 185, speed: 120, energyValue: 38, path: 'first' },
                ];
            case 10:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 40, delay: 350, health: 230, speed: 110, energyValue: 30, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 28, delay: 600, health: 195, speed: 125, energyValue: 40, path: 'second' },
                ];
            default:
                return [];
        }
    }

    nextScene(): LevelNames {
        return LevelNames.Gameplay_TheEchoHunt_2; // Next scene is Level 7
    }
}
