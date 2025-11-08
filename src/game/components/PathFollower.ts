import { Component } from '../core/Component';
import * as Phaser from 'phaser';

/**
 * A component that makes a GameObject follow a Phaser.Curves.Path.
 */
export class PathFollower extends Component {
  private path: Phaser.Curves.Path;
  private speed: number;
  private pathPosition: number = 0; // A value from 0 (start) to 1 (end)

  constructor(path: Phaser.Curves.Path, speed: number) {
    super();
    this.path = path;
    this.speed = speed;
  }

  public update(deltaTime: number): void {
    const pathLength = this.path.getLength();
    const distance = (this.speed * deltaTime) / 1000;
    this.pathPosition += distance / pathLength;

    if (this.pathPosition >= 1) {
      this.pathPosition = 1;
      this.gameObject.emit('reachedEnd');
      this.gameObject.destroy();
    }

    const point = this.path.getPoint(this.pathPosition);
    if (point) {
      this.gameObject.setPosition(point.x, point.y);
    }
  }
}
