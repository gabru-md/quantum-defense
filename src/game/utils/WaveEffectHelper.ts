import * as Phaser from 'phaser';
import { WaveEffectConfig } from '../config/WaveConfig.ts';

export function createWaveEffect(
    scene: Phaser.Scene,
    x: number,
    y: number,
    gameObjectWidth: number,
    config: WaveEffectConfig
): void {
    const { totalPulses, pulseDelay, duration, lineWidth, color, targetRadius } = config;
    const initialRadius = gameObjectWidth / 2;

    for (let i = 0; i < totalPulses; i++) {
        scene.time.delayedCall(i * pulseDelay, () => {
            const graphics = scene.add.graphics({
                fillStyle: { color: color, alpha: 0.3 },
                lineStyle: { width: lineWidth, color: color, alpha: 0.8 },
            });

            graphics.setDepth(10); // Adjust depth as needed
            graphics.x = x;
            graphics.y = y;

            scene.tweens.add({
                targets: graphics,
                scale: targetRadius / initialRadius, // Scale the graphics object to reach the target radius
                alpha: 0,
                duration: duration,
                ease: 'Sine.easeOut',
                onUpdate: (_tween, target) => {
                    graphics.clear();
                    graphics.lineStyle(lineWidth, color, target.alpha * 0.8);
                    graphics.fillStyle(color, target.alpha * 0.3);
                    // Draw a circle with the initial radius in the graphics object's local space
                    graphics.fillCircle(0, 0, initialRadius);
                    graphics.strokeCircle(0, 0, initialRadius);
                },
                onComplete: () => {
                    graphics.destroy();
                },
            });
        });
    }
}
