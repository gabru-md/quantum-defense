import * as Phaser from 'phaser';
import { BaseLevel, GAME_HEIGHT } from './BaseLevel';
import { Tower } from '../entities/Tower';
import { Targeting } from '../components/Targeting';
import { LaserAttack } from '../components/LaserAttack';

const TOWER1_COST = 100;

export class Level1 extends BaseLevel {
  constructor() {
    super('Level1'); // Unique key for this scene
  }

  // --- Implement Abstract Methods from BaseLevel ---

  protected definePath(): void {
    this.path = new Phaser.Curves.Path(50, -50); // Start off-screen top
    this.path.lineTo(50, 150);
    this.path.lineTo(450, 150);
    this.path.lineTo(450, 350);
    this.path.lineTo(250, 350);
    this.path.lineTo(250, 550);
    this.path.lineTo(750, 550);
    this.path.lineTo(750, GAME_HEIGHT + 50); // End off-screen bottom
  }

  protected getTowerSlots(): { x: number; y: number }[] {
    return [
      { x: 150, y: 250 },
      { x: 350, y: 250 },
      { x: 350, y: 450 },
      { x: 550, y: 450 },
    ];
  }

  protected getWaveConfig(wave: number): { enemyType: string; count: number; delay: number; health: number; speed: number; moneyValue: number }[] {
    if (wave === 1) {
      return [
        { enemyType: 'enemy1', count: 20, delay: 1000, health: 100, speed: 50, moneyValue: 10 }
      ];
    }
    return []; // No more waves for this level yet
  }

  protected getTowerCost(towerType: string): number {
    switch (towerType) {
      case 'tower1':
        return TOWER1_COST;
      default:
        return 0;
    }
  }

  protected placeSpecificTower(x: number, y: number, towerType: string): void {
    if (towerType === 'tower1') {
      const tower = new Tower({ scene: this, x, y, texture: 'tower1' });
      this.towers.add(tower, true);
      tower.addComponent(new Targeting(150, this.enemies));
      tower.addComponent(new LaserAttack(100, 25, 300, this.bullets));
    }
    // Other tower types will go here for future levels
  }

  protected nextScene(): string {
      return "Level2";
  }

}
