import * as Phaser from 'phaser';
import { BaseLevel, GAME_HEIGHT } from './BaseLevel';
import { Tower } from '../entities/Tower';
import { Targeting } from '../components/Targeting';
import { LaserAttack } from '../components/LaserAttack';

const TOWER1_COST = 100;

export class Level2 extends BaseLevel {
  constructor() {
    super('Level2'); // Unique key for this scene
  }

  protected definePath(): void {
    this.path = new Phaser.Curves.Path(50, -50); // Start off-screen top
    this.path.lineTo(50, 200);
    this.path.lineTo(600, 200);
    this.path.lineTo(600, 400);
    this.path.lineTo(150, 400);
    this.path.lineTo(150, 600);
    this.path.lineTo(750, 600);
    this.path.lineTo(750, GAME_HEIGHT + 50); // End off-screen bottom
  }

  protected getTowerSlots(): { x: number; y: number }[] {
    return [
      { x: 300, y: 100 },
      { x: 450, y: 300 },
      { x: 250, y: 500 },
      { x: 650, y: 500 },
    ];
  }

  protected getWaveConfig(wave: number): { enemyType: string; count: number; delay: number; health: number; speed: number; moneyValue: number }[] {
    if (wave === 1) {
      const waveConfig = [];
      // 20 enemies of type 1 and 5 enemies of type 2 in between the type 1
      // Pattern: 4x Enemy1, 1x Enemy2, repeat 5 times
      for (let i = 0; i < 5; i++) {
        waveConfig.push(
          { enemyType: 'enemy1', count: 4, delay: 1000, health: 100, speed: 50, moneyValue: 10 },
          { enemyType: 'enemy2', count: 1, delay: 1000, health: 50, speed: 100, moneyValue: 15 }
        );
      }
      return waveConfig;
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
      tower.addComponent(new LaserAttack(75, 25, 300, this.bullets));
    }
  }

  protected nextScene(): string {
    return "Level3";
  }
}
