import {Level} from "../Level.ts";
import Phaser from "phaser";
import {Manager} from "../Manager.ts";
import {AppColors, phaserColor} from "../../../scripts/Colors.ts"; // Import AppColors

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
            this.pathGraphics.lineStyle(0.5, phaserColor(AppColors.PATH_LINE), 0.30); // Use color constant
            this.paths[pathsKey].draw(this.pathGraphics);

            // Draw start and end points
            const startPoint = this.paths[pathsKey].getStartPoint();
            this.pathGraphics.setDepth(105); // Set a high depth to be above enemies
            this.pathGraphics.fillStyle(phaserColor(AppColors.PATH_START), 1); // Use color constant
            this.pathGraphics.fillCircle(startPoint.x, startPoint.y, 30);
            const endPoint = this.paths[pathsKey].getEndPoint();
            this.pathGraphics.fillStyle(phaserColor(AppColors.PATH_END), 1); // Use color constant
            this.pathGraphics.fillCircle(endPoint.x, endPoint.y, 30);
        }
    }
}
