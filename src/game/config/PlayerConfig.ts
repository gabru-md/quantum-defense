import { AppColors, phaserColor } from '../scripts/Colors.ts';

export interface PlayerConfigType {
    texture: string;
    speed: number;
    resonanceWave: {
        cooldownTime: number;
        activationRange: number;
        waveDamage: number;
        baseActivationEnergy: number; // Renamed: Cost to activate the wave
        pulseColor: number;
        pulseDelay: number;
        pulseDuration: number;
        pulseTotalPulses: number;
        pulseLineWidth: number;
    };
}

export const PlayerConfig: PlayerConfigType = {
    texture: 'player',
    speed: 100, // Assuming a default player speed
    resonanceWave: {
        cooldownTime: 1000, // 1 second cooldown
        activationRange: 75, // Range to be near a tower to revive it or damage special enemies
        waveDamage: 50, // Damage dealt by the wave to special enemies
        baseActivationEnergy: 20, // Example cost, adjust as needed
        pulseColor: phaserColor(AppColors.PLAYER_WAVE_PULSE),
        pulseDelay: 200,
        pulseDuration: 2000,
        pulseTotalPulses: 5,
        pulseLineWidth: 0.025,
    },
};
