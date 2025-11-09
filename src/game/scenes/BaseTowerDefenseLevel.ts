import * as Phaser from 'phaser';
import {Enemy} from '../entities/Enemy';
import {Tower} from '../entities/Tower';
import {Bullet} from '../entities/Bullet';
import {Bomb} from '../entities/Bomb';
import {Player} from '../entities/Player'; // Import Player
import {GameObject} from '../core/GameObject';
import {Targeting} from '../components/Targeting';
import {LaserAttack} from '../components/LaserAttack';
import {BombAttack} from '../components/BombAttack';
import {Healer} from "../entities/Healer.ts";
import {FindNearestTower} from "../components/FindNearestTower.ts";
import {WaveAmplifier} from "../components/WaveAmplifier.ts";
import {VisualPulse} from "../components/VisualPulse.ts"; // Import VisualPulse

// Define game area and HUD area dimensions
export const GAME_WIDTH = 1920;
export const GAME_HEIGHT = 1000; // Full height of the game
export const TILE_SIZE = 32;

// Tower Costs
export const TOWER1_COST = 100;
export const TOWER2_COST = 250; // Cost for Tower 2

export abstract class BaseTowerDefenseLevel extends Phaser.Scene {
    protected paths!: { [key: string]: Phaser.Curves.Path };
    protected pathGraphics!: Phaser.GameObjects.Graphics;
    protected enemies!: Phaser.GameObjects.Group;
    protected healers!: Phaser.GameObjects.Group;
    protected towers!: Phaser.GameObjects.Group;
    protected bullets!: Phaser.GameObjects.Group;
    protected bombs!: Phaser.GameObjects.Group;
    protected player!: Player; // Declare player property

    // Game State
    protected baseHealth: number = 100;
    protected money: number = 450;
    protected currentWave: number = 1;
    protected enemiesRemaining: number = 0;
    protected enemiesSpawnedInWave: number = 0;
    protected maxEnemiesInWave: number = 20;
    protected healersSpawnedInWave: number = 0;
    protected gameOver: boolean = false;

    // UI Elements
    protected levelText!: Phaser.GameObjects.Text;
    protected baseHealthText!: Phaser.GameObjects.Text;
    protected moneyText!: Phaser.GameObjects.Text;
    protected waveProgressText!: Phaser.GameObjects.Text;
    protected messageText!: Phaser.GameObjects.Text;

    // Abstract methods to be implemented by concrete level classes
    protected abstract getTowerSlots(): { x: number; y: number }[];

    protected abstract getWaveConfig(wave: number): {
        type: string;
        texture: string;
        count: number;
        delay: number;
        health: number;
        speed: number;
        moneyValue: number;
        path: string;
    }[];

    protected abstract getTowerCost(towerType: string): number;

    protected abstract nextScene(): string;

    protected abstract definePaths(): void;

    constructor(key: string) {
        super({key});
    }

    public preload(): void {
        this.createPlaceholderTexture('enemy1', 32, 32, '#7777ff');
        this.createPlaceholderTexture('enemy2', 24, 24, '#ff7777');
        this.createPlaceholderTexture('enemy3', 40, 40, '#f4d753');
        this.createPlaceholderCircleTexture('tower1', 32, 32, 'rgba(255,0,132,0.84)');
        this.createPlaceholderCircleTexture('tower2', 32, 32, '#ff00ff');
        this.createPlaceholderCircleTexture('bullet', 10, 10, '#cf0d0d');
        this.createPlaceholderTriangleTexture('bomb', 20, 20, '#ff8800');
        this.createPlaceholderTexture('healer', 24, 24, '#048a49');
        this.createPlaceholderTexture('towerSlot', TILE_SIZE, TILE_SIZE, '#555555');
        this.createPlaceholderCircleTexture('player', 24, 24, '#ffa500'); // Orange player circle
    }

    public create(): void {
        // --- Physics World Bounds ---
        this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // --- Define Path (implemented by concrete level) ---
        this.definePaths();
        this.pathGraphics = this.add.graphics();
        for (let pathsKey in this.paths) {
            this.pathGraphics.lineStyle(3, 0xcccccc, 0.30);
            this.paths[pathsKey].draw(this.pathGraphics);
        }

        // --- Groups ---
        this.enemies = this.add.group({classType: Enemy, runChildUpdate: false});
        this.healers = this.add.group({classType: Healer, runChildUpdate: false});
        this.towers = this.add.group({classType: Tower, runChildUpdate: false});
        this.bullets = this.add.group({classType: Bullet, runChildUpdate: false});
        this.bombs = this.add.group({classType: Bomb, runChildUpdate: false});

        // --- UI Setup (positioned in HUD area) ---
        const hudY = GAME_HEIGHT + 20;
        const hudX: number = GAME_WIDTH / 4;

        this.levelText = this.add.text(hudX, hudY, '', {font: '20px Roboto', color: '#ffffff'}).setScrollFactor(0);
        this.baseHealthText = this.add.text(hudX + 200, hudY, '', {
            font: '20px Roboto',
            color: '#ffffff'
        }).setScrollFactor(0);
        this.moneyText = this.add.text(hudX + 400, hudY, '', {
            font: '20px Roboto',
            color: '#ffffff'
        }).setScrollFactor(0);
        this.waveProgressText = this.add.text(hudX + 600, hudY, '', {
            font: '20px Roboto',
            color: '#ffffff'
        }).setScrollFactor(0);
        // this.helpText = this.add.text(400, hudY, '', {font: '20px Roboto', color: '#ffffff'}).setScrollFactor(0);

        this.messageText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '', {
            font: '48px Roboto',
            color: '#ff0000',
            backgroundColor: 'rgba(0,0,0,0.40)',
            padding: {x: 20, y: 10}
        }).setOrigin(0.5).setScrollFactor(0).setVisible(false);

        this.updateUI();

        // --- Player ---
        this.player = new Player({scene: this, x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2, texture: 'player'});
        this.player.addComponent(new FindNearestTower());
        this.player.addComponent(new WaveAmplifier(this.healers))
        this.add.existing(this.player);

        // --- Tower Placement Slots ---
        this.createTowerSlots();

        // --- Collision Setup ---
        // @ts-ignore
        this.physics.add.overlap(this.bullets, this.enemies, this.handleBulletEnemyCollision, undefined, this);
        // @ts-ignore
        this.physics.add.overlap(this.bullets, this.healers, this.handleBulletHealerCollision, undefined, this);
        // @ts-ignore
        this.physics.add.overlap(this.bombs, this.enemies, this.handleBombEnemyCollision, undefined, this);
        // @ts-ignore
        this.physics.add.overlap(this.bombs, this.healers, this.handleBombHealerCollision, undefined, this);
        // @ts-ignore
        this.physics.add.overlap(this.bullets, this.player, this.handleBulletPlayerCollision, undefined, this); // Player absorbs bullets

        // --- Visual Separator ---
        this.add.graphics()
            .lineStyle(1, 0xffffff, 1)
            .beginPath()
            .moveTo(GAME_WIDTH, 0)
            .lineTo(GAME_WIDTH, GAME_HEIGHT)
            .closePath()
            .stroke()
            .setScrollFactor(0);

        this.add.graphics()
            .lineStyle(1, 0xffffff, 1)
            .beginPath()
            .moveTo(0, 0)
            .lineTo(0, GAME_HEIGHT)
            .closePath()
            .stroke()
            .setScrollFactor(0);

        this.add.graphics()
            .lineStyle(1, 0xffffff, 1)
            .beginPath()
            .moveTo(0, 0)
            .lineTo(GAME_WIDTH, 0)
            .closePath()
            .stroke()
            .setScrollFactor(0);

        this.add.graphics()
            .lineStyle(1, 0xffffff, 1)
            .beginPath()
            .moveTo(0, GAME_HEIGHT)
            .lineTo(GAME_WIDTH, GAME_HEIGHT)
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
        this.player.update(time, delta); // Update the player
    }

    protected updateUI(): void {
        this.levelText.setText(this.scene.key)
        this.baseHealthText.setText(`Base Health: ${this.baseHealth}`);
        this.moneyText.setText(`Money: $${this.money}`);
        this.waveProgressText.setText(`Wave ${this.currentWave}: ${this.enemiesSpawnedInWave}/${this.maxEnemiesInWave}`);
        // this.helpText.setText(`Help:\n------------------\nLeft-Click to Place\nTower 1 with Bullets,\nRight-Click to place\nTower 2 with Bomb\n------------------`);
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

    protected handleHealerReachedEnd(moneyValue: number): void {
        this.baseHealth += 5;
        this.money += moneyValue;
        this.updateUI();
        this.checkGameOver();
        this.checkWaveCompletion();
    }

    protected checkGameOver(): void {
        if (this.baseHealth <= 0) {
            this.baseHealth = 0;
            this.updateUI();
            this.messageText.setText('GAME OVER!').setVisible(true);
            this.gameOver = true;
            this.physics.pause();
            this.time.delayedCall(3000, () => this.scene.restart());
        }
    }

    protected checkWaveCompletion(): void {
        if (this.gameOver) {
            return;
        }
        if (this.enemiesSpawnedInWave >= this.maxEnemiesInWave && this.enemiesRemaining === 0) {
            if (this.noMoreWavesLeft()) {
                this.physics.pause();
                this.messageText.setText('LEVEL COMPLETE!').setColor('#00ff00').setVisible(true);
                this.time.delayedCall(1500, () => this.messageText.setVisible(false));
                this.scene.start(this.nextScene());
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
            bomb.explode();
        }
    }

    protected handleBombHealerCollision(bombObject: Phaser.GameObjects.GameObject): void {
        if (bombObject instanceof Bomb) {
            const bomb = bombObject as Bomb;
            bomb.explode();
        }
    }

    protected handleBulletHealerCollision(bullet: Bullet, healerObject: Phaser.GameObjects.GameObject): void {
        if (healerObject instanceof GameObject) {
            const healer = healerObject as Healer;
            bullet.applyDamage(healer);
        } else {
            console.warn("Collision detected with an object not recognized as a custom GameObject:", healerObject);
        }
    }

    protected handleBulletPlayerCollision(bullet: Bullet, _player: Player): void {
        // Player absorbs the bullet, so destroy the bullet
        bullet.destroy();
        // Optionally, you could add a score or a visual effect here
    }

    protected createTowerSlots(): void {
        const slots = this.getTowerSlots();
        for (const slot of slots) {
            const towerSlot = this.add.sprite(slot.x, slot.y, 'towerSlot').setInteractive();
            towerSlot.on('pointerdown', () => {
                let towerType = 'tower1';
                if (this.input.activePointer.rightButtonDown()) {
                    towerType = 'tower2';
                }
                this.tryPlaceTower(slot.x, slot.y, towerType, towerSlot);
            });
        }
    }

    protected tryPlaceTower(x: number, y: number, towerType: string, towerSlotSprite: Phaser.GameObjects.Sprite): void {
        const cost = this.getTowerCost(towerType);

        if (towerSlotSprite.texture.key === 'towerSlot') {
            if (this.money >= cost) {
                this.placeSpecificTower(x, y, towerType);
                this.money -= cost;
                towerSlotSprite.setTexture(towerType);
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

        this.maxEnemiesInWave = waveConfig.reduce((sum, config) => sum + (config.type === 'enemy' ? config.count : 0), 0);
        this.enemiesRemaining = this.maxEnemiesInWave;
        this.enemiesSpawnedInWave = 0;


        waveConfig.forEach(waveConfig => {
            let spawnDelay = 0;
            for (let i = 0; i < waveConfig.count; i++) {
                this.time.addEvent({
                    delay: spawnDelay,
                    callback: () => {
                        if (waveConfig.type === 'enemy') {
                            const enemy = new Enemy({
                                scene: this,
                                path: this.paths[waveConfig.path],
                                texture: waveConfig.texture,
                                health: waveConfig.health,
                                speed: waveConfig.speed,
                                moneyValue: waveConfig.moneyValue
                            });
                            this.enemies.add(enemy, true);
                            enemy.on('reachedEnd', this.handleEnemyReachedEnd, this);
                            this.enemiesSpawnedInWave++;
                            this.updateUI();
                        }
                        if (waveConfig.type === 'healer') {
                            const healer = new Healer({
                                scene: this,
                                path: this.paths[waveConfig.path],
                                texture: waveConfig.texture,
                                health: waveConfig.health,
                                speed: waveConfig.speed,
                                moneyValue: waveConfig.moneyValue
                            });
                            this.healers.add(healer, true);
                            healer.on('healerReachedEnd', this.handleHealerReachedEnd, this);
                            this.healersSpawnedInWave++;
                            this.updateUI();
                        }
                    },
                    callbackScope: this,
                });
                spawnDelay += waveConfig.delay;
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
        const graphics = this.make.graphics({x: 0, y: 0});
        graphics.fillStyle(Phaser.Display.Color.ValueToColor(color).color);
        graphics.fillCircle(width / 2, height / 2, Math.min(width, height) / 2);
        graphics.generateTexture(key, width, height);
        graphics.destroy();
    }

    protected placeSpecificTower(x: number, y: number, towerType: string): void {
        if (towerType === 'tower1') {
            const tower = new Tower({scene: this, x, y, texture: 'tower1'});
            this.towers.add(tower, true);
            tower.addComponent(new Targeting(150, [this.enemies, this.healers]));
            tower.addComponent(new LaserAttack(200, 25, 300, this.bullets));
            tower.addComponent(new VisualPulse(Phaser.Display.Color.ValueToColor('rgba(255,0,132,0.84)').color, 150, 1000));
        } else if (towerType === 'tower2') {
            const tower = new Tower({scene: this, x, y, texture: 'tower2'});
            this.towers.add(tower, true);
            tower.addComponent(new Targeting(180, [this.enemies, this.healers]));
            tower.addComponent(new BombAttack(1500, 100, 133, 75, this.bombs, [this.enemies, this.healers]));
            tower.addComponent(new VisualPulse(Phaser.Display.Color.ValueToColor('0xff00ff').color, 250, 2000));
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
