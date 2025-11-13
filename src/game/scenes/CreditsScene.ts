import * as Phaser from 'phaser';
import { AppColors, phaserColor } from '../scripts/Colors';
import { GAME_HEIGHT, WIDTH } from '../scripts/Util';

export class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CreditsScene' });
    }

    preload(): void {
        // Preload textures for animated elements
        this.load.image('enemy1_menu', this.createEnemyTexture('enemy1_menu', 32, AppColors.ENEMY_NORMAL));
        this.load.image('enemy2_menu', this.createEnemyTexture('enemy2_menu', 32, AppColors.ENEMY_FAST));
        this.load.image('enemy3_menu', this.createEnemyTexture('enemy3_menu', 32, AppColors.ENEMY_TANK));
        this.load.image(
            'special_enemy_menu',
            this.createEnemyTexture('special_enemy_menu', 32, AppColors.SPECIAL_ENEMY)
        );
        this.load.image('tower1_menu', this.createTowerTexture('tower1_menu', 32, AppColors.TOWER_LASER));
        this.load.image('tower2_menu', this.createTowerTexture('tower2_menu', 32, AppColors.TOWER_BOMB));
        this.load.image('tower3_menu', this.createTowerTexture('tower3_menu', 32, AppColors.TOWER_SLOW));
        this.load.image('player_menu', this.createPlayerTexture('player_menu', 24, AppColors.PLAYER));
    }

    create(): void {
        this.createAnimatedGridBackground();
        this.createVisualElements();
        this.cameras.main.setBackgroundColor(AppColors.GAME_BACKGROUND);

        // --- Full-screen Stroke Panel ---
        this.add
            .graphics()
            .lineStyle(5, phaserColor(AppColors.UI_SEPARATOR), 1)
            .strokeRect(0, 0, WIDTH, GAME_HEIGHT)
            .setDepth(0);

        // --- Credits Title ---
        this.add
            .text(WIDTH / 2, 100, 'CREDITS', {
                font: '64px',
                color: AppColors.UI_ACCENT,
                align: 'center',
            })
            .setOrigin(0.5);
        this.add
            .graphics()
            .lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1)
            .beginPath()
            .moveTo(0, 150)
            .lineTo(WIDTH, 150)
            .closePath()
            .stroke();

        // --- Credits Panel ---
        const panelWidth = 800;
        const panelHeight = 500;
        const panelX = WIDTH / 2;
        const panelY = GAME_HEIGHT / 2;

        const panelGraphics = this.add.graphics();
        panelGraphics.fillRect(panelX - panelWidth / 2, panelY - panelHeight / 2, panelWidth, panelHeight);
        panelGraphics.lineStyle(2, phaserColor(AppColors.UI_ACCENT), 1);
        panelGraphics.strokeRect(panelX - panelWidth / 2, panelY - panelHeight / 2, panelWidth, panelHeight);

        const creditsText = 'Game Design & Development:\nManish Devgan\n\n' + 'https://github.com/gabru-md';

        this.add
            .text(panelX, panelY - panelHeight / 2 + 200, creditsText, {
                font: '32px',
                color: AppColors.UI_TEXT,
                align: 'center',
                lineSpacing: 15,
                wordWrap: { width: panelWidth - 40 },
            })
            .setOrigin(0.5);

        // --- Back Button ---
        this.createButton(WIDTH / 2, GAME_HEIGHT - 100, 'BACK TO MENU', () => {
            this.scene.start('MenuScene');
        });
    }

    private createButton(x: number, y: number, text: string, callback: () => void): Phaser.GameObjects.Text {
        const button = this.add
            .text(x, y, text, {
                font: '36px',
                color: AppColors.UI_TEXT,
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive();

        button.on('pointerover', () => button.setColor(AppColors.UI_ACCENT));
        button.on('pointerout', () => button.setColor(AppColors.UI_TEXT));
        button.on('pointerdown', callback);
        return button;
    }

    private createVisualElements() {
        // --- Animated Game Elements ---
        const gameAreaLeft = 0;
        const gameAreaRight = WIDTH;
        const gameAreaTop = 0;
        const gameAreaBottom = GAME_HEIGHT;

        for (let i = 0; i < 2; i++) {
            // Randomize coordinates for enemies
            this.addAnimatedElement(
                'enemy1_menu',
                Phaser.Math.Between(gameAreaLeft + 50, gameAreaRight - 50),
                Phaser.Math.Between(gameAreaTop + 200, gameAreaBottom - 100),
                0.8,
                2000
            );
            this.addAnimatedElement(
                'enemy2_menu',
                Phaser.Math.Between(gameAreaLeft + 50, gameAreaRight - 50),
                Phaser.Math.Between(gameAreaTop + 200, gameAreaBottom - 100),
                0.7,
                1800
            );
            this.addAnimatedElement(
                'enemy3_menu',
                Phaser.Math.Between(gameAreaLeft + 50, gameAreaRight - 50),
                Phaser.Math.Between(gameAreaTop + 200, gameAreaBottom - 100),
                0.9,
                2200
            );
            this.addAnimatedElement(
                'special_enemy_menu',
                Phaser.Math.Between(gameAreaLeft + 50, gameAreaRight - 50),
                Phaser.Math.Between(gameAreaTop + 200, gameAreaBottom - 100),
                0.85,
                1900
            );
            // Randomize coordinates for towers
            this.addAnimatedElement(
                'tower1_menu',
                Phaser.Math.Between(gameAreaLeft + 50, gameAreaRight - 50),
                Phaser.Math.Between(gameAreaTop + 200, gameAreaBottom - 100),
                0.9,
                1800
            );
            this.addAnimatedElement(
                'tower2_menu',
                Phaser.Math.Between(gameAreaLeft + 50, gameAreaRight - 50),
                Phaser.Math.Between(gameAreaTop + 200, gameAreaBottom - 100),
                0.8,
                2100
            );
            this.addAnimatedElement(
                'tower3_menu',
                Phaser.Math.Between(gameAreaLeft + 50, gameAreaRight - 50),
                Phaser.Math.Between(gameAreaTop + 200, gameAreaBottom - 100),
                0.75,
                1700
            );
            // Player
            this.addAnimatedElement(
                'player_menu',
                Phaser.Math.Between(gameAreaLeft + 50, gameAreaRight - 50),
                Phaser.Math.Between(gameAreaTop + 200, gameAreaBottom - 100),
                0.7,
                2200
            );
        }
    }

    private createAnimatedGridBackground(): void {
        const gridGraphics = this.add.graphics({
            lineStyle: {
                width: 1,
                color: phaserColor(AppColors.UI_SEPARATOR),
                alpha: 0.1,
            },
        });
        const gridSize = 5;

        for (let x = 0; x < WIDTH; x += gridSize) {
            gridGraphics.lineBetween(x, 0, x, GAME_HEIGHT);
        }
        for (let y = 0; y < GAME_HEIGHT; y += gridSize) {
            gridGraphics.lineBetween(0, y, WIDTH, y);
        }

        // Simple scroll animation
        this.tweens.add({
            targets: gridGraphics,
            x: { from: 0, to: -gridSize },
            y: { from: 0, to: -gridSize },
            duration: 5000,
            ease: 'Linear',
            repeat: -1,
            yoyo: true,
        });
    }

    // Helper functions to create textures for menu elements
    private createEnemyTexture(key: string, size: number, color: string): string {
        const graphics = this.make.graphics({ x: 0, y: 0 });
        graphics.fillStyle(phaserColor(color));
        graphics.fillRect(0, 0, size, size); // Simple square for menu preview
        graphics.generateTexture(key, size, size);
        graphics.destroy();
        return key;
    }

    private createTowerTexture(key: string, size: number, color: string): string {
        const graphics = this.make.graphics({ x: 0, y: 0 });
        graphics.fillStyle(phaserColor(color));
        graphics.fillCircle(size / 2, size / 2, size / 2);
        graphics.fillStyle(phaserColor('0x000000'), 0.5);
        graphics.fillCircle(size / 2, size / 2, size / 4);
        graphics.generateTexture(key, size, size);
        graphics.destroy();
        return key;
    }

    private createPlayerTexture(key: string, size: number, color: string): string {
        const graphics = this.make.graphics({ x: 0, y: 0 });
        graphics.fillStyle(phaserColor(color));
        graphics.fillCircle(size / 2, size / 2, size / 2);
        graphics.generateTexture(key, size, size);
        graphics.destroy();
        return key;
    }

    private addAnimatedElement(key: string, x: number, y: number, scale: number, duration: number): void {
        const randomOffsetX = Phaser.Math.Between(-20, 20);
        const randomOffsetY = Phaser.Math.Between(-20, 20);

        const targetX = x + randomOffsetX;
        const targetY = y + randomOffsetY;

        const element = this.add.image(x, y, key).setScale(scale).setAlpha(0.7).setDepth(-1);

        // 4. Create the Tween
        this.tweens.add({
            targets: element,
            x: targetX,
            y: targetY,
            duration: duration,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
        });
    }
}
