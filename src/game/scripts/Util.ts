import Phaser from "phaser";

// Define game area and HUD area dimensions
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const GAME_WIDTH = WIDTH - 400;
export const GAME_HEIGHT = HEIGHT; // Full height of the game
export const TOWER1_COST = 100;
export const TOWER2_COST = 250;
export const TOWER1_RANGE = 100;
export const TOWER2_RANGE = 150;

export function phaserColor(color: string): number {
    return Phaser.Display.Color.ValueToColor(color).color;
}