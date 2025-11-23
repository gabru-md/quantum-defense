import {Level} from '../lib/Level.ts';
import {LevelNames} from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import {PathMaker} from "../lib/PathMaker.ts";
import {GAME_HEIGHT, GAME_WIDTH} from "../../scripts/Util.ts";
import {QuantumEcho} from "../../entities/QuantumEcho.ts";

export class Gameplay_TheEchoHunt_2 extends Level {
    constructor() {
        super(LevelNames.Gameplay_TheEchoHunt_2);
    }

    private getFirstPath(): Phaser.Curves.Path {
        const path = new PathMaker(100, 100)
            .right(1000)
            .down(750)
            .left(850)
            .create(this)
        return path;
    }

    private getSecondPath(): Phaser.Curves.Path {
        const path = new PathMaker(100, 250)
            .right(850)
            .down(75)
            .left(425)
            .down(525)
            .left(275)
            .create(this);
        return path;
    }


    definePaths(): { [key: string]: Phaser.Curves.Path } {
        return {
            first: this.getFirstPath(),
            second: this.getSecondPath()
        };
    }

    create() {
        super.create();
        this.createRift(800, 575, 'gradient'); // Keep gradient rift
        this.createMiniRift(GAME_WIDTH - 70, GAME_HEIGHT - 45, 'dormant'); // Keep dormant rift

        // Introduce Quantum Echoes
        this.quantumEchoes.add(new QuantumEcho(this, 250, 150));
        this.quantumEchoes.add(new QuantumEcho(this, GAME_WIDTH - 250, 150));
        this.quantumEchoes.add(new QuantumEcho(this, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 100));
        this.quantumEchoes.add(new QuantumEcho(this, 150, GAME_HEIGHT - 150));
        this.quantumEchoes.add(new QuantumEcho(this, GAME_WIDTH - 150, GAME_HEIGHT - 150));
        this.quantumEchoes.add(new QuantumEcho(this, GAME_WIDTH / 2 - 200, GAME_HEIGHT / 2 - 100));
        this.quantumEchoes.add(new QuantumEcho(this, GAME_WIDTH / 2 + 200, GAME_HEIGHT / 2 - 100));
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
                    { type: 'enemy', texture: 'enemy1', count: 20, delay: 1300, health: 150, speed: 70, energyValue: 15, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 8, delay: 1800, health: 110, speed: 85, energyValue: 20, path: 'second' },
                ];
            case 2:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 25, delay: 1000, health: 160, speed: 75, energyValue: 18, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 10, delay: 1600, health: 120, speed: 90, energyValue: 22, path: 'second' },
                ];
            case 3:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 30, delay: 900, health: 170, speed: 80, energyValue: 18, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 12, delay: 1400, health: 130, speed: 95, energyValue: 25, path: 'first' },
                ];
            case 4:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 28, delay: 800, health: 180, speed: 85, energyValue: 20, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 15, delay: 1200, health: 140, speed: 100, energyValue: 28, path: 'second' },
                ];
            case 5:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 32, delay: 700, health: 190, speed: 90, energyValue: 20, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 18, delay: 1100, health: 150, speed: 105, energyValue: 30, path: 'first' },
                ];
            case 6:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 35, delay: 600, health: 200, speed: 95, energyValue: 22, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 20, delay: 1000, health: 160, speed: 110, energyValue: 32, path: 'second' },
                ];
            case 7:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 30, delay: 550, health: 210, speed: 100, energyValue: 22, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 22, delay: 900, health: 170, speed: 115, energyValue: 35, path: 'first' },
                ];
            case 8:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 35, delay: 500, health: 220, speed: 105, energyValue: 25, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 25, delay: 800, health: 180, speed: 120, energyValue: 38, path: 'second' },
                ];
            case 9:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 40, delay: 450, health: 230, speed: 110, energyValue: 28, path: 'second' },
                    { type: 'enemy', texture: 'enemy2', count: 28, delay: 700, health: 190, speed: 125, energyValue: 40, path: 'first' },
                ];
            case 10:
                return [
                    { type: 'enemy', texture: 'enemy1', count: 45, delay: 350, health: 240, speed: 115, energyValue: 30, path: 'first' },
                    { type: 'enemy', texture: 'enemy2', count: 30, delay: 600, health: 200, speed: 130, energyValue: 42, path: 'second' },
                ];
            default:
                return [];
        }
    }

    nextScene(): LevelNames {
        return LevelNames.Story_StaticNewGlitches;
    }
}
