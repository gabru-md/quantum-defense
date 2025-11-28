import { Component } from '../core/Component';
import * as Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from './Util.ts';
import { Player } from '../entities/Player.ts';

/**
 * A script that moves a GameObject based on WASD keyboard input.
 */
export class PlayerController extends Component {
    public speed: number = 175; // pixels per second
    private keys!: {
        w: Phaser.Input.Keyboard.Key;
        a: Phaser.Input.Keyboard.Key;
        s: Phaser.Input.Keyboard.Key;
        d: Phaser.Input.Keyboard.Key;
    };
    private inactivityTimer: number = 0;
    private readonly inactivityThreshold: number = 10000; // 5 seconds

    public start(): void {
        if (this.gameObject.scene.input.keyboard) {
            this.keys = this.gameObject.scene.input.keyboard.addKeys({
                w: Phaser.Input.Keyboard.KeyCodes.W,
                a: Phaser.Input.Keyboard.KeyCodes.A,
                s: Phaser.Input.Keyboard.KeyCodes.S,
                d: Phaser.Input.Keyboard.KeyCodes.D,
            }) as {
                w: Phaser.Input.Keyboard.Key;
                a: Phaser.Input.Keyboard.Key;
                s: Phaser.Input.Keyboard.Key;
                d: Phaser.Input.Keyboard.Key;
            };
        }
    }

    public update(_time: number, deltaTime: number): void {
        const speed = this.speed * this.gameObject.scene.time.timeScale;
        const body = this.gameObject.body as Phaser.Physics.Arcade.Body;
        if (!this.keys || !body) {
            return;
        }

        let moved = false;
        body.setVelocity(0);

        if (this.keys.a.isDown) {
            body.setVelocityX(-speed);
            moved = true;
        } else if (this.keys.d.isDown) {
            body.setVelocityX(speed);
            moved = true;
        }

        if (this.keys.w.isDown) {
            body.setVelocityY(-speed);
            moved = true;
        } else if (this.keys.s.isDown) {
            body.setVelocityY(speed);
            moved = true;
        }

        if (moved) {
            this.inactivityTimer = 0;
            this.gameObject.scene.events.emit('playerMoved');
        } else {
            this.inactivityTimer += deltaTime;
            if (this.inactivityTimer >= this.inactivityThreshold) {
                let player = this.gameObject as Player;
                player.warn("Hey, Guardian! Are you there?")
                player.shake();
                this.inactivityTimer = 0; // Reset timer to avoid continuous alerts
            }
        }

        // Normalize the velocity to prevent faster diagonal movement
        body.velocity.normalize().scale(speed);

        // Keep player within game bounds (GAME_AREA_WIDTH)
        this.gameObject.x = Phaser.Math.Clamp(
            this.gameObject.x,
            this.gameObject.width / 2,
            GAME_WIDTH - this.gameObject.width / 2
        );
        this.gameObject.y = Phaser.Math.Clamp(
            this.gameObject.y,
            this.gameObject.height / 2,
            GAME_HEIGHT - this.gameObject.height / 2
        );
    }
}
