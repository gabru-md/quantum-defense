import {Level} from '../Level.ts';
import Phaser from 'phaser';
import {Manager} from '../Manager.ts';
import {AppColors, phaserColor} from '../../../scripts/Colors.ts';

export class PathsManager extends Manager {
    paths!: { [key: string]: Phaser.Curves.Path };
    pathGraphics!: { [key: string]: Phaser.GameObjects.Graphics };
    startZoneGraphics!: { [key: string]: Phaser.GameObjects.Graphics }; // Changed to a dictionary
    endZoneGraphics!: { [key: string]: Phaser.GameObjects.Graphics };   // Changed to a dictionary

    constructor(protected level: Level) {
        super(level);
        this.pathGraphics = {};
        this.startZoneGraphics = {};
        this.endZoneGraphics = {};
    }

    setup(): {
        path: Phaser.GameObjects.Graphics[];
        start: Phaser.GameObjects.Graphics[];
        end: Phaser.GameObjects.Graphics[];
    } {
        this.paths = this.level.definePaths();
        this.pathGraphics = {};
        this.startZoneGraphics = {};
        this.endZoneGraphics = {};

        if (!this.paths) return ({
            path: [],
            start: [],
            end: [],
        });

        for (const pathsKey in this.paths) {
            const pathGraphic = this.level.add.graphics();
            pathGraphic.lineStyle(1, phaserColor(AppColors.PATH_LINE), 0.5);
            this.paths[pathsKey].draw(pathGraphic);
            this.pathGraphics[pathsKey] = pathGraphic;

            const startPoint = this.paths[pathsKey].getStartPoint();
            const startZone = this.drawZone(startPoint, AppColors.PATH_START);
            this.startZoneGraphics[pathsKey] = startZone; // Store by key

            const endPoint = this.paths[pathsKey].getEndPoint();
            const endZone = this.drawZone(endPoint, AppColors.PATH_END);
            this.endZoneGraphics[pathsKey] = endZone; // Store by key
        }

        return {
            path: Object.values(this.pathGraphics),
            start: Object.values(this.startZoneGraphics),
            end: Object.values(this.endZoneGraphics),
        };
    }

    public getPathGraphics(name: string): Phaser.GameObjects.Graphics {
        if (!this.pathGraphics[name]) {
            console.error(`PathsManager: No path graphics found for name "${name}"`);
        }
        return this.pathGraphics[name];
    }

    showPath(show: boolean): void {
        Object.values(this.pathGraphics).forEach(g => g.setVisible(show));
    }

    showStart(show: boolean): void {
        Object.values(this.startZoneGraphics).forEach(g => g.setVisible(show));
    }

    showEnd(show: boolean): void {
        Object.values(this.endZoneGraphics).forEach(g => g.setVisible(show));
    }

    private drawZone(point: Phaser.Math.Vector2, color: string): Phaser.GameObjects.Graphics {
        const zoneRadius = 40;
        const graphics = this.level.add.graphics();
        graphics.setDepth(1);

        this.level.tweens.add({
            targets: graphics,
            alpha: {from: 0.3, to: 0.7},
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

    hideAllElements(): void {
        Object.values(this.pathGraphics).forEach(g => g.setVisible(false));
        Object.values(this.startZoneGraphics).forEach(g => g.setVisible(false));
        Object.values(this.endZoneGraphics).forEach(g => g.setVisible(false));
    }

    destroy(): void {
        Object.values(this.pathGraphics).forEach(g => g.destroy());
        Object.values(this.startZoneGraphics).forEach(g => g.destroy());
        Object.values(this.endZoneGraphics).forEach(g => g.destroy());
        this.paths = {};
        this.pathGraphics = {};
        this.startZoneGraphics = {};
        this.endZoneGraphics = {};
    }
}
