import Phaser from "phaser";

// Utility function to convert string colors to Phaser's internal number format
export function phaserColor(color: string | number): number {
    if (typeof color === 'string') {
        return Phaser.Display.Color.ValueToColor(color).color;
    }
    return color;
}

export const AppColors = {
    // UI Theme
    UI_PRIMARY_BG: '#1a2a3a', // Dark blue-grey
    UI_SECONDARY_BG: '#2a3a4a', // Slightly lighter blue-grey
    UI_ACCENT: '#00ff99', // Bright green
    UI_TEXT: '#ffffff', // White
    UI_DISABLED: '#555555', // Grey for disabled elements
    UI_MESSAGE_ERROR: '#ff0000', // Red for error messages
    UI_MESSAGE_WARN: '#ffff00', // Yellow for warning messages
    UI_MESSAGE_SUCCESS: '#00ff00', // Green for success messages
    UI_MESSAGE_BACKGROUND: 'rgba(0,0,0,0.40)', // Semi-transparent black
    UI_SEPARATOR: '#ffffff', // White separator lines

    // Game Background
    GAME_BACKGROUND: '#2d2d2d', // Dark grey

    // Path Colors
    PATH_LINE: '#888888', // Medium grey
    PATH_START: '#3498db', // Blue (matching ENEMY_NORMAL for consistency)
    PATH_END: '#2ecc71', // Green (matching TOWER_LASER for consistency)

    // Enemy Colors
    ENEMY_NORMAL: '#3498db', // Blue (Square)
    ENEMY_FAST: '#e74c3c', // Red (Triangle)
    ENEMY_TANK: '#f1c40f', // Yellow (Hexagon)
    SPECIAL_ENEMY: '#27ae60', // Dark Green (Special Enemy) - Renamed from HEALER

    // Tower Colors
    TOWER_LASER: '#2ecc71', // Green (Laser Tower)
    TOWER_BOMB: '#9b59b6', // Purple (Bomb Tower)
    TOWER_SLOW: '#e67e22', // Orange (Slow Tower)

    // Projectile Colors
    BULLET_LASER: '#2ecc71', // Green (Laser Bullet)
    BULLET_BOMB: '#9b59b6', // Orange (Bomb)

    // Player Colors
    PLAYER: '#16ddb3', // Teal (Player)
    PLAYER_WAVE_PULSE: 'rgba(4,138,73,0.8)', // Greenish pulse
    PLAYER_WAVE_PULSE_DAMAGE: 'rgb(250,250,250)', // White

    // Visual Pulse Colors (for towers)
    PULSE_LASER_TOWER: 'rgba(46,204,113,0.7)', // Greenish
    PULSE_BOMB_TOWER: 'rgba(155,89,182,0.7)', // Purplish
};
