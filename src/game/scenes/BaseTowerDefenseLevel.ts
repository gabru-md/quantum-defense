import * as Phaser from 'phaser';
import {Enemy} from '../entities/Enemy';
import {Tower} from '../entities/Tower';
import {Bullet} from '../entities/Bullet';
import {Bomb} from '../entities/Bomb'; // Import Bomb
import {GameObject} from '../core/GameObject';
import {Targeting} from "../components/Targeting.ts";
import {LaserAttack} from "../components/LaserAttack.ts";
import {BombAttack} from "../components/BombAttack.ts";

// Define game area and HUD area dimensions
export const GAME_AREA_WIDTH = 800;
export const GAME_HEIGHT = 768; // Full height of the game
export const HUD_AREA_WIDTH = 1027 - GAME_AREA_WIDTH; // 227
export const TILE_SIZE = 32;

// Tower Costs
export const TOWER1_COST = 100;
export const TOWER2_COST = 250; // Cost for Tower 2

export abstract class BaseTowerDefenseLevel extends Phaser.Scene {
    protected paths!: { [key: string]: Phaser.Curves.Path };
    protected pathGraphics!: Phaser.GameObjects.Graphics;
    protected enemies!: Phaser.GameObjects.Group;
    protected towers!: Phaser.GameObjects.Group;
    protected bullets!: Phaser.GameObjects.Group;
    protected bombs!: Phaser.GameObjects.Group; // New group for bombs

    // Game State
    protected baseHealth: number = 100;
    protected money: number = 450;
    protected currentWave: number = 1;
    protected enemiesRemaining: number = 0;
    protected enemiesSpawnedInWave: number = 0;
    protected maxEnemiesInWave: number = 20;

    // UI Elements
    protected levelText!: Phaser.GameObjects.Text;
    protected baseHealthText!: Phaser.GameObjects.Text;
    protected moneyText!: Phaser.GameObjects.Text;
    protected waveProgressText!: Phaser.GameObjects.Text;
    protected messageText!: Phaser.GameObjects.Text;
    private helpText!: Phaser.GameObjects.Text;

    // Abstract methods to be implemented by concrete level classes

    protected abstract getTowerSlots(): { x: number; y: number }[];

    protected abstract getWaveConfig(wave: number): {
        enemyType: string;
        count: number;
        delay: number;
        health: number;
        speed: number;
        moneyValue: number;
        path: string;
    }[];

    protected abstract getTowerCost(towerType: string): number;

    protected abstract nextScene(): string;

    protected definePaths() {
    }

    constructor(key: string) {
        super({key});
    }

    public preload(): void {
        // Placeholder textures - specific levels can add more
        this.createPlaceholderTexture('enemy1', 32, 32, '#7777ff'); // Blue for normal enemy
        this.createPlaceholderTexture('enemy2', 24, 24, '#ff7777'); // Red for fast enemy
        this.createPlaceholderTexture('enemy3', 40, 40, '#77ff77'); // Green for tanky enemy
        this.createPlaceholderCircleTexture('tower1', 32, 32, '#00ff00'); // Green for laser tower
        this.createPlaceholderCircleTexture('tower2', 32, 32, '#ff00ff'); // Purple for bomb tower
        this.createPlaceholderCircleTexture('bullet', 10, 10, '#ffff00'); // Yellow for laser bullet
        this.createPlaceholderTriangleTexture('bomb', 20, 20, '#ff8800'); // Orange for bomb projectile
        this.createPlaceholderTexture('towerSlot', TILE_SIZE, TILE_SIZE, '#555555'); // Grey for tower slot
    }

    public create(): void {
        // --- Physics World Bounds ---
        this.physics.world.setBounds(0, 0, GAME_AREA_WIDTH, GAME_HEIGHT);

        // --- Define Path (implemented by concrete level) ---
        this.definePaths();
        this.pathGraphics = this.add.graphics();
        for (let pathsKey in this.paths) {
            this.pathGraphics.lineStyle(3, 0xcccccc, 0.30);
            this.paths[pathsKey].draw(this.pathGraphics);
        }

        // --- Groups ---
        this.enemies = this.add.group({classType: Enemy, runChildUpdate: false});
        this.towers = this.add.group({classType: Tower, runChildUpdate: false});
        this.bullets = this.add.group({classType: Bullet, runChildUpdate: false});
        this.bombs = this.add.group({classType: Bomb, runChildUpdate: false}); // Initialize bombs group

        // --- Tower Placement Slots ---
        this.createTowerSlots();

        // --- Collision Setup ---
        // @ts-ignore
        this.physics.add.overlap(this.bullets, this.enemies, this.handleBulletEnemyCollision, undefined, this);
        // @ts-ignore
        this.physics.add.overlap(this.bombs, this.enemies, this.handleBombEnemyCollision, undefined, this); // New bomb collision

        // --- UI Setup (positioned in HUD area) ---
        const hudX = GAME_AREA_WIDTH + 10;


        this.levelText = this.add.text(hudX, 0, '', {font: '20px Arial', color: '#ffffff'}).setScrollFactor(0);
        this.baseHealthText = this.add.text(hudX, 30, '', {font: '20px Arial', color: '#ffffff'}).setScrollFactor(0);
        this.moneyText = this.add.text(hudX, 60, '', {font: '20px Arial', color: '#ffffff'}).setScrollFactor(0);
        this.waveProgressText = this.add.text(hudX, 90, '', {font: '20px Arial', color: '#ffffff'}).setScrollFactor(0);
        this.helpText = this.add.text(hudX, 120, '', {font: '20px Arial', color: '#ffffff'}).setScrollFactor(0);

        this.messageText = this.add.text(GAME_AREA_WIDTH / 2, GAME_HEIGHT / 2, '', {
            font: '48px Arial',
            color: '#ff0000',
            backgroundColor: '#000000',
            padding: {x: 20, y: 10}
        }).setOrigin(0.5).setScrollFactor(0).setVisible(false);

        this.updateUI();

        // --- Visual Separator ---
        this.add.graphics()
            .lineStyle(2, 0xffffff, 1)
            .beginPath()
            .moveTo(GAME_AREA_WIDTH, 0)
            .lineTo(GAME_AREA_WIDTH, GAME_HEIGHT)
            .closePath()
            .stroke()
            .setScrollFactor(0);

        // --- Event Listeners ---
        this.events.on('enemyDied', this.handleEnemyDied, this);

        // --- Wave Management ---
        this.startWave(this.currentWave);
    }

    public update(time: number, delta: number): void {
        this.enemies.children.each((enemy: Phaser.GameObjects.GameObject) => {
            if (enemy instanceof GameObject) {
                enemy.update(time, delta);
            }
            return null;
        });
        this.towers.children.each((tower: Phaser.GameObjects.GameObject) => {
            if (tower instanceof GameObject) {
                tower.update(time, delta);
            }
            return null;
        });
        this.bullets.children.each((bullet: Phaser.GameObjects.GameObject) => {
            if (bullet instanceof GameObject) {
                bullet.update(time, delta);
            }
            return null;
        });
        this.bombs.children.each((bomb: Phaser.GameObjects.GameObject) => {
            if (bomb instanceof GameObject) {
                bomb.update(time, delta);
            }
            return null;
        });
    }

    protected updateUI(): void {
        this.levelText.setText(this.scene.key)
        this.baseHealthText.setText(`Base Health: ${this.baseHealth}`);
        this.moneyText.setText(`Money: $${this.money}`);
        this.waveProgressText.setText(`Wave ${this.currentWave}: ${this.enemiesSpawnedInWave}/${this.maxEnemiesInWave} Spawned`);
        this.helpText.setText(`Help:\n------------------\nLeft-Click to Place\nTower 1 with Bullets,\nRight-Click to place\nTower 2 with Bomb\n------------------`);
    }

    protected handleEnemyDied(moneyValue: number): void {
        this.money += moneyValue;
        this.enemiesRemaining--;
        this.updateUI();
        this.checkWaveCompletion();
    }

    protected handleEnemyReachedEnd(): void {
        this.baseHealth -= 10;
        this.enemiesRemaining--;
        this.updateUI();
        this.checkGameOver();
        this.checkWaveCompletion();
    }

    protected checkGameOver(): void {
        if (this.baseHealth <= 0) {
            this.baseHealth = 0;
            this.updateUI();
            this.messageText.setText('GAME OVER!').setVisible(true);
            this.physics.pause();
            this.time.delayedCall(3000, () => this.scene.restart());
        }
    }

    protected checkWaveCompletion(): void {
        if (this.enemiesSpawnedInWave >= this.maxEnemiesInWave && this.enemiesRemaining === 0) {
            if (this.noMoreWavesLeft()) {
                this.physics.pause();
                this.time.delayedCall(3000, () => {
                    this.messageText.setText('LEVEL COMPLETE!').setColor('#00ff00').setVisible(true);
                    this.time.delayedCall(1500, () => this.messageText.setVisible(false));
                    this.scene.start(this.nextScene());
                });
            } else {
                this.messageText.setText('NEXT WAVE INCOMING!').setColor('#00ff00').setVisible(true);
                this.time.delayedCall(1500, () => {
                    this.messageText.setVisible(false)
                    this.currentWave++;
                    this.startWave(this.currentWave);
                });
            }
        }
    }

    protected handleBulletEnemyCollision(bullet: Bullet, enemyObject: Phaser.GameObjects.GameObject): void {
        if (enemyObject instanceof GameObject) {
            const enemy = enemyObject as Enemy;
            bullet.applyDamage(enemy);
        } else {
            console.warn("Collision detected with an object not recognized as a custom GameObject:", enemyObject);
        }
    }

    protected handleBombEnemyCollision(bombObject: Phaser.GameObjects.GameObject): void {
        if (bombObject instanceof Bomb) {
            const bomb = bombObject as Bomb;
            // When a bomb hits ANY enemy, it explodes.
            bomb.explode();
        }
    }

    protected createTowerSlots(): void {
        const slots = this.getTowerSlots();
        for (const slot of slots) {
            const towerSlot = this.add.sprite(slot.x, slot.y, 'towerSlot').setInteractive();
            towerSlot.on('pointerdown', () => {
                // Simple tower selection for now: right-click for Tower2, left-click for Tower1
                // This will be replaced by a proper UI later
                let towerType = 'tower1'; // Default to Tower1
                if (this.input.activePointer.rightButtonDown()) {
                    towerType = 'tower2';
                }
                this.tryPlaceTower(slot.x, slot.y, towerType, towerSlot);
            });
        }
    }

    protected tryPlaceTower(x: number, y: number, towerType: string, towerSlotSprite: Phaser.GameObjects.Sprite): void {
        const cost = this.getTowerCost(towerType);

        if (towerSlotSprite.texture.key === 'towerSlot') { // Check if slot is empty
            if (this.money >= cost) {
                this.placeSpecificTower(x, y, towerType);
                this.money -= cost;
                towerSlotSprite.setTexture(towerType); // Set texture to placed tower
                towerSlotSprite.disableInteractive();
                this.updateUI();
            } else {
                this.messageText.setText('Not enough money!').setColor('#ffff00').setVisible(true);
                this.time.delayedCall(1500, () => this.messageText.setVisible(false));
            }
        }
    }

    protected startWave(waveNumber: number): void {
        const waveConfig = this.getWaveConfig(waveNumber);
        if (!waveConfig || waveConfig.length === 0) {
            console.warn(`No wave config found for wave ${waveNumber}`);
            return;
        }

        this.maxEnemiesInWave = waveConfig.reduce((sum, config) => sum + config.count, 0);
        this.enemiesRemaining = this.maxEnemiesInWave;
        this.enemiesSpawnedInWave = 0;

        waveConfig.forEach(enemyBatch => {
            for (let i = 0; i < enemyBatch.count; i++) {
                this.time.addEvent({
                    delay: i * enemyBatch.delay, // Delay each enemy within the batch
                    callback: () => {
                        const enemy = new Enemy({
                            scene: this,
                            path: this.paths[enemyBatch.path],
                            texture: enemyBatch.enemyType,
                            health: enemyBatch.health,
                            speed: enemyBatch.speed, // Use enemyBatch.speed
                            moneyValue: enemyBatch.moneyValue
                        });
                        this.enemies.add(enemy, true);
                        enemy.on('reachedEnd', this.handleEnemyReachedEnd, this);
                        this.enemiesSpawnedInWave++;
                        this.updateUI();
                    }, callbackScope: this,
                });
            }
        });
    }

    protected createPlaceholderTexture(key: string, width: number, height: number, color: string): void {
        const graphics = this.make.graphics({x: width, y: height});
        graphics.fillStyle(Phaser.Display.Color.ValueToColor(color).color);
        graphics.fillRect(0, 0, width, height);
        graphics.generateTexture(key, width, height);
        graphics.destroy();
    }

    protected createPlaceholderTriangleTexture(key: string, width: number, height: number, color: string): void {
        const graphics = this.make.graphics({x: 0, y: 0});
        graphics.fillStyle(Phaser.Display.Color.ValueToColor(color).color);

        // Define the three points of the triangle
        // For a simple upright triangle:
        const p1x = width / 2; // Top center
        const p1y = 0;

        const p2x = 0;         // Bottom left
        const p2y = height;

        const p3x = width;     // Bottom right
        const p3y = height;

        graphics.fillTriangle(p1x, p1y, p2x, p2y, p3x, p3y);

        graphics.generateTexture(key, width, height);
        graphics.destroy();
    }

    protected createPlaceholderCircleTexture(key: string, width: number, height: number, color: string): void {
        const graphics = this.make.graphics({x: 0, y: 0}); // Start graphics at 0,0 for drawing
        graphics.fillStyle(Phaser.Display.Color.ValueToColor(color).color);
        graphics.fillCircle(width / 2, height / 2, Math.min(width, height) / 2);
        graphics.generateTexture(key, width, height);
        graphics.destroy();
    }

    protected placeSpecificTower(x: number, y: number, towerType: string): void {
        if (towerType === 'tower1') {
            const tower = new Tower({scene: this, x, y, texture: 'tower1'});
            this.towers.add(tower, true);
            tower.addComponent(new Targeting(150, this.enemies));
            tower.addComponent(new LaserAttack(200, 25, 300, this.bullets));
        } else if (towerType === 'tower2') {
            const tower = new Tower({scene: this, x, y, texture: 'tower2'});
            this.towers.add(tower, true);
            tower.addComponent(new Targeting(180, this.enemies)); // Slightly larger range for bomb tower
            tower.addComponent(new BombAttack(1500, 100, 133, 75, this.bombs, this.enemies)); // Slower fire rate, more damage, AoE
        }
    }

    private noMoreWavesLeft() {
        const nextWaveConfig = this.getWaveConfig(this.currentWave + 1);
        if (nextWaveConfig.length == 0) {
            return true;
        }
        return false;
    }
}
