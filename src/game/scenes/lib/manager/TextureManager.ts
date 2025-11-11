import {phaserColor} from "../../../scripts/util.ts";
import {Manager} from "../Manager.ts";

export class TextureManager extends Manager {
    constructor(protected level: Phaser.Scene) {
        super(level);
    }

    setup() {
        this.createPlaceholderTexture('enemy1', 32, 32, '#7777ff');
        this.createPlaceholderTexture('enemy2', 24, 24, '#ff7777');
        this.createPlaceholderTexture('enemy3', 40, 40, '#f4d753');
        this.createPlaceholderCircleTexture('tower1', 32, 32, 'rgba(255,0,132,0.84)');
        this.createPlaceholderCircleTexture('tower2', 32, 32, '#ff00ff');
        this.createPlaceholderCircleTexture('bullet', 10, 10, '#cf0d0d');
        this.createPlaceholderCircleTexture('bomb', 16, 16, '#ff8800');
        this.createPlaceholderTexture('healer', 24, 24, '#048a49');
        this.createPlaceholderCircleTexture('player', 24, 24, '#048a49'); // Green
    }

    protected createPlaceholderTexture(key: string, width: number, height: number, color: string): void {
        const graphics = this.scene.make.graphics({x: width, y: height});
        graphics.fillStyle(phaserColor(color));
        graphics.fillRect(0, 0, width, height);
        graphics.generateTexture(key, width, height);
        graphics.destroy();
    }

    protected createPlaceholderTriangleTexture(key: string, width: number, height: number, color: string): void {
        const graphics = this.scene.make.graphics({x: 0, y: 0});
        graphics.fillStyle(phaserColor(color));

        const p1x = width / 2;
        const p1y = 0;
        const p2x = 0;
        const p2y = height;
        const p3x = width;
        const p3y = height;

        graphics.fillTriangle(p1x, p1y, p2x, p2y, p3x, p3y);
        graphics.generateTexture(key, width, height);
        graphics.destroy();
    }

    protected createPlaceholderCircleTexture(key: string, width: number, height: number, color: string): void {
        const graphics = this.scene.make.graphics({x: 0, y: 0});
        graphics.fillStyle(phaserColor(color));
        graphics.fillCircle(width / 2, height / 2, Math.min(width, height) / 2);
        graphics.generateTexture(key, width, height);
        graphics.destroy();
    }

}