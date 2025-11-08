import * as Phaser from 'phaser';
import { Enemy } from '../entities/Enemy';
import { Tower } from '../entities/Tower';
import { Bullet } from '../entities/Bullet';
import { Targeting } from '../components/Targeting';
import { LaserAttack } from '../components/LaserAttack';
import { GameObject } from '../core/GameObject';

const TILE_SIZE = 64;
const TOWER_COST = 100;

const GAME_AREA_WIDTH = 800;
const GAME_HEIGHT = 768;

export class TowerDefenseScene extends Phaser.Scene {
  private path!: Phaser.Curves.Path;
  private pathGraphics!: Phaser.GameObjects.Graphics;
  private enemies!: Phaser.GameObjects.Group;
  private towers!: Phaser.GameObjects.Group;
  private bullets!: Phaser.GameObjects.Group;

  private baseHealth: number = 100;
  private money: number = 200;
  private currentWave: number = 1;
  private enemiesRemaining: number = 0;
  private enemiesSpawnedInWave: number = 0;
  private maxEnemiesInWave: number = 20;

  private baseHealthText!: Phaser.GameObjects.Text;
  private moneyText!: Phaser.GameObjects.Text;
  private waveProgressText!: Phaser.GameObjects.Text;
  private activeEnemiesText!: Phaser.GameObjects.Text;
  private messageText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'TowerDefenseScene' });
  }

  public preload(): void {
    this.createPlaceholderTexture('enemy1', TILE_SIZE / 2, TILE_SIZE / 2, '#7777ff');
    this.createPlaceholderTexture('tower1', TILE_SIZE - 10, TILE_SIZE - 10, '#00ff00');
    this.createPlaceholderTexture('bullet', 10, 10, '#ffff00');
    this.createPlaceholderTexture('towerSlot', TILE_SIZE, TILE_SIZE, '#555555');
  }

  public create(): void {
    this.physics.world.setBounds(0, 0, GAME_AREA_WIDTH, GAME_HEIGHT);

    this.path = new Phaser.Curves.Path(50, -50);
    this.path.lineTo(50, 150);
    this.path.lineTo(450, 150);
    this.path.lineTo(450, 350);
    this.path.lineTo(250, 350);
    this.path.lineTo(250, 550);
    this.path.lineTo(750, 550);
    this.path.lineTo(750, GAME_HEIGHT + 50);

    this.pathGraphics = this.add.graphics();
    this.pathGraphics.lineStyle(3, 0xcccccc, 1);
    this.path.draw(this.pathGraphics);

    this.enemies = this.add.group({ classType: Enemy, runChildUpdate: false });
    this.towers = this.add.group({ classType: Tower, runChildUpdate: false });
    this.bullets = this.add.group({ classType: Bullet, runChildUpdate: false });

    this.createTowerSlots();
    // @ts-ignore
    this.physics.add.overlap(this.bullets, this.enemies, this.handleBulletEnemyCollision, undefined, this);

    const hudX = GAME_AREA_WIDTH + 10;

    this.baseHealthText = this.add.text(hudX, 10, '', { font: '20px Arial', color: '#ffffff' }).setScrollFactor(0);
    this.moneyText = this.add.text(hudX, 40, '', { font: '20px Arial', color: '#ffffff' }).setScrollFactor(0);
    this.waveProgressText = this.add.text(hudX, 70, '', { font: '20px Arial', color: '#ffffff' }).setScrollFactor(0);
    this.activeEnemiesText = this.add.text(hudX, 100, '', { font: '20px Arial', color: '#ffffff' }).setScrollFactor(0);

    this.messageText = this.add.text(GAME_AREA_WIDTH / 2, GAME_HEIGHT / 2, '', {
      font: '48px Arial',
      color: '#ff0000',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setScrollFactor(0).setVisible(false);

    this.updateUI();

    this.add.graphics()
      .lineStyle(2, 0xffffff, 1)
      .beginPath()
      .moveTo(GAME_AREA_WIDTH, 0)
      .lineTo(GAME_AREA_WIDTH, GAME_HEIGHT)
      .closePath()
      .stroke()
      .setScrollFactor(0);

    this.events.on('enemyDied', this.handleEnemyDied, this);

    this.startWave(this.currentWave);
  }

  public update(time: number, delta: number): void {
    //@ts-ignore
    this.enemies.children.each((enemy: Phaser.GameObjects.GameObject) => {
      if (enemy instanceof GameObject) {
        enemy.update(time, delta);
      }
    });
    //@ts-ignore
    this.towers.children.each((tower: Phaser.GameObjects.GameObject) => {
      if (tower instanceof GameObject) {
        tower.update(time, delta);
      }
    });
    //@ts-ignore
    this.bullets.children.each((bullet: Phaser.GameObjects.GameObject) => {
      if (bullet instanceof GameObject) {
        bullet.update(time, delta);
      }
    });
  }

  private updateUI(): void {
    this.baseHealthText.setText(`Base Health: ${this.baseHealth}`);
    this.moneyText.setText(`Money: $${this.money}`);
    this.waveProgressText.setText(`Wave ${this.currentWave}: ${this.enemiesSpawnedInWave}/${this.maxEnemiesInWave} Spawned`);
    this.activeEnemiesText.setText(`Active: ${this.enemies.getLength()}`);
  }

  private handleEnemyDied(moneyValue: number): void {
    this.money += moneyValue;
    this.enemiesRemaining--;
    this.updateUI();
    this.checkWaveCompletion();
  }

  private handleEnemyReachedEnd(): void {
    this.baseHealth -= 10;
    this.enemiesRemaining--;
    this.updateUI();
    this.checkGameOver();
    this.checkWaveCompletion();
  }

  private checkGameOver(): void {
    if (this.baseHealth <= 0) {
      this.baseHealth = 0;
      this.updateUI();
      this.messageText.setText('GAME OVER!').setVisible(true);
      this.physics.pause();
      this.time.delayedCall(3000, () => this.scene.restart());
    }
  }

  private checkWaveCompletion(): void {
    if (this.enemiesSpawnedInWave >= this.maxEnemiesInWave && this.enemies.getLength() === 0) {
      this.messageText.setText('WAVE COMPLETE!').setColor('#00ff00').setVisible(true);
      this.physics.pause();
      this.time.delayedCall(3000, () => {
        this.scene.restart();
      });
    }
  }

  private handleBulletEnemyCollision(bullet: Bullet, enemyObject: Phaser.GameObjects.GameObject): void {
    if (enemyObject instanceof GameObject) {
      const enemy = enemyObject as Enemy;
      bullet.applyDamage(enemy);
    } else {
      console.warn("Collision detected with an object not recognized as a custom GameObject:", enemyObject);
    }
  }

  private createTowerSlots(): void {
    const slots = [
      { x: 150, y: 250 },
      { x: 350, y: 250 },
      { x: 350, y: 450 },
      { x: 550, y: 450 },
    ];

    for (const slot of slots) {
      const towerSlot = this.add.sprite(slot.x, slot.y, 'towerSlot').setInteractive();
      towerSlot.on('pointerdown', () => {
        if (towerSlot.texture.key === 'towerSlot') {
          if (this.money >= TOWER_COST) {
            this.placeTower(slot.x, slot.y);
            this.money -= TOWER_COST;
            towerSlot.setTexture('tower1');
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

  private placeTower(x: number, y: number): void {
    const tower = new Tower({ scene: this, x, y, texture: 'tower1' });
    this.towers.add(tower, true);

    tower.addComponent(new Targeting(150, this.enemies));
    tower.addComponent(new LaserAttack(150, 25, 300, this.bullets));
  }

  private startWave(level: number): void {
    if (level === 1) {
      this.enemiesRemaining = this.maxEnemiesInWave;
      this.enemiesSpawnedInWave = 0;
      const enemyConfig = { scene: this, path: this.path, texture: 'enemy1', health: 100, speed: 50, moneyValue: 10 };
      this.time.addEvent({
        delay: 1000,
        repeat: this.maxEnemiesInWave - 1,
        callback: () => {
          const enemy = new Enemy(enemyConfig);
          this.enemies.add(enemy, true);
          enemy.on('reachedEnd', this.handleEnemyReachedEnd, this);
          this.enemiesSpawnedInWave++;
          this.updateUI();
        },
        callbackScope: this,
      });
    }
  }

  private createPlaceholderTexture(key: string, width: number, height: number, color: string): void {
    //@ts-ignore
    const graphics = this.make.graphics({ width, height });
    graphics.fillStyle(Phaser.Display.Color.ValueToColor(color).color);
    graphics.fillRect(0, 0, width, height);
    graphics.generateTexture(key, width, height);
    graphics.destroy();
  }
}
