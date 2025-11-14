import {Level} from '../Level.ts';
import {Bullet} from '../../../entities/Bullet.ts';
import Phaser from 'phaser';
import {GameObject} from '../../../core/GameObject.ts';
import {Enemy} from '../../../entities/Enemy.ts';
import {Bomb} from '../../../entities/Bomb.ts';
import {SpecialEnemy} from '../../../entities/SpecialEnemy.ts'; // Import SpecialEnemy
import {Player} from '../../../entities/Player.ts';
import {Manager} from '../Manager.ts';
import {Tower} from '../../../entities/Tower.ts';

export class CollisionManager extends Manager {
    constructor(protected level: Level) {
        super(level);
    }

    public setup() {
        // @ts-ignore
        this.level.physics.add.overlap(
            this.level.towerManager.bullets,
            this.level.waveManager.enemies,
            this.handleBulletEnemyCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );
        this.level.physics.add.overlap(
            this.level.towerManager.bullets,
            this.level.waveManager.specialEnemies,
            this.handleBulletSpecialEnemyCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
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
            this.level.towerManager.bombs,
            this.level.waveManager.specialEnemies,
            this.handleBombSpecialEnemyCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
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

    protected handleBombSpecialEnemyCollision(
        bombObject: Phaser.GameObjects.GameObject,
        specialEnemyObject: Phaser.GameObjects.GameObject
    ): void {
        if (bombObject instanceof Bomb && specialEnemyObject instanceof SpecialEnemy) {
            const bomb = bombObject as Bomb;
            bomb.explode();
        }
    }

    protected handleBulletSpecialEnemyCollision(
        bullet: Bullet,
        specialEnemyObject: Phaser.GameObjects.GameObject
    ): void {
        if (specialEnemyObject instanceof GameObject) {
            const specialEnemy = specialEnemyObject as SpecialEnemy;
            bullet.applyDamage(specialEnemy);
        } else {
            console.warn(
                'Collision detected with an object not recognized as a custom GameObject:',
                specialEnemyObject
            );
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

    destroy() {
        // empty
    }
}
