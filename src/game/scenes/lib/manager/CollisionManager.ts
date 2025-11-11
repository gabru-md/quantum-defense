import {Level} from "../Level.ts";
import {Bullet} from "../../../entities/Bullet.ts";
import Phaser from "phaser";
import {GameObject} from "../../../core/GameObject.ts";
import {Enemy} from "../../../entities/Enemy.ts";
import {Bomb} from "../../../entities/Bomb.ts";
import {Healer} from "../../../entities/Healer.ts";
import {Player} from "../../../entities/Player.ts";
import {Manager} from "../Manager.ts";
import {Tower} from "../../../entities/Tower.ts";

export class CollisionManager extends Manager {
    constructor(protected level: Level) {
        super(level);
    }

    public setup() {
        // @ts-ignore
        this.level.physics.add.overlap(this.level.towerManager.bullets, this.level.waveManager.enemies, this.handleBulletEnemyCollision, undefined, this);
        // @ts-ignore
        this.level.physics.add.overlap(this.level.towerManager.bullets, this.level.waveManager.healers, this.handleBulletHealerCollision, undefined, this);
        // @ts-ignore
        this.level.physics.add.overlap(this.level.towerManager.bombs, this.level.waveManager.enemies, this.handleBombEnemyCollision, undefined, this);
        // @ts-ignore
        this.level.physics.add.overlap(this.level.towerManager.bombs, this.level.waveManager.healers, this.handleBombHealerCollision, undefined, this);
        // @ts-ignore
        this.level.physics.add.overlap(this.level.towerManager.bullets, this.level.playerManager.player, this.handleBulletPlayerCollision, undefined, this);
        // @ts-ignore
        this.level.physics.add.overlap(this.level.towerManager.bullets, this.level.towerManager.towers, this.handleBulletTowerCollision, undefined, this)
    }

    protected handleBulletEnemyCollision(bullet: Bullet, enemyObject: Phaser.GameObjects.GameObject): void {
        if (enemyObject instanceof GameObject) {
            const enemy = enemyObject as Enemy;
            bullet.applyDamage(enemy);
        } else {
            console.warn("Collision detected with an object not recognized as a custom GameObject:", enemyObject);
        }
    }

    protected handleBombEnemyCollision(bombObject: Phaser.GameObjects.GameObject): void {
        if (bombObject instanceof Bomb) {
            const bomb = bombObject as Bomb;
            bomb.explode();
        }
    }

    protected handleBombHealerCollision(bombObject: Phaser.GameObjects.GameObject): void {
        if (bombObject instanceof Bomb) {
            const bomb = bombObject as Bomb;
            bomb.explode();
        }
    }

    protected handleBulletHealerCollision(bullet: Bullet, healerObject: Phaser.GameObjects.GameObject): void {
        if (healerObject instanceof GameObject) {
            const healer = healerObject as Healer;
            bullet.applyDamage(healer);
        } else {
            console.warn("Collision detected with an object not recognized as a custom GameObject:", healerObject);
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
}