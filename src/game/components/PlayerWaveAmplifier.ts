import {Component} from '../core/Component';
import * as Phaser from 'phaser';
import {FindNearestTower} from "./FindNearestTower.ts";
import {Tower} from "../entities/Tower.ts";
import {Health} from "./Health.ts";
import {LaserAttack} from "./LaserAttack.ts";
import {BombAttack} from "./BombAttack.ts";
import {VisualPulse} from "./VisualPulse.ts";
import {AppColors, phaserColor} from "../scripts/Colors.ts";
import {SpecialEnemy} from "../entities/SpecialEnemy.ts"; // Import SpecialEnemy

/**
 * A component that allows the player to activate a wave to revive deactivated towers or damage special enemies.
 */
export class PlayerWaveAmplifier extends Component {
    private keys!: { e: Phaser.Input.Keyboard.Key };
    private cooldownTime: number = 1000; // 1 second cooldown
    private lastActivated: number = 0;
    private activationRange: number = 48; // Range to be near a tower to revive it
    private waveDamage: number = 50; // Damage dealt by the wave to special enemies
    private findNearestTowerComponent!: FindNearestTower;
    private specialEnemiesGroup!: Phaser.GameObjects.Group; // Reference to special enemies group

    constructor(specialEnemiesGroup: Phaser.GameObjects.Group) {
        super();
        this.specialEnemiesGroup = specialEnemiesGroup;
    }

    public start(): void {
        if (this.gameObject.scene.input.keyboard) {
            this.keys = this.gameObject.scene.input.keyboard.addKeys({
                e: Phaser.Input.Keyboard.KeyCodes.E,
            }) as { e: Phaser.Input.Keyboard.Key };
        }
        const findNearest = this.gameObject.getComponent(FindNearestTower);
        if (!findNearest) {
            throw new Error('PlayerWaveAmplifier component requires a FindNearestTower component on the same GameObject.');
        }
        this.findNearestTowerComponent = findNearest;
    }

    public update(time: number, _deltaTime: number): void {
        const nearestTower = this.findNearestTowerComponent.nearestTower;

        if (this.playerPressedKey(time)) {
            if (this.hasCooldownExpired(time)) {
                if (nearestTower && (nearestTower.isNotFullHealth() || nearestTower.isTowerDeactivated())) {
                    const distance = Phaser.Math.Distance.Between(this.gameObject.x, this.gameObject.y, nearestTower.x, nearestTower.y);
                    if (distance <= this.activationRange) {
                        this.activateWave(nearestTower);
                        this.lastActivated = time;
                    }
                } else {
                    // If no deactivated tower is nearby or in range, activate wave to damage special enemies
                    this.activateWave();
                    this.lastActivated = time;
                }
            } else {
                this.gameObject.level.hud.alert('ABILITY COOLDOWN:\nWave Amplifier is on cooldown!', AppColors.UI_MESSAGE_WARN)
            }
        }
    }

    private playerPressedKey(_time: number) {
        return Phaser.Input.Keyboard.JustDown(this.keys.e);
    }

    private hasCooldownExpired(time: number) {
        return time > this.lastActivated + this.cooldownTime;
    }

    private activateWave(tower?: Tower): void {
        console.log(this.gameObject.width)
        const totalPulses = 4;
        const pulseDelay = 150;
        const pulseDuration = 1000;
        const pulseColor = tower ? tower.tintTopLeft : phaserColor(AppColors.PLAYER_WAVE_PULSE);

        for (let i = 0; i < totalPulses; i++) {
            this.gameObject.scene.time.delayedCall(i * pulseDelay, () => {
                const graphics = this.gameObject.scene.add.graphics({
                    fillStyle: {color: pulseColor, alpha: 0.3},
                    lineStyle: {width: 0.5, color: pulseColor, alpha: 0.8}
                });

                graphics.setDepth(10);
                graphics.x = this.gameObject.x;
                graphics.y = this.gameObject.y;

                this.gameObject.scene.tweens.add({
                    targets: graphics,
                    scale: 2,
                    alpha: 0,
                    duration: pulseDuration,
                    ease: 'Sine.easeOut',
                    onUpdate: (_tween, target) => {
                        graphics.clear();
                        graphics.lineStyle(1, pulseColor, target.alpha * 0.8);
                        graphics.fillStyle(pulseColor, target.alpha * 0.3);
                        const radius = (this.gameObject.width / 2) * target.scale;
                        graphics.fillCircle(0, 0, radius);
                        graphics.strokeCircle(0, 0, radius);
                    },
                    onComplete: () => {
                        graphics.destroy();
                    }
                });
            });
        }

        if (tower && tower.isNotFullHealth()) {
            const reviveCost = tower.cost;
            if (this.gameObject.level.state.money >= reviveCost) {
                this.gameObject.level.state.money -= reviveCost;
                this.gameObject.level.hud.update();

                tower.scene.physics.world.enable(tower);
                tower.reviveProgress = (tower.reviveProgress || 0) + 1;
                const healthComponent = tower.getComponent(Health);
                if (healthComponent) {
                    const newAlpha = 0.5 + (tower.reviveProgress / 3) * 0.5;
                    tower.setAlpha(newAlpha);

                    if (tower.reviveProgress >= 3) {
                        healthComponent._currentHealth = healthComponent.maxHealth;
                        tower.setActive(true);
                        tower.setAlpha(1);
                        tower.getComponent(VisualPulse)?.start();
                        const attackComponents = [tower.getComponent(LaserAttack), tower.getComponent(BombAttack), tower.getComponent(VisualPulse)];
                        attackComponents.forEach(c => {
                            if (c) c.enabled = true;
                        });
                        tower.reviveProgress = 0;
                        this.gameObject.scene.events.emit('towerRevived');
                        tower.setOriginalPulseColor();
                    }
                }
            } else {
                const moneyNeededToRevive = reviveCost - this.gameObject.level.state.money;
                this.gameObject.level.hud.alert(`INSUFFICIENT BALANCE:\nNeed $${moneyNeededToRevive} to revive tower!`, AppColors.UI_MESSAGE_WARN, 1000);
            }
        }

        this.specialEnemiesGroup = this.gameObject.level.waveManager.specialEnemies;
        // Damage special enemies within range
        // @ts-ignore
        this.specialEnemiesGroup.children.each((specialEnemyObject: Phaser.GameObjects.GameObject) => {
            if (specialEnemyObject instanceof SpecialEnemy) {
                const specialEnemy = specialEnemyObject as SpecialEnemy;
                const distance = Phaser.Math.Distance.Between(this.gameObject.x, this.gameObject.y, specialEnemy.x, specialEnemy.y);
                console.log(specialEnemy, distance);
                if (distance <= this.activationRange) {
                    const healthComponent = specialEnemy.getComponent(Health);
                    if (healthComponent) {
                        healthComponent.takeDamage(this.waveDamage);
                        console.log('doing damage')
                    }
                }
            }
        });

    }
}
