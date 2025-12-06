import { Component } from '../core/Component.ts';
import * as Phaser from 'phaser';

export class PlayerFollowerComponent extends Component {
    /**
     * The speed of the follow. A small number creates a lazy, smooth follow.
     * A value of 1 would be an instant teleport.
     * @default 0.05
     */
    public followSpeed: number = 5 * 1e-4;


    constructor() {
        super();
    }

    update(_time: number, delta: number): void {
        const player = this.gameObject.level.playerManager.player;
        if (!player || !player.body) {
            return;
        }

        // 1. Determine the desired position for the follower.
        // This should be a point directly behind the player.
        const desiredPosition = new Phaser.Math.Vector2(player.x, player.y);


        // 2. Use Linear Interpolation (lerp) to smoothly move towards the desired position.
        // This moves the follower a small fraction of the distance each frame.
        const newX = Phaser.Math.Linear(this.gameObject.x, desiredPosition.x, this.followSpeed * (delta / 16.67)); // Normalize speed based on 60fps
        const newY = Phaser.Math.Linear(this.gameObject.y, desiredPosition.y, this.followSpeed * (delta / 16.67));

        this.gameObject.setPosition(newX, newY);
    }
}