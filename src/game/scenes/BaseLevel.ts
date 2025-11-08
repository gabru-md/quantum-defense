import * as Phaser from 'phaser';
import { Enemy } from '../entities/Enemy';
import { Tower } from '../entities/Tower';
import { Bullet } from '../entities/Bullet';
import { GameObject } from '../core/GameObject';

// Define game area and HUD area dimensions
export const GAME_AREA_WIDTH = 800;
export const GAME_HEIGHT = 768; // Full height of the game
export const HUD_AREA_WIDTH = 1027 - GAME_AREA_WIDTH; // 227
export const TILE_SIZE = 64;

export abstract class BaseLevel extends Phaser.Scene {
  protected path!: Phaser.Curves.Path;
  protected pathGraphics!: Phaser.GameObjects.Graphics;
  protected enemies!: Phaser.GameObjects.Group;
  protected towers!: Phaser.GameObjects.Group;
  protected bullets!: Phaser.GameObjects.Group;

  // Game State
  protected baseHealth: number = 100;
  protected money: number = 200;
  protected currentWave: number = 1;
  protected enemiesRemaining: number = 0; // Enemies currently active or to be spawned
  protected enemiesSpawnedInWave: number = 0;
  protected maxEnemiesInWave: number = 20; // Default, will be overridden by specific levels

  // UI Elements
  protected baseHealthText!: Phaser.GameObjects.Text;
  protected moneyText!: Phaser.GameObjects.Text;
  protected waveProgressText!: Phaser.GameObjects.Text;
  protected messageText!: Phaser.GameObjects.Text; // For Game Over/Win messages

  // Abstract methods to be implemented by concrete level classes
  protected abstract definePath(): void;
  protected abstract getTowerSlots(): { x: number; y: number }[];
  protected abstract getWaveConfig(wave: number): { enemyType: string; count: number; delay: number; health: number; speed: number; moneyValue: number }[];
  protected abstract getTowerCost(towerType: string): number;
  protected abstract placeSpecificTower(x: number, y: number, towerType: string): void;
  protected abstract nextScene(): string;

  constructor(key: string) {
    super({ key });
  }

  public preload(): void {
    // Placeholder textures - specific levels can add more
    this.createPlaceholderTexture('enemy1', 32, 32, '#7777ff'); // Blue for normal enemy
    this.createPlaceholderTexture('enemy2', 24, 24, '#ff7777'); // Red for fast enemy
    this.createPlaceholderTexture('enemy3', 40, 40, '#77ff77'); // Green for tanky enemy
    this.createPlaceholderTexture('tower1', 54, 54, '#00ff00'); // Green for laser tower
    this.createPlaceholderTexture('tower2', 54, 54, '#ff00ff'); // Purple for bomb tower
    this.createPlaceholderTexture('bullet', 10, 10, '#ffff00'); // Yellow for laser bullet
    this.createPlaceholderTexture('bomb', 20, 20, '#ff8800'); // Orange for bomb projectile
    this.createPlaceholderTexture('towerSlot', TILE_SIZE, TILE_SIZE, '#555555'); // Grey for tower slot
  }

  public create(): void {
    // --- Physics World Bounds ---
    this.physics.world.setBounds(0, 0, GAME_AREA_WIDTH, GAME_HEIGHT);

    // --- Define Path (implemented by concrete level) ---
    this.definePath();
    this.pathGraphics = this.add.graphics();
    this.pathGraphics.lineStyle(3, 0xcccccc, 1);
    this.path.draw(this.pathGraphics);

    // --- Groups ---
    this.enemies = this.add.group({ classType: Enemy, runChildUpdate: false });
    this.towers = this.add.group({ classType: Tower, runChildUpdate: false });
    this.bullets = this.add.group({ classType: Bullet, runChildUpdate: false });

    // --- Tower Placement Slots ---
    this.createTowerSlots();
    
    // --- Collision Setup ---
    // @ts-ignore
    this.physics.add.overlap(this.bullets, this.enemies, this.handleBulletEnemyCollision, undefined, this);

    // --- UI Setup (positioned in HUD area) ---
    const hudX = GAME_AREA_WIDTH + 10;

    this.baseHealthText = this.add.text(hudX, 10, '', { font: '20px Arial', color: '#ffffff' }).setScrollFactor(0);
    this.moneyText = this.add.text(hudX, 40, '', { font: '20px Arial', color: '#ffffff' }).setScrollFactor(0);
    this.waveProgressText = this.add.text(hudX, 70, '', { font: '20px Arial', color: '#ffffff' }).setScrollFactor(0);

    this.messageText = this.add.text(GAME_AREA_WIDTH / 2, GAME_HEIGHT / 2, '', {
      font: '48px Arial',
      color: '#ff0000',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
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
    // @ts-ignore
    this.enemies.children.each((enemy: Phaser.GameObjects.GameObject) => {
      if (enemy instanceof GameObject) {
        enemy.update(time, delta);
      }
    });
    // @ts-ignore
    this.towers.children.each((tower: Phaser.GameObjects.GameObject) => {
      if (tower instanceof GameObject) {
        tower.update(time, delta);
      }
    });
    // @ts-ignore
    this.bullets.children.each((bullet: Phaser.GameObjects.GameObject) => {
      if (bullet instanceof GameObject) {
        bullet.update(time, delta);
      }
    });
  }

  protected updateUI(): void {
    this.baseHealthText.setText(`Base Health: ${this.baseHealth}`);
    this.moneyText.setText(`Money: $${this.money}`);
    this.waveProgressText.setText(`Wave ${this.currentWave}: ${this.enemiesSpawnedInWave}/${this.maxEnemiesInWave} Spawned`);
  }

  protected handleEnemyDied(moneyValue: number): void {
    this.money += moneyValue;
    this.enemiesRemaining--;
    console.log(`${this.enemiesRemaining} Enemies remain`)
    this.updateUI();
    this.checkWaveCompletion();
  }

  protected handleEnemyReachedEnd(): void {
    this.baseHealth -= 10; // Each enemy reaching end reduces health by 10
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
      this.messageText.setText('WAVE COMPLETE!').setColor('#00ff00').setVisible(true);
      this.physics.pause();
      this.time.delayedCall(3000, () => {
        // This is where we'd transition to the next level
        // For now, we'll just restart or go to a specific next level
        this.scene.start(this.nextScene()); // Attempt to start Level2
      });
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

  protected createTowerSlots(): void {
    const slots = this.getTowerSlots();
    for (const slot of slots) {
      const towerSlot = this.add.sprite(slot.x, slot.y, 'towerSlot').setInteractive();
      towerSlot.on('pointerdown', () => {
        // For now, only allow placing Tower1
        const towerType = 'tower1'; // This will be dynamic later
        const cost = this.getTowerCost(towerType);

        if (towerSlot.texture.key === 'towerSlot') { // Check if slot is empty
          if (this.money >= cost) {
            this.placeSpecificTower(slot.x, slot.y, towerType);
            this.money -= cost;
            towerSlot.setTexture(towerType); // Set texture to placed tower
            towerSlot.disableInteractive();
            this.updateUI();
          } else {
            this.messageText.setText('Not enough money!').setColor('#ffff00').setVisible(true);
            this.time.delayedCall(1500, () => this.messageText.setVisible(false));
          }
        }
      });
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

    let spawnDelay = 0;
    waveConfig.forEach(enemyBatch => {
      for (let i = 0; i < enemyBatch.count; i++) {
        this.time.addEvent({
          delay: spawnDelay,
          callback: () => {
            const enemy = new Enemy({
              scene: this,
              path: this.path,
              texture: enemyBatch.enemyType,
              health: enemyBatch.health,
              speed: enemyBatch.speed,
              moneyValue: enemyBatch.moneyValue
            });
            this.enemies.add(enemy, true);
            enemy.on('reachedEnd', this.handleEnemyReachedEnd, this);
            this.enemiesSpawnedInWave++;
            this.updateUI();
          },
          callbackScope: this,
        });
        spawnDelay += enemyBatch.delay;
      }
    });
  }

  protected createPlaceholderTexture(key: string, width: number, height: number, color: string): void {
    //@ts-ignore
    const graphics = this.make.graphics({ width, height });
    graphics.fillStyle(Phaser.Display.Color.ValueToColor(color).color);
    graphics.fillRect(0, 0, width, height);
    graphics.generateTexture(key, width, height);
    graphics.destroy();
  }
}
