import {Level} from '../lib/Level.ts';
import {LevelNames} from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import {PathMaker} from "../lib/PathMaker.ts";
import {GAME_HEIGHT, GAME_WIDTH} from "../../scripts/Util.ts";

export class Gameplay_HelloGenie extends Level { // Renamed class
    constructor() {
        super(LevelNames.Gameplay_HelloGenie); // Updated super call
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        const path = new PathMaker(150, GAME_HEIGHT - 150)
            .up(200)
            .right(500)
            .down(75)
            .right(300)
            .up(600)
            .left(300)
            .down(75)
            .left(500)
            .up(200)
            .create(this);
        return {first: path};
    }

    create() {
        super.create();
        this.createRift(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'dormant');
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
                return [{
                    type: 'enemy',
                    texture: 'enemy1',
                    count: 12,
                    delay: 1400,
                    health: 100,
                    speed: 50,
                    energyValue: 10,
                    path: 'first'
                }];
            case 2:
                return [{
                    type: 'enemy',
                    texture: 'enemy1',
                    count: 18,
                    delay: 1100,
                    health: 110,
                    speed: 55,
                    energyValue: 10,
                    path: 'first'
                }];
            case 3:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 15,
                        delay: 900,
                        health: 120,
                        speed: 60,
                        energyValue: 12,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 4,
                        delay: 1800,
                        health: 85,
                        speed: 70,
                        energyValue: 15,
                        path: 'first'
                    },
                ];
            case 4:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 20,
                        delay: 800,
                        health: 130,
                        speed: 65,
                        energyValue: 12,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 6,
                        delay: 1600,
                        health: 95,
                        speed: 75,
                        energyValue: 15,
                        path: 'first'
                    },
                ];
            case 5:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 15,
                        delay: 700,
                        health: 140,
                        speed: 70,
                        energyValue: 15,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 8,
                        delay: 1400,
                        health: 105,
                        speed: 80,
                        energyValue: 18,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy3',
                        count: 4,
                        delay: 2200,
                        health: 160,
                        speed: 65,
                        energyValue: 20,
                        path: 'first'
                    },
                ];
            case 6:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 18,
                        delay: 650,
                        health: 150,
                        speed: 75,
                        energyValue: 15,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 10,
                        delay: 1300,
                        health: 115,
                        speed: 85,
                        energyValue: 18,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy3',
                        count: 6,
                        delay: 2000,
                        health: 170,
                        speed: 70,
                        energyValue: 20,
                        path: 'first'
                    },
                ];
            case 7:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 20,
                        delay: 600,
                        health: 160,
                        speed: 80,
                        energyValue: 18,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 12,
                        delay: 1200,
                        health: 125,
                        speed: 90,
                        energyValue: 20,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy3',
                        count: 8,
                        delay: 1800,
                        health: 180,
                        speed: 75,
                        energyValue: 22,
                        path: 'first'
                    },
                ];
            case 8:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 15,
                        delay: 550,
                        health: 170,
                        speed: 85,
                        energyValue: 18,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 15,
                        delay: 1100,
                        health: 135,
                        speed: 95,
                        energyValue: 20,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy3',
                        count: 10,
                        delay: 1600,
                        health: 190,
                        speed: 80,
                        energyValue: 25,
                        path: 'first'
                    },
                ];
            case 9:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 20,
                        delay: 500,
                        health: 180,
                        speed: 90,
                        energyValue: 20,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 18,
                        delay: 1000,
                        health: 145,
                        speed: 100,
                        energyValue: 22,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy3',
                        count: 12,
                        delay: 1400,
                        health: 200,
                        speed: 85,
                        energyValue: 28,
                        path: 'first'
                    },
                ];
            case 10:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 25,
                        delay: 450,
                        health: 200,
                        speed: 95,
                        energyValue: 22,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 20,
                        delay: 900,
                        health: 155,
                        speed: 105,
                        energyValue: 25,
                        path: 'first'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy3',
                        count: 15,
                        delay: 1200,
                        health: 210,
                        speed: 90,
                        energyValue: 30,
                        path: 'first'
                    },
                ];
            default:
                return [];
        }
    }

    nextScene(): LevelNames { // Changed return type to LevelNames
        return LevelNames.Story_TheDormantScars; // Next scene is the story for The Dormant Scars
    }
}
