import * as Phaser from 'phaser';
import { BaseTowerDefenseLevel, GAME_HEIGHT, TOWER1_COST, TOWER2_COST } from './BaseTowerDefenseLevel';

export class Level1 extends BaseTowerDefenseLevel {
  constructor() {
    super('Level1'); // Unique key for this scene
  }

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
      case 'tower2':
        return TOWER2_COST;
      default:
        return 0;
    }
  }

  protected nextScene(): string {
      return "Level2";
  }
}
