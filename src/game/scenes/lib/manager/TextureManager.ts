import {phaserColor} from "../../../scripts/util.ts";
import {Manager} from "../Manager.ts";

export class TextureManager extends Manager {
    constructor(protected level: Phaser.Scene) {
        super(level);
    }

    setup() {
        // --- Enemies ---
        this.createEnemyTexture('enemy1', 32, '#3498db'); // Blue Square
        this.createEnemyTexture('enemy2', 24, '#e74c3c'); // Red Triangle
        this.createEnemyTexture('enemy3', 40, '#f1c40f'); // Yellow Hexagon

        // --- Towers ---
        this.createTowerTexture('tower1', 32, '#2ecc71'); // Green Laser Tower
        this.createTowerTexture('tower2', 32, '#9b59b6'); // Purple Bomb Tower

        // --- Projectiles ---
        this.createBulletTexture('bullet', 10, '#2ecc71'); // Green Laser Bullet
        this.createBombTexture('bomb', 16, '#e67e22'); // Orange Bomb

        // --- Player & Healer ---
        this.createPlayerTexture('player', 24, '#1abc9c'); // Teal Player
        this.createHealerTexture('healer', 24, '#27ae60'); // Dark Green Healer

        // --- UI & Effects ---
        this.createPlaceholderTexture('towerSlot', 32, 32, '#555555');
        this.createRangePreviewTexture('rangePreview', 300, 'rgba(255, 255, 255, 0.05)');
    }

    private createEnemyTexture(key: string, size: number, color: string): void {
        const graphics = this.scene.make.graphics({x: 0, y: 0});
        graphics.fillStyle(phaserColor(color));
        if (key === 'enemy2') { // Triangle
            graphics.fillTriangle(size / 2, 0, 0, size, size, size);
        } else if (key === 'enemy3') { // Hexagon
            graphics.slice(size / 2, size / 2, size / 2, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(360), false, 6).fill();
        } else { // Square
            graphics.fillRect(0, 0, size, size);
        }
        graphics.generateTexture(key, size, size);
        graphics.destroy();
    }

    private createTowerTexture(key: string, size: number, color: string): void {
        const graphics = this.scene.make.graphics({x: 0, y: 0});
        graphics.fillStyle(phaserColor(color));
        graphics.fillCircle(size / 2, size / 2, size / 2);
        graphics.fillStyle(0x000000, 0.5);
        graphics.fillCircle(size / 2, size / 2, size / 4);
        graphics.generateTexture(key, size, size);
        graphics.destroy();
    }

    private createBulletTexture(key: string, size: number, color: string): void {
        const graphics = this.scene.make.graphics({x: 0, y: 0});
        graphics.fillStyle(phaserColor(color));
        graphics.fillCircle(size / 2, size / 2, size / 2);
        graphics.generateTexture(key, size, size);
        graphics.destroy();
    }

    private createBombTexture(key: string, size: number, color: string): void {
        const graphics = this.scene.make.graphics({x: 0, y: 0});
        graphics.fillStyle(phaserColor(color));
        graphics.fillCircle(size / 2, size / 2, size / 2);
        graphics.generateTexture(key, size, size);
        graphics.destroy();
    }

    private createPlayerTexture(key: string, size: number, color: string): void {
        const graphics = this.scene.make.graphics({x: 0, y: 0});
        graphics.fillStyle(phaserColor(color));
        graphics.fillCircle(size / 2, size / 2, size / 2);
        graphics.generateTexture(key, size, size);
        graphics.destroy();
    }

    private createHealerTexture(key: string, size: number, color: string): void {
        const graphics = this.scene.make.graphics({x: 0, y: 0});
        graphics.fillStyle(phaserColor(color));
        graphics.fillRect(0, 0, size, size);
        graphics.generateTexture(key, size, size);
        graphics.destroy();
    }

    private createRangePreviewTexture(key: string, size: number, color: string): void {
        const graphics = this.scene.make.graphics({x: 0, y: 0});
        graphics.fillStyle(phaserColor(color));
        graphics.fillCircle(size / 2, size / 2, size / 2);
        graphics.generateTexture(key, size, size);
        graphics.destroy();
    }

    protected createPlaceholderTexture(key: string, width: number, height: number, color: string): void {
        const graphics = this.scene.make.graphics({x: width, y: height});
        graphics.fillStyle(phaserColor(color));
        graphics.fillRect(0, 0, width, height);
        graphics.generateTexture(key, width, height);
        graphics.destroy();
    }
}
