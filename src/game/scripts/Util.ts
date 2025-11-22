// Define game area and HUD area dimensions
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const GAME_WIDTH = WIDTH - 400;
export const GAME_HEIGHT = HEIGHT; // Full height of the game

export const EXIT_TO_MENU = true;

export const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const TOWER_UPGRADE_QUANTUM_ECHO_REQUIREMENT= 5;