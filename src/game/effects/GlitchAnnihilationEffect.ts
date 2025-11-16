import * as Phaser from 'phaser';
import { AppColors, phaserColor } from '../scripts/Colors.ts';
import { GAME_HEIGHT, GAME_WIDTH } from '../scripts/Util.ts';

export type RiftOptions = {
    x?: number;
    y?: number;
    scale?: number;
    outcome?: 'player' | 'enemy' | 'both';
    rotation?: number;
}

export type RiftElements = {
    core: Phaser.GameObjects.Arc;
    innerGlow: Phaser.GameObjects.Arc;
    outerGlow: Phaser.GameObjects.Arc;
    rays: Phaser.GameObjects.Line[];
    fragments: Phaser.GameObjects.Rectangle[];
    centerX: number;
    centerY: number;
    scaleFactor: number;
};

export class GlitchAnnihilationEffect {
    private scene: Phaser.Scene;
    private interferenceTimer!: Phaser.Time.TimerEvent;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public start(): void {
        this.interferenceTimer = this.scene.time.addEvent({
            delay: Phaser.Math.Between(3000, 8000),
            callback: () => this.createDistantRift(),
            callbackScope: this,
            loop: true,
        });
    }

    public stop(): void {
        if (this.interferenceTimer) {
            this.interferenceTimer.destroy();
        }
    }

    /**
     * Creates a "distant rift" effect, which is a visual anomaly composed of a core, glows, rays, and fragments.
     * The rift's appearance (colors, size, position) can be customized via the `options` parameter.
     */
    public createDistantRift(options: RiftOptions = {}): void {
        let { outcome, x, y, scale, rotation } = options;

        if (!outcome) {
            const rand = Phaser.Math.Between(0, 2);
            outcome = rand === 0 ? 'player' : rand === 1 ? 'enemy' : 'both';
        }

        const centerX = x ?? Phaser.Math.Between(GAME_WIDTH * 0.15, GAME_WIDTH * 0.85);
        const centerY = y ?? Phaser.Math.Between(GAME_HEIGHT * 0.15, GAME_HEIGHT * 0.85);
        const scaleFactor = scale ?? Phaser.Math.FloatBetween(0.7, 1.3);
        const rotationAngle = rotation ?? Phaser.Math.FloatBetween(0, Math.PI * 2);
        const alphaFactor = 0.3;

        const playerColor = phaserColor(AppColors.PLAYER);
        const enemyColor = phaserColor(AppColors.SPECIAL_ENEMY);
        let primaryColor: number;
        let secondaryColor: number | null = null;

        if (outcome === 'player') {
            primaryColor = playerColor;
        } else if (outcome === 'enemy') {
            primaryColor = enemyColor;
        } else {
            primaryColor = playerColor;
            secondaryColor = enemyColor;
        }

        const riftElements = this.drawRiftElements(centerX, centerY, scaleFactor, alphaFactor, primaryColor, secondaryColor, rotationAngle);
        this.animateRiftElements(riftElements);
    }

    /**
     * Draws the visual components of a rift at a given position and scale.
     * @param centerX The x-coordinate of the rift's center.
     * @param centerY The y-coordinate of the rift's center.
     * @param scaleFactor The overall scale multiplier for the rift elements.
     * @param alphaFactor The base alpha transparency for the rift elements.
     * @param primaryColor The primary color of the rift.
     * @param secondaryColor An optional secondary color for the rift, used for alternating elements.
     * @param rotation The rotation of the rift in radians.
     * @returns An object containing the created Phaser GameObjects for the rift.
     */
    drawRiftElements(
        centerX: number,
        centerY: number,
        scaleFactor: number,
        alphaFactor: number,
        primaryColor: number,
        secondaryColor: number | null,
        rotation: number
    ): RiftElements {
        const coreSize = Phaser.Math.FloatBetween(1.5, 3) * scaleFactor;
        const numRays = Phaser.Math.Between(8, 16);
        const numFragments = Phaser.Math.Between(6, 12);
        const rayLengthMin = Phaser.Math.Between(25, 40) * scaleFactor;
        const rayLengthMax = Phaser.Math.Between(60, 100) * scaleFactor;

        // Core
        const core = this.scene.add.circle(centerX, centerY, coreSize, 0xFFFFFF, Phaser.Math.FloatBetween(0.9, 1) * alphaFactor).setDepth(-1);

        // Glows
        const innerGlow = this.scene.add.circle(centerX, centerY, Phaser.Math.FloatBetween(4, 7) * scaleFactor, primaryColor, Phaser.Math.FloatBetween(0.7, 0.9) * alphaFactor).setDepth(-1).setBlendMode(Phaser.BlendModes.ADD);
        const outerGlow = this.scene.add.circle(centerX, centerY, Phaser.Math.FloatBetween(7, 12) * scaleFactor, secondaryColor ?? primaryColor, Phaser.Math.FloatBetween(0.3, 0.5) * alphaFactor).setDepth(-1).setBlendMode(Phaser.BlendModes.ADD);

        // Rays
        const rays: Phaser.GameObjects.Line[] = [];
        for (let i = 0; i < numRays; i++) {
            const angle = rotation + (Math.PI * 2 * i) / numRays + Phaser.Math.FloatBetween(-0.1, 0.1);
            const rayLength = Phaser.Math.Between(rayLengthMin, rayLengthMax);
            const endX = centerX + Math.cos(angle) * rayLength;
            const endY = centerY + Math.sin(angle) * rayLength;
            const rayColor = (secondaryColor !== null && i % 2 === 0) ? secondaryColor : primaryColor;
            const ray = this.scene.add.line(0, 0, centerX, centerY, endX, endY, rayColor, Phaser.Math.FloatBetween(0.5, 0.8) * alphaFactor).setDepth(-1).setLineWidth(Phaser.Math.FloatBetween(0.8, 1.5)).setBlendMode(Phaser.BlendModes.ADD);
            rays.push(ray);
        }

        // Fragments
        const fragments: Phaser.GameObjects.Rectangle[] = [];
        for (let i = 0; i < numFragments; i++) {
            const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
            const distance = Phaser.Math.FloatBetween(12, 45) * scaleFactor;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            const fragmentColor = (secondaryColor !== null && Phaser.Math.Between(0, 1) === 0) ? secondaryColor : primaryColor;
            const fragment = this.scene.add.rectangle(x, y, Phaser.Math.Between(1, 5) * scaleFactor, Phaser.Math.Between(1, 5) * scaleFactor, fragmentColor, Phaser.Math.FloatBetween(0.4, 0.9) * alphaFactor).setDepth(-1).setBlendMode(Phaser.BlendModes.ADD);
            fragments.push(fragment);
        }

        return { core, innerGlow, outerGlow, rays, fragments, centerX, centerY, scaleFactor };
    }

    /**
     * Animates the given rift elements, making them expand, fade out, and eventually destroy themselves.
     * @param elements The object containing the Phaser GameObjects of the rift to animate.
     */
    private animateRiftElements(elements: RiftElements): void {
        const { core, innerGlow, outerGlow, rays, fragments, centerX, centerY, scaleFactor } = elements;
        const duration = Phaser.Math.Between(2500, 4000);

        // Animate core and glows
        this.scene.tweens.add({ targets: core, radius: Phaser.Math.FloatBetween(6, 12) * scaleFactor, alpha: 0, duration: duration, ease: 'Cubic.easeOut', onComplete: () => core.destroy() });
        this.scene.tweens.add({ targets: innerGlow, radius: Phaser.Math.FloatBetween(20, 35) * scaleFactor, alpha: 0, duration: duration, ease: 'Cubic.easeOut', onComplete: () => innerGlow.destroy() });
        this.scene.tweens.add({ targets: outerGlow, radius: Phaser.Math.FloatBetween(45, 70) * scaleFactor, alpha: 0, duration: duration * Phaser.Math.FloatBetween(1.1, 1.3), ease: 'Cubic.easeOut', onComplete: () => outerGlow.destroy() });

        // Animate rays
        rays.forEach((ray, index) => {
            // Calculate angle based on its original end position relative to the center
            // @ts-ignore
            const originalAngle = Math.atan2(ray.y2 - centerY, ray.x2 - centerX);
            const angle = originalAngle + Phaser.Math.FloatBetween(-0.1, 0.1); // Add a slight random deviation

            const finalLength = Phaser.Math.Between(70, 180) * scaleFactor;
            const finalX = centerX + Math.cos(angle) * finalLength;
            const finalY = centerY + Math.sin(angle) * finalLength;
            this.scene.tweens.add({ targets: ray, x2: finalX, y2: finalY, alpha: 0, duration: duration * Phaser.Math.FloatBetween(0.7, 0.9), ease: Phaser.Math.RND.pick(['Sine.easeOut', 'Cubic.easeOut', 'Quad.easeOut']), delay: index * Phaser.Math.Between(20, 50), onComplete: () => ray.destroy() });
        });

        // Animate fragments
        fragments.forEach((fragment, index) => {
            const currentAngle = Math.atan2(fragment.y - centerY, fragment.x - centerX);
            const scatterDistance = Phaser.Math.Between(50, 150) * scaleFactor;
            const targetX = centerX + Math.cos(currentAngle) * scatterDistance;
            const targetY = centerY + Math.sin(currentAngle) * scatterDistance;
            this.scene.tweens.add({ targets: fragment, x: targetX, y: targetY, alpha: 0, angle: Phaser.Math.Between(-180, 180), duration: duration * Phaser.Math.FloatBetween(0.9, 1.1), ease: 'Cubic.easeOut', delay: index * Phaser.Math.Between(30, 60), onComplete: () => fragment.destroy() });
        });
    }

    /**
     * Applies a subtle, continuous animation to a rift to make it feel alive.
     * This is intended for persistent rifts in a level.
     * @param elements The object containing the Phaser GameObjects of the rift to animate.
     */
    public animateRiftIdle(elements: RiftElements): void {
        const { innerGlow, outerGlow, rays, fragments, core } = elements;

        // Animate glows for a pulsing effect
        this.scene.tweens.add({
            targets: [innerGlow, outerGlow],
            alpha: 0.15,
            duration: Phaser.Math.Between(1500, 2500),
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // animate core movement
        this.scene.tweens.add({
           targets: [core],
            x: core.x + Phaser.Math.FloatBetween(-5, 5),
            y: core.y + Phaser.Math.FloatBetween(-5, 5),
            duration: Phaser.Math.Between(1000, 2000),
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Animate rays to flicker
        rays.forEach((ray, i) => {
            this.scene.tweens.add({
                targets: ray,
                alpha: Phaser.Math.FloatBetween(0.5, 1.4),
                x: ray.x + Phaser.Math.FloatBetween(-5, 5),
                y: ray.y + Phaser.Math.FloatBetween(-5, 5),
                duration: Phaser.Math.Between(1000, 2000),
                yoyo: true,
                repeat: -1,
                delay: i * 50,
                ease: 'Sine.easeInOut'
            });
        });

        // Animate fragments to wiggle and rotate
        fragments.forEach(fragment => {
            this.scene.tweens.add({
                targets: fragment,
                x: fragment.x + Phaser.Math.FloatBetween(-1, 1),
                y: fragment.y + Phaser.Math.FloatBetween(-1, 1),
                angle: Phaser.Math.Between(-30, 30),
                duration: Phaser.Math.Between(500, 1000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }
}
