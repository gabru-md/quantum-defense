import {Level} from '../Level.ts';
import {Bullet} from '../../../entities/Bullet.ts';
import Phaser from 'phaser';
import {GameObject} from '../../../core/GameObject.ts';
import {Enemy} from '../../../entities/Enemy.ts';
import {Bomb} from '../../../entities/Bomb.ts';
import {Player} from '../../../entities/Player.ts';
import {Manager} from '../Manager.ts';
import {Tower} from '../../../entities/Tower.ts';
import {QuantumEcho} from "../../../entities/QuantumEcho.ts";
import {RiftWave} from "../../../entities/RiftWave.ts";
import {SpecialEnemy} from "../../../entities/SpecialEnemy.ts";
import {VisualPulse} from "../../../components/VisualPulse.ts";

export class CollisionManager extends Manager {
    constructor(protected level: Level) {
        super(level);
    }

    public setup() {
        // Existing collisions
        this.level.physics.add.overlap(
            this.level.towerManager.bullets,
            this.level.waveManager.enemies,
            this.handleBulletEnemyCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );
        this.level.physics.add.overlap(
            this.level.towerManager.bombs,
            this.level.waveManager.enemies,
            this.handleBombEnemyCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );
        this.level.physics.add.overlap(
            this.level.towerManager.bullets,
            this.level.playerManager.player,
            this.handleBulletPlayerCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );
        this.level.physics.add.overlap(
            this.level.towerManager.bullets,
            this.level.towerManager.towers,
            this.handleBulletTowerCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );

        // New collisions for rift system
        this.level.physics.add.overlap(
            this.level.playerManager.player,
            this.level.quantumEchoes,
            this.handlePlayerEchoCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );
        this.level.physics.add.overlap(
            this.level.riftWaves,
            this.level.towerManager.towers,
            this.handleRiftWaveTowerCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );
        this.level.physics.add.overlap(
            this.level.riftWaves,
            this.level.waveManager.specialEnemies,
            this.handleRiftWaveSpecialEnemyCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );
        this.level.physics.add.overlap(
            this.level.riftWaves,
            this.level.playerManager.player,
            this.handleRiftWavePlayerCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );
    }

    protected handleBulletEnemyCollision(bullet: Bullet, enemyObject: Phaser.GameObjects.GameObject): void {
        if (enemyObject instanceof GameObject) {
            const enemy = enemyObject as Enemy;
            bullet.applyDamage(enemy);
        } else {
            console.warn('Collision detected with an object not recognized as a custom GameObject:', enemyObject);
        }
    }

    protected handleBombEnemyCollision(bombObject: Phaser.GameObjects.GameObject): void {
        if (bombObject instanceof Bomb) {
            const bomb = bombObject as Bomb;
            bomb.explode();
        }
    }


    protected handleBulletPlayerCollision(bullet: Bullet, _player: Player): void {
        bullet.destroy();
    }

    protected handleBulletTowerCollision(bullet: Bullet, towerObject: Tower): void {
        if (bullet.source !== towerObject) {
            bullet.applyDamage(towerObject);
        }
    }

    protected handlePlayerEchoCollision(_player: Player, echo: QuantumEcho): void {
        // For now, just destroy the echo. In the future, you can add to a player's resource count.
        echo.destroy();
    }

    protected handleRiftWaveTowerCollision(wave: RiftWave, tower: Tower): void {
        console.log(wave.riftType);
        if (wave.riftType === 'static') {
            console.log(1);
            tower.deactivateTower();
        } else if (wave.riftType === 'player') {
            console.log(2);
            tower.enable();
        } else {
            console.log(3);
        }
    }

    protected handleRiftWaveSpecialEnemyCollision(wave: RiftWave, specialEnemy: SpecialEnemy): void {
        if (wave.riftType === 'player') {
            specialEnemy.takeDamage(9999); // Insta-kill
        }
    }

    protected handleRiftWavePlayerCollision(wave: RiftWave, player: Player): void {
        if (wave.riftType === 'static') {
            // Check if player is using resonance wave to negate
            const visualPulse = player.getComponent(VisualPulse);
            if (visualPulse && visualPulse.enabled) {
                // Player is safe
            } else {
                // Apply damage to player (you'll need a takeDamage method on Player)
                // player.takeDamage(10);
            }
        }
    }

    destroy() {
        // empty
    }
}
