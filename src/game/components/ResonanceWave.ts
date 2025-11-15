import { Component } from '../core/Component';
import * as Phaser from 'phaser';
import { FindNearestTower } from './FindNearestTower.ts';
import { Tower } from '../entities/Tower.ts';
import { Health } from './Health.ts';
import { LaserAttack } from './LaserAttack.ts';
import { BombAttack } from './BombAttack.ts';
import { AppColors } from '../scripts/Colors.ts';
import { SpecialEnemy } from '../entities/SpecialEnemy.ts';
import { createWaveEffect } from '../utils/WaveEffectHelper.ts';
import { getResonanceWaveConfig } from '../config/WaveConfig.ts';
import { PlayerConfig } from '../config/PlayerConfig.ts';

/**
 * A component that allows the player to activate a wave to revive deactivated towers or damage special enemies.
 */
export class ResonanceWave extends Component {
    private keys!: { e: Phaser.Input.Keyboard.Key };
    private cooldownTime: number = PlayerConfig.resonanceWave.cooldownTime;
    private lastActivated: number = 0;
    public activationRange: number = PlayerConfig.resonanceWave.activationRange; // Made public for VisualPulse
    private waveDamage: number = PlayerConfig.resonanceWave.waveDamage;
    private baseActivationCost: number = PlayerConfig.resonanceWave.baseActivationCost; // New: Cost to activate the wave
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
            throw new Error(
                'PlayerWaveAmplifier component requires a FindNearestTower component on the same GameObject.'
            );
        }
        this.findNearestTowerComponent = findNearest;
    }

    public update(time: number, _deltaTime: number): void {
        const nearestTower = this.findNearestTowerComponent.nearestTower;

        if (this.playerPressedKey(time)) {
            if (this.isOnCooldown(time)) {
                this.gameObject.level.hud.alert(
                    'ABILITY COOLDOWN:\nWave Amplifier is on cooldown!',
                    AppColors.UI_MESSAGE_WARN
                );
                return;
            }

            // Check for base activation cost
            if (this.gameObject.level.state.money < this.baseActivationCost) {
                this.gameObject.level.hud.alert(
                    `INSUFFICIENT BALANCE:\nNeed $${this.baseActivationCost} to activate Resonance Wave!`,
                    AppColors.UI_MESSAGE_WARN,
                    1000
                );
                return;
            }

            // Deduct base activation cost
            this.gameObject.level.state.money -= this.baseActivationCost;
            this.gameObject.level.hud.update();
            this.lastActivated = time; // Set lastActivated here after cost check

            if (nearestTower && (nearestTower.isNotFullHealth() || nearestTower.isTowerDeactivated())) {
                const distance = Phaser.Math.Distance.Between(
                    this.gameObject.x,
                    this.gameObject.y,
                    nearestTower.x,
                    nearestTower.y
                );
                if (distance <= this.activationRange) {
                    this.activateWave(nearestTower);
                }
            } else {
                // If no deactivated tower is nearby or in range, activate wave to damage special enemies
                this.activateWave();
            }
        }
    }

    public isOnCooldown(time: number = this.gameObject.scene.time.now): boolean {
        return time < this.lastActivated + this.cooldownTime;
    }

    private playerPressedKey(_time: number) {
        return Phaser.Input.Keyboard.JustDown(this.keys.e);
    }

    private activateWave(tower?: Tower): void {
        const pulseColor = tower ? tower.tintTopLeft : PlayerConfig.resonanceWave.pulseColor;

        createWaveEffect(
            this.gameObject.scene,
            this.gameObject.x,
            this.gameObject.y,
            this.gameObject.width,
            getResonanceWaveConfig(this.activationRange, pulseColor)
        );

        if (tower && (tower.isNotFullHealth() || tower.isTowerDeactivated())) {
            const reviveCost = tower.cost; // This is the additional cost for reviving
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
                        const attackComponents = [
                            tower.getComponent(LaserAttack),
                            tower.getComponent(BombAttack),
                        ];
                        attackComponents.forEach((c) => {
                            if (c) c.enabled = true;
                        });
                        tower.reviveProgress = 0;
                        this.gameObject.scene.events.emit('towerRevived'); // Emit event for tutorial
                        tower.setOriginalPulseColor();
                    }
                }
            } else {
                const moneyNeededToRevive = reviveCost - this.gameObject.level.state.money;
                this.gameObject.level.hud.alert(
                    `INSUFFICIENT BALANCE:\nNeed $${moneyNeededToRevive} to fully revive tower!`,
                    AppColors.UI_MESSAGE_WARN,
                    1000
                );
                // If not enough money for full revive, refund base activation cost
                this.gameObject.level.state.money += this.baseActivationCost;
                this.gameObject.level.hud.update();
            }
        }

        this.specialEnemiesGroup = this.gameObject.level.waveManager.specialEnemies;
        // Damage special enemies within range
        // @ts-ignore
        this.specialEnemiesGroup.children.each((specialEnemyObject: Phaser.GameObjects.GameObject) => {
            if (specialEnemyObject instanceof SpecialEnemy) {
                const specialEnemy = specialEnemyObject as SpecialEnemy;
                const distance = Phaser.Math.Distance.Between(
                    this.gameObject.x,
                    this.gameObject.y,
                    specialEnemy.x,
                    specialEnemy.y
                );
                if (distance <= this.activationRange) {
                    const healthComponent = specialEnemy.getComponent(Health);
                    if (healthComponent) {
                        healthComponent.takeDamage(this.waveDamage);
                    }
                }
            }
        });
    }
}
