import * as Phaser from 'phaser';
import { BaseTowerDefenseLevel, GAME_HEIGHT, TOWER1_COST, TOWER2_COST } from './BaseTowerDefenseLevel';

export class Level3 extends BaseTowerDefenseLevel {
  constructor() {
    super('Level3');
  }

  protected definePath(): void {
    this.path = new Phaser.Curves.Path(50, -50);
    this.path.lineTo(50, 150);
    this.path.lineTo(700, 150);
    this.path.lineTo(700, 350);
    this.path.lineTo(100, 350);
    this.path.lineTo(100, 550);
    this.path.lineTo(750, 550);
    this.path.lineTo(750, GAME_HEIGHT + 50);
  }

  protected getTowerSlots(): { x: number; y: number }[] {
    return [
      { x: 350, y: 100 },
      { x: 550, y: 250 },
      { x: 200, y: 450 },
      { x: 600, y: 450 },
      { x: 400, y: 650 },
    ];
  }

  protected getWaveConfig(wave: number): { enemyType: string; count: number; delay: number; health: number; speed: number; moneyValue: number }[] {
    if (wave === 1) {
      const waveConfig = [];
      // 20 enemies of type 1, 5 enemies of type 2, and 2 enemies of type 3
      // Pattern: 5x Enemy1, 1x Enemy2, 5x Enemy1, 1x Enemy3, 5x Enemy1, 1x Enemy2, 5x Enemy1, 1x Enemy3
      waveConfig.push(
        { enemyType: 'enemy1', count: 5, delay: 1000, health: 100, speed: 50, moneyValue: 10 },
        { enemyType: 'enemy2', count: 1, delay: 1000, health: 50, speed: 100, moneyValue: 15 },
        { enemyType: 'enemy1', count: 5, delay: 1000, health: 100, speed: 50, moneyValue: 10 },
        { enemyType: 'enemy3', count: 1, delay: 2000, health: 500, speed: 25, moneyValue: 50 }, // Tanky enemy
        { enemyType: 'enemy1', count: 5, delay: 1000, health: 100, speed: 50, moneyValue: 10 },
        { enemyType: 'enemy2', count: 1, delay: 1000, health: 50, speed: 100, moneyValue: 15 },
        { enemyType: 'enemy1', count: 5, delay: 1000, health: 100, speed: 50, moneyValue: 10 },
        { enemyType: 'enemy3', count: 1, delay: 2000, health: 500, speed: 25, moneyValue: 50 }
      );
      return waveConfig;
    }
    return [];
  }

  protected getTowerCost(towerType: string): number {
    switch (towerType) {
      case 'tower1':
        return TOWER1_COST;
      case 'tower2':
        return TOWER2_COST;
      default:
        return 0;
    }
  }

  protected nextScene(): string {
    return "Level4";
  }
}
