import {Level} from "../Level.ts";
import Phaser from "phaser";
import {Manager} from "../Manager.ts";

export class PathsManager extends Manager {
    paths!: { [key: string]: Phaser.Curves.Path };
    protected pathGraphics!: Phaser.GameObjects.Graphics;

    constructor(protected level: Level) {
        super(level);
    }

    setup() {
        this.paths = this.level.definePaths();
        this.pathGraphics = this.level.add.graphics();
        for (let pathsKey in this.paths) {
            this.pathGraphics.lineStyle(0.5, 0xcccccc, 0.30);
            this.paths[pathsKey].draw(this.pathGraphics);

            // Draw start and end points
            const startPoint = this.paths[pathsKey].getStartPoint();
            const depth = this.pathGraphics.depth;
            this.pathGraphics.setDepth(105)
            this.pathGraphics.fillStyle(0x0000ff, 1); // Blue for start
            this.pathGraphics.fillCircle(startPoint.x, startPoint.y, 30);
            const endPoint = this.paths[pathsKey].getEndPoint();
            this.pathGraphics.fillStyle(0x00ff00, 1); // Green for end
            this.pathGraphics.fillCircle(endPoint.x, endPoint.y, 30);
            this.pathGraphics.setDepth(depth);
        }
    }
}