import { Component } from '../core/Component';
import * as Phaser from 'phaser';

/**
 * A simple script that moves a GameObject based on keyboard input, using Phaser's input system.
 * Attach this to a GameObject to make it controllable by the player.
 */
export class PlayerController extends Component {
  public speed: number = 200; // pixels per second
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  public start(): void {
    // Use the scene's input system to create cursor keys
    if (this.gameObject.scene.input.keyboard) {
        this.cursors = this.gameObject.scene.input.keyboard.createCursorKeys();
    }
  }

  public update(_deltaTime: number): void {
    // It's often easier to work with a normalized velocity vector
    const body = this.gameObject.body as Phaser.Physics.Arcade.Body;
    if (!this.cursors || !body) {
      return;
    }

    body.setVelocity(0);

    if (this.cursors.left.isDown) {
      body.setVelocityX(-this.speed);
    } else if (this.cursors.right.isDown) {
      body.setVelocityX(this.speed);
    }

    if (this.cursors.up.isDown) {
      body.setVelocityY(-this.speed);
    } else if (this.cursors.down.isDown) {
      body.setVelocityY(this.speed);
    }
    
    // Normalize the velocity to prevent faster diagonal movement
    body.velocity.normalize().scale(this.speed);
  }
}
