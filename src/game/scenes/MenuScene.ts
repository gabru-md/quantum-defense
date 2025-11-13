import * as Phaser from 'phaser';
import {AppColors, phaserColor} from '../scripts/Colors';
import {GAME_HEIGHT, WIDTH} from '../scripts/Util';
import {State} from './lib/State';
import {createEnemyTexture, createPlayerTexture, createTowerTexture} from '../scripts/TextureUtils';

export class MenuScene extends Phaser.Scene {
    private gameState!: State;
    private difficultyText!: Phaser.GameObjects.Text;
    private soundText!: Phaser.GameObjects.Text;

    constructor() {
        super({key: 'MenuScene'});
    }

    init(): void {
        this.gameState = new State(100, 350, 'Menu');
        this.sys.registry.set('gameState', this.gameState);
    }

    preload(): void {
        // Preload textures for animated elements
        this.load.image('enemy1_menu', createEnemyTexture(this, 'enemy1_menu', 32, AppColors.ENEMY_NORMAL));
        this.load.image('enemy2_menu', createEnemyTexture(this, 'enemy2_menu', 32, AppColors.ENEMY_FAST));
        this.load.image('enemy3_menu', createEnemyTexture(this, 'enemy3_menu', 32, AppColors.ENEMY_TANK));
        this.load.image('special_enemy_menu', createEnemyTexture(this, 'special_enemy_menu', 32, AppColors.SPECIAL_ENEMY));
        this.load.image('tower1_menu', createTowerTexture(this, 'tower1_menu', 32, AppColors.TOWER_LASER));
        this.load.image('tower2_menu', createTowerTexture(this, 'tower2_menu', 32, AppColors.TOWER_BOMB));
        this.load.image('tower3_menu', createTowerTexture(this, 'tower3_menu', 32, AppColors.TOWER_SLOW));
        this.load.image('player_menu', createPlayerTexture(this, 'player_menu', 32, AppColors.PLAYER));
    }

    create(): void {
        this.cameras.main.setBackgroundColor(AppColors.GAME_BACKGROUND);

        // --- Dynamic Background Grid ---
        this.createAnimatedGridBackground();

        // --- Full-screen Stroke Panel ---
        this.add.graphics()
            .lineStyle(5, phaserColor(AppColors.UI_SEPARATOR), 1)
            .strokeRect(0, 0, WIDTH, GAME_HEIGHT)
            .setDepth(0);

        // --- Game Title ---
        this.add.text(WIDTH / 2, 100, 'QUANTUM DEFENSE', {
            font: '80px',
            color: AppColors.UI_ACCENT,
            align: 'center'
        }).setOrigin(0.5);

        this.add.graphics()
            .lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1)
            .beginPath()
            .moveTo(0, 150)
            .lineTo(WIDTH, 150)
            .closePath()
            .stroke();

        this.createVisualElements();


        // --- Level Selection Panel ---
        this.createPanel(WIDTH / 2, 400, 450, 475, 'SELECT LEVEL', (panelX, panelY) => {
            this.createLevelSelectionButtons(panelX, panelY);
        });

        // --- Settings Panel ---
        this.createPanel(WIDTH / 2, 750, 450, 200, 'SETTINGS', (panelX, panelY) => {
            this.createDifficultyToggle(panelX, panelY + 20);
            this.createSoundToggle(panelX, panelY + 80);
        });

        // --- Credits Button ---
        this.createButton(WIDTH / 2, 900, 'CREDITS', () => {
            this.scene.start('CreditsScene');
        });
    }

    private createVisualElements() {
        // --- Animated Game Elements ---
        const gameAreaLeft = 0;
        const gameAreaRight = WIDTH;
        const gameAreaTop = 0;
        const gameAreaBottom = GAME_HEIGHT;

        for (let i = 0; i < 2; i++) {
            // Randomize coordinates for enemies
            this.addAnimatedElement('enemy1_menu', Phaser.Math.Between(gameAreaLeft + 50, gameAreaRight - 50), Phaser.Math.Between(gameAreaTop + 200, gameAreaBottom - 100), Phaser.Math.Between(0.7, 1.7), Phaser.Math.Between(1750, 2500));
            this.addAnimatedElement('enemy2_menu', Phaser.Math.Between(gameAreaLeft + 50, gameAreaRight - 50), Phaser.Math.Between(gameAreaTop + 200, gameAreaBottom - 100), Phaser.Math.Between(0.7, 1.7), Phaser.Math.Between(1750, 2500));
            this.addAnimatedElement('enemy3_menu', Phaser.Math.Between(gameAreaLeft + 50, gameAreaRight - 50), Phaser.Math.Between(gameAreaTop + 200, gameAreaBottom - 100), Phaser.Math.Between(0.7, 1.7), Phaser.Math.Between(1750, 2500));
            this.addAnimatedElement('special_enemy_menu', Phaser.Math.Between(gameAreaLeft + 50, gameAreaRight - 50), Phaser.Math.Between(gameAreaTop + 200, gameAreaBottom - 100), Phaser.Math.Between(0.7, 1.7), Phaser.Math.Between(1750, 2500));
            // Randomize coordinates for towers
            this.addAnimatedElement('tower1_menu', Phaser.Math.Between(gameAreaLeft + 50, gameAreaRight - 50), Phaser.Math.Between(gameAreaTop + 200, gameAreaBottom - 100), Phaser.Math.Between(0.7, 1.7), Phaser.Math.Between(1750, 2500));
            this.addAnimatedElement('tower2_menu', Phaser.Math.Between(gameAreaLeft + 50, gameAreaRight - 50), Phaser.Math.Between(gameAreaTop + 200, gameAreaBottom - 100), Phaser.Math.Between(0.7, 1.7), Phaser.Math.Between(1750, 2500));
            this.addAnimatedElement('tower3_menu', Phaser.Math.Between(gameAreaLeft + 50, gameAreaRight - 50), Phaser.Math.Between(gameAreaTop + 200, gameAreaBottom - 100), Phaser.Math.Between(0.7, 1.7), Phaser.Math.Between(1750, 2500));
            // Player
            this.addAnimatedElement('player_menu', Phaser.Math.Between(gameAreaLeft + 50, gameAreaRight - 50), Phaser.Math.Between(gameAreaTop + 200, gameAreaBottom - 100), Phaser.Math.Between(0.7, 1.7), Phaser.Math.Between(1750, 2500));
        }
    }

    private createAnimatedGridBackground(): void {
        const gridGraphics = this.add.graphics({
            lineStyle: {
                width: 1,
                color: phaserColor(AppColors.UI_SEPARATOR),
                alpha: 0.1
            }
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
            x: {from: 0, to: -gridSize},
            y: {from: 0, to: -gridSize},
            duration: 5000,
            ease: 'Linear',
            repeat: -1,
            yoyo: true
        });
    }

    private addAnimatedElement(key: string, x: number, y: number, scale: number, duration: number): void {
        const randomOffsetX = Phaser.Math.Between(-20, 20);
        const randomOffsetY = Phaser.Math.Between(-20, 20);

        const targetX = x + randomOffsetX;
        const targetY = y + randomOffsetY;

        const element = this.add.image(x, y, key)
            .setScale(scale)
            .setAlpha(0.7)
            .setDepth(-1);

        // 4. Create the Tween
        this.tweens.add({
            targets: element,
            x: targetX,
            y: targetY,
            duration: duration,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }

    private createPanel(x: number, y: number, width: number, height: number, title: string, contentCallback: (panelX: number, panelY: number) => void): void {
        const panelGraphics = this.add.graphics();
        panelGraphics.fillRect(x - width / 2, y - height / 2, width, height);
        panelGraphics.lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1);
        panelGraphics.strokeRect(x - width / 2, y - height / 2, width, height);

        this.add.text(x, y - height / 2 + 25, title, {
            font: '36px',
            color: AppColors.UI_ACCENT,
            align: 'center'
        }).setOrigin(0.5);
        this.add.graphics()
            .lineStyle(1, phaserColor(AppColors.UI_SEPARATOR), 1)
            .beginPath()
            .moveTo(x - width / 2, y - height / 2 + 45)
            .lineTo(x + width / 2, y - height / 2 + 45)
            .closePath()
            .stroke();

        contentCallback(x, y - height / 2 + 70);
    }

    private createButton(x: number, y: number, text: string, callback: () => void): Phaser.GameObjects.Text {
        const button = this.add.text(x, y, text, {
            font: '36px',
            color: AppColors.UI_TEXT,
            padding: {x: 20, y: 10}
        }).setOrigin(0.5).setInteractive();

        button.on('pointerover', () => button.setColor(AppColors.UI_ACCENT));
        button.on('pointerout', () => button.setColor(AppColors.UI_TEXT));
        button.on('pointerdown', callback);
        return button;
    }

    private createLevelSelectionButtons(x: number, y: number): void {
        const levelKeys = ['Intro', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];
        const buttonSpacing = 60;
        let currentY = y + 25;

        levelKeys.forEach((key, index) => {
            this.createButton(x, currentY + (index * buttonSpacing), key, () => {
                this.gameState.level = key;
                this.scene.start(key);
            });
        });
    }

    private createDifficultyToggle(x: number, y: number): void {
        this.difficultyText = this.createButton(x, y, `DIFFICULTY: ${this.gameState.difficulty.toUpperCase()}`, () => {
            const difficulties = ['easy', 'normal', 'hard'];
            let currentIndex = difficulties.indexOf(this.gameState.difficulty);
            currentIndex = (currentIndex + 1) % difficulties.length;
            this.gameState.difficulty = difficulties[currentIndex] as 'easy' | 'normal' | 'hard';
            this.difficultyText.setText(`DIFFICULTY: ${this.gameState.difficulty.toUpperCase()}`);
        });
    }

    private createSoundToggle(x: number, y: number): void {
        this.soundText = this.createButton(x, y, `SOUND: ${this.gameState.soundEnabled ? 'ON' : 'OFF'}`, () => {
            this.gameState.soundEnabled = !this.gameState.soundEnabled;
            this.soundText.setText(`SOUND: ${this.gameState.soundEnabled ? 'ON' : 'OFF'}`);
        });
    }
}
