import * as Phaser from 'phaser';
import { BaseTowerDefenseLevel, GAME_HEIGHT, TOWER1_COST, TOWER2_COST } from './BaseTowerDefenseLevel';

export class Level5 extends BaseTowerDefenseLevel {
  constructor() {
    super('Level5');
  }

  protected definePath(): void {
    this.path = new Phaser.Curves.Path(50, -50);
    this.path.lineTo(50, 100);
    this.path.lineTo(200, 100);
    this.path.lineTo(200, 250);
    this.path.lineTo(50, 250);
    this.path.lineTo(50, 400);
    this.path.lineTo(200, 400);
    this.path.lineTo(200, 550);
    this.path.lineTo(50, 550);
    this.path.lineTo(50, 700);
    this.path.lineTo(750, 700);
    this.path.lineTo(750, GAME_HEIGHT + 50);
  }

  protected getTowerSlots(): { x: number; y: number }[] {
    return [
      { x: 350, y: 50 },
      { x: 550, y: 50 },
      { x: 350, y: 200 },
      { x: 550, y: 200 },
      { x: 350, y: 350 },
      { x: 550, y: 350 },
      { x: 350, y: 500 },
      { x: 550, y: 500 },
      { x: 350, y: 650 },
      { x: 550, y: 650 },
    ];
  }

  protected getWaveConfig(wave: number): { enemyType: string; count: number; delay: number; health: number; speed: number; moneyValue: number }[] {
    if (wave === 1) {
      const waveConfig = [];
      // Final, intense wave with very high counts of all enemy types.
      // 50x Enemy1, 20x Enemy2, 5x Enemy3
      for (let i = 0; i < 10; i++) {
        waveConfig.push(
          { enemyType: 'enemy1', count: 5, delay: 500, health: 100, speed: 50, moneyValue: 10 },
          { enemyType: 'enemy2', count: 2, delay: 500, health: 50, speed: 100, moneyValue: 15 }
        );
      }
      waveConfig.push(
        { enemyType: 'enemy3', count: 5, delay: 1000, health: 500, speed: 25, moneyValue: 50 }
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
    return "Level1"; // Loop back to Level1 for now, or a dedicated WinScene
  }
}
