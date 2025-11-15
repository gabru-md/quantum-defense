import { AppColors, phaserColor } from '../scripts/Colors.ts';

export interface WaveEffectConfig {
    totalPulses: number;
    pulseDelay: number; // Delay between individual pulses in a sequence
    duration: number; // Duration of a single pulse animation
    lineWidth: number;
    color: number; // Default color, can be overridden
    targetRadius: number; // The final radius the pulse should reach
}

export const DefaultWaveConfig: Omit<WaveEffectConfig, 'targetRadius' | 'color'> = {
    totalPulses: 3,
    pulseDelay: 150,
    duration: 1000,
    lineWidth: 1,
};

export function getResonanceWaveConfig(targetRadius: number, customColor?: number): WaveEffectConfig {
    return {
        ...DefaultWaveConfig,
        totalPulses: 4, // Resonance wave might have more pulses
        duration: 1200, // Slightly longer duration for player
        color: customColor || phaserColor(AppColors.PLAYER_WAVE_PULSE),
        targetRadius: targetRadius,
    };
}

export function getDeactivationWaveConfig(targetRadius: number): WaveEffectConfig {
    return {
        ...DefaultWaveConfig,
        totalPulses: 2, // Fewer pulses for deactivation to differentiate
        duration: 800, // Shorter duration for enemy
        color: phaserColor(AppColors.ENEMY_SPECIAL_IDLE),
        targetRadius: targetRadius,
    };
}
