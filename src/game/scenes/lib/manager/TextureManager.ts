import {phaserColor, AppColors} from "../../../scripts/Colors.ts";
import {Manager} from "../Manager.ts";

export class TextureManager extends Manager {
    constructor(protected level: Phaser.Scene) {
        super(level);
    }

    setup() {
        // --- Enemies ---
        this.createEnemyTexture('enemy1', 32, AppColors.ENEMY_NORMAL);
        this.createEnemyTexture('enemy2', 24, AppColors.ENEMY_FAST);
        this.createEnemyTexture('enemy3', 40, AppColors.ENEMY_TANK);

        // --- Towers ---
        this.createTowerTexture('tower1', 32, AppColors.TOWER_LASER);
        this.createTowerTexture('tower2', 32, AppColors.TOWER_BOMB);
        this.createTowerTexture('tower3', 32, AppColors.TOWER_SLOW); // New Orange Tower

        // --- Projectiles ---
        this.createBulletTexture('bullet', 10, AppColors.BULLET_LASER);
        this.createBombTexture('bomb', 16, AppColors.BULLET_BOMB);

        // --- Player & Special Enemy ---
        this.createPlayerTexture('player', 24, AppColors.PLAYER);
        this.createSpecialEnemyTexture('specialEnemy', 24, AppColors.SPECIAL_ENEMY);

        // --- UI & Effects ---
        this.createPlaceholderTexture('towerSlot', 32, 32, AppColors.UI_DISABLED);
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
        graphics.fillStyle(phaserColor('0x000000'), 0.5); // Inner circle black
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

    private createSpecialEnemyTexture(key: string, size: number, color: string): void {
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
