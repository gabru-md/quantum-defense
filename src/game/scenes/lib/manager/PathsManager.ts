import { Level } from '../Level.ts';
import Phaser from 'phaser';
import { Manager } from '../Manager.ts';
import { AppColors, phaserColor } from '../../../scripts/Colors.ts';

export class PathsManager extends Manager {
    paths!: { [key: string]: Phaser.Curves.Path };
    protected pathGraphics!: Phaser.GameObjects.Graphics;

    constructor(protected level: Level) {
        super(level);
    }

    setup(): {
        path: Phaser.GameObjects.Graphics;
        start: Phaser.GameObjects.GameObject[];
        end: Phaser.GameObjects.GameObject[];
    } {
        this.paths = this.level.definePaths();
        this.pathGraphics = this.level.add.graphics();
        const startZoneElements: Phaser.GameObjects.GameObject[] = [];
        const endZoneElements: Phaser.GameObjects.GameObject[] = [];

        for (const pathsKey in this.paths) {
            this.pathGraphics.lineStyle(1, phaserColor(AppColors.PATH_LINE), 0.5);
            this.paths[pathsKey].draw(this.pathGraphics);

            // Draw start and end points
            const startPoint = this.paths[pathsKey].getStartPoint();
            startZoneElements.push(...this.drawZone(startPoint, AppColors.PATH_START));

            const endPoint = this.paths[pathsKey].getEndPoint();
            endZoneElements.push(...this.drawZone(endPoint, AppColors.PATH_END));
        }

        return {
            path: this.pathGraphics,
            start: startZoneElements,
            end: endZoneElements,
        };
    }

    private drawZone(point: Phaser.Math.Vector2, color: string): Phaser.GameObjects.GameObject[] {
        const zoneRadius = 40;
        const graphics = this.level.add.graphics();
        graphics.setDepth(1); // Ensure it's behind enemies but above the path line

        // Pulsing glow effect
        this.level.tweens.add({
            targets: graphics,
            alpha: { from: 0.3, to: 0.7 },
            duration: 1500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
        });

        // Draw the zone
        graphics.fillStyle(phaserColor(color), 1);
        graphics.fillCircle(point.x, point.y, zoneRadius);
        graphics.lineStyle(0.5, phaserColor(color), 1);
        graphics.strokeCircle(point.x, point.y, zoneRadius);

        return [graphics];
    }

    destroy(): void {
        if (this.pathGraphics) {
            this.pathGraphics.destroy();
        }
        this.paths = {};
    }
}
