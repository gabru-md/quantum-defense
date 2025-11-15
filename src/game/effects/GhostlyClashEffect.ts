import * as Phaser from 'phaser';
import {AppColors, phaserColor} from '../scripts/Colors.ts';
import {GAME_HEIGHT, GAME_WIDTH} from '../scripts/Util.ts';

export class GhostlyClashEffect {
    private scene: Phaser.Scene;
    private guardianEchoes!: Phaser.Physics.Arcade.Group;
    private phantomEchoes!: Phaser.Physics.Arcade.Group;
    private spawnTimer!: Phaser.Time.TimerEvent;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public start(): void {
        // Create physics groups for the echoes
        this.guardianEchoes = this.scene.physics.add.group({
            defaultKey: 'player',
            maxSize: 10,
        });
        this.phantomEchoes = this.scene.physics.add.group({
            defaultKey: 'specialEnemy',
            maxSize: 10,
        });

        // Set up the collision between the two groups
        this.scene.physics.add.overlap(
            this.guardianEchoes,
            this.phantomEchoes,
            this.handleAnnihilation as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );

        // Start a timer to spawn echoes periodically
        this.spawnTimer = this.scene.time.addEvent({
            delay: 2000, // Spawn an echo every 2 seconds
            callback: this.spawnEcho,
            callbackScope: this,
            loop: true,
        });
    }

    public stop(): void {
        if (this.spawnTimer) {
            this.spawnTimer.destroy();
        }
        this.guardianEchoes.destroy(true);
        this.phantomEchoes.destroy(true);
    }

    private spawnEcho(): void {
        const isGuardian = Phaser.Math.Between(0, 1) === 0;
        const group = isGuardian ? this.guardianEchoes : this.phantomEchoes;
        const color = isGuardian ? phaserColor(AppColors.PLAYER) : phaserColor(AppColors.SPECIAL_ENEMY);
        const texture = isGuardian ? 'player' : 'specialEnemy';

        // Don't spawn if the group is full
        if (group.isFull()) {
            return;
        }

        const side = Phaser.Math.Between(0, 3);
        let x, y;
        if (side === 0) { // Top
            x = Phaser.Math.Between(0, GAME_WIDTH);
            y = -50;
        } else if (side === 1) { // Right
            x = GAME_WIDTH + 50;
            y = Phaser.Math.Between(0, GAME_HEIGHT);
        } else if (side === 2) { // Bottom
            x = Phaser.Math.Between(0, GAME_WIDTH);
            y = GAME_HEIGHT + 50;
        } else { // Left
            x = -50;
            y = Phaser.Math.Between(0, GAME_HEIGHT);
        }

        const echo = group.get(x, y, texture) as Phaser.Physics.Arcade.Sprite;
        if (!echo) {
            return;
        }

        echo.setActive(true)
            .setVisible(true)
            .setAlpha(this.getAlpha(group))
            .setTint(color)
            .setDepth(-1) // Ensure it's in the background
            .setScale(Phaser.Math.FloatBetween(0.3, 0.8));

        // Tween the echo across the screen
        const targetX = Phaser.Math.Between(0, GAME_WIDTH);
        const targetY = Phaser.Math.Between(0, GAME_HEIGHT);
        this.scene.tweens.add({
            targets: echo,
            x: targetX,
            y: targetY,
            alpha: 0, // Fade completely to 0
            duration: Phaser.Math.Between(10000, 15000), // Slow drift
            ease: 'Sine.easeInOut',
            onComplete: () => {
                // Remove from group, freeing up space for new echoes
                group.killAndHide(echo);
            },
        });
    }

    private handleAnnihilation(
        guardian: Phaser.GameObjects.GameObject,
        phantom: Phaser.GameObjects.GameObject
    ): void {
        const g = guardian as Phaser.Physics.Arcade.Sprite;
        const p = phantom as Phaser.Physics.Arcade.Sprite;


        // Remove the colliding echoes
        this.guardianEchoes.killAndHide(g);
        this.phantomEchoes.killAndHide(p);

        // Create a brief, bright pulse at the collision point
        const pulse = this.scene.add.circle(g.x, g.y, 10, phaserColor(AppColors.SPECIAL_ENEMY_WAVE_PULSE), 0.3).setDepth(-1);
        this.scene.tweens.add({
            targets: pulse,
            radius: 20,
            alpha: 0,
            duration: 200,
            ease: 'Sine.easeOut',
            onComplete: () => {
                pulse.destroy();
            },
        });

    }

    private getAlpha(group: Phaser.Physics.Arcade.Group) {
        if (group === this.guardianEchoes) {
            return 0.2
        }
        return 0.5;
    }
}
