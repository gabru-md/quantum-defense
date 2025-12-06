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
        shift: Phaser.Input.Keyboard.Key;
    };
    private inactivityTimer: number = 0;
    private readonly inactivityThreshold: number = 10000; // 10 seconds
    private isDashing: boolean = false;
    private dashCooldown: number = 0;
    private readonly DASH_COOLDOWN_TIME: number = 1000; // 1 second
    private readonly DASH_DURATION: number = 200; // milliseconds
    private readonly DASH_SPEED_MULTIPLIER: number = 2.0;

    public start(): void {
        if (this.gameObject.scene.input.keyboard) {
            this.keys = this.gameObject.scene.input.keyboard.addKeys({
                w: Phaser.Input.Keyboard.KeyCodes.W,
                a: Phaser.Input.Keyboard.KeyCodes.A,
                s: Phaser.Input.Keyboard.KeyCodes.S,
                d: Phaser.Input.Keyboard.KeyCodes.D,
                shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
            }) as {
                w: Phaser.Input.Keyboard.Key;
                a: Phaser.Input.Keyboard.Key;
                s: Phaser.Input.Keyboard.Key;
                d: Phaser.Input.Keyboard.Key;
                shift: Phaser.Input.Keyboard.Key;
            };
        }
    }

    public update(_time: number, deltaTime: number): void {
        if (this.dashCooldown > 0) {
            this.dashCooldown -= deltaTime;
        }

        const speed = this.speed * this.gameObject.scene.time.timeScale;
        const body = this.gameObject.body as Phaser.Physics.Arcade.Body;
        if (!this.keys || !body) {
            return;
        }

        let moved = false;
        let velocityX = 0;
        let velocityY = 0;

        // Gather input direction
        if (this.keys.a.isDown) {
            velocityX = -1;
            moved = true;
        } else if (this.keys.d.isDown) {
            velocityX = 1;
            moved = true;
        }

        if (this.keys.w.isDown) {
            velocityY = -1;
            moved = true;
        } else if (this.keys.s.isDown) {
            velocityY = 1;
            moved = true;
        }

        // Handle inactivity
        if (moved) {
            this.inactivityTimer = 0;
            this.gameObject.scene.events.emit('playerMoved');
        } else {
            this.inactivityTimer += deltaTime;
            if (this.inactivityTimer >= this.inactivityThreshold) {
                let player = this.gameObject as Player;
                player.warn("Hey, Guardian! Are you there?");
                player.shake();
                this.inactivityTimer = 0; // Reset timer to avoid continuous alerts
            }
        }

        // Dash logic - trigger dash
        if (this.keys.shift.isDown && !this.isDashing && this.dashCooldown <= 0 && moved) {
            this.isDashing = true;
            this.dashCooldown = this.DASH_COOLDOWN_TIME;

            // Set a timer to end the dash
            this.gameObject.scene.time.delayedCall(this.DASH_DURATION, () => {
                this.isDashing = false;
            });
        }

        // Apply velocity based on dash state
        if (moved) {
            // Create normalized direction vector
            const directionVector = new Phaser.Math.Vector2(velocityX, velocityY);
            directionVector.normalize();

            // Apply speed (with dash multiplier if dashing)
            const currentSpeed = this.isDashing ? speed * this.DASH_SPEED_MULTIPLIER : speed;
            body.setVelocity(
                directionVector.x * currentSpeed,
                directionVector.y * currentSpeed
            );
        } else {
            // Stop if not moving
            body.setVelocity(0);
        }

        // Keep player within game bounds
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