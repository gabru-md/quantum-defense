import Phaser from 'phaser';

// Utility function to convert string colors to Phaser's internal number format
export function phaserColor(color: string | number): number {
    if (typeof color === 'string') {
        return Phaser.Display.Color.ValueToColor(color).color;
    }
    return color;
}

export const AppColors = {
    // UI Theme
    UI_PRIMARY_BG: '#1a2a3a',
    UI_SECONDARY_BG: '#2a3a4a',
    UI_ACCENT: '#00ff99',
    UI_TEXT: '#ffffff',
    UI_MESSAGE_INFO: '#ffffff',
    UI_DISABLED: '#555555',
    UI_MESSAGE_ERROR: '#ff0000',
    UI_MESSAGE_WARN: '#ffff00',
    UI_MESSAGE_SUCCESS: '#00ff00',
    UI_MESSAGE_BACKGROUND: 'rgba(0,0,0,0.40)',
    UI_SEPARATOR: '#ffffff',

    // Game Background
    GAME_BACKGROUND: '#2d2d2d',

    // Path Colors
    PATH_LINE: '#888888',
    PATH_START: '#8A2BE2', // Blue-Violet for Static
    PATH_END: '#017878', // Inner rings are white/bright

    // Enemy Colors
    ENEMY_NORMAL: '#3498db', // Blue (Square)
    ENEMY_FAST: '#e74c3c', // Red (Triangle)
    ENEMY_TANK: '#f1c40f', // Yellow (Hexagon)

    // Tower Colors
    TOWER_LASER: '#2ecc71',
    TOWER_BOMB: '#9b59b6',
    TOWER_SLOW: '#e67e22',

    // Projectile Colors
    BULLET_LASER: '#2ecc71',
    BULLET_BOMB: '#9b59b6',

    // --- Revised Palette ---

    // Guardian & Nexus (Order)
    PLAYER: '#00FFFF', // Electric Blue for Guardian
    NEXUS_OUTER: '#00FFFF', // Outer color matches player
    NEXUS_INNER: '#017878', // Inner rings are white/bright

    // Static & Phantom (Corruption)
    STATIC_OUTER: '#8A2BE2', // Blue-Violet for Static
    STATIC_INNER: '#4B0082', // Indigo for inner rings
    SPECIAL_ENEMY: '#8A2BE2', // Phantom now uses the Static's primary color
    SPECIAL_ENEMY_WAVE_PULSE: 'rgba(225,225,225,0.5)', // Phantom now uses the Static's primary color

    // Player Wave Pulse
    PLAYER_WAVE_PULSE: 'rgba(0,255,255,0.8)',

    // Visual Pulse Colors
    PULSE_LASER_TOWER: 'rgba(46,204,113,0.7)',
    PULSE_BOMB_TOWER: 'rgba(155,89,182,0.7)',
};
