import { Level } from '../Level.ts';
import Phaser from 'phaser';
import { Manager } from '../Manager.ts';
import { AppColors, phaserColor } from '../../../scripts/Colors.ts';

export class PathsManager extends Manager {
    paths!: { [key: string]: Phaser.Curves.Path };
    pathGraphics!: Phaser.GameObjects.Graphics[];
    startZoneGraphics!: Phaser.GameObjects.Graphics[];
    endZoneGraphics!: Phaser.GameObjects.Graphics[];

    constructor(protected level: Level) {
        super(level);
        this.pathGraphics = [];
        this.startZoneGraphics = [];
        this.endZoneGraphics = [];
    }

    setup(): {
        path: Phaser.GameObjects.Graphics[];
        start: Phaser.GameObjects.Graphics[];
        end: Phaser.GameObjects.Graphics[];
    } {
        this.paths = this.level.definePaths();

        for (const pathsKey in this.paths) {
            const pathGraphic = this.level.add.graphics();
            pathGraphic.lineStyle(1, phaserColor(AppColors.PATH_LINE), 0.5);
            this.paths[pathsKey].draw(pathGraphic);
            this.pathGraphics.push(pathGraphic);

            const startPoint = this.paths[pathsKey].getStartPoint();
            const startZone = this.drawZone(startPoint, AppColors.PATH_START);
            this.startZoneGraphics.push(startZone);

            const endPoint = this.paths[pathsKey].getEndPoint();
            const endZone = this.drawZone(endPoint, AppColors.PATH_END);
            this.endZoneGraphics.push(endZone);
            console.log(`For Curve: ${startPoint.x}, ${startPoint.y} and ${endPoint.x}, ${endPoint.y}`)
        }

        return {
            path: this.pathGraphics,
            start: this.startZoneGraphics,
            end: this.endZoneGraphics,
        };
    }

    private drawZone(point: Phaser.Math.Vector2, color: string): Phaser.GameObjects.Graphics {
        const zoneRadius = 40;
        const graphics = this.level.add.graphics();
        graphics.setDepth(1);

        this.level.tweens.add({
            targets: graphics,
            alpha: { from: 0.3, to: 0.7 },
            duration: 1500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
        });

        graphics.fillStyle(phaserColor(color), 1);
        graphics.fillCircle(point.x, point.y, zoneRadius);
        graphics.lineStyle(0.5, phaserColor(color), 1);
        graphics.strokeCircle(point.x, point.y, zoneRadius);

        return graphics;
    }

    destroy(): void {
        this.pathGraphics.forEach(g => g.destroy());
        this.startZoneGraphics.forEach(g => g.destroy());
        this.endZoneGraphics.forEach(g => g.destroy());
        this.paths = {};
        this.pathGraphics = [];
        this.startZoneGraphics = [];
        this.endZoneGraphics = [];
    }
}
