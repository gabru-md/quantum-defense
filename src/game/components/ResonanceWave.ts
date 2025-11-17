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
    private baseActivationEnergy: number = PlayerConfig.resonanceWave.baseActivationEnergy; // Renamed: Cost to activate the wave
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
            console.log(`[ResonanceWave] E pressed at time: ${time}`);
            if (this.isOnCooldown(time)) {
                console.log(`[ResonanceWave] On cooldown. Last activated: ${this.lastActivated}, Cooldown time: ${this.cooldownTime}`);
                this.gameObject.level.hud.alert(
                    'ABILITY COOLDOWN:\nResonance Wave is on cooldown!', // Updated message
                    AppColors.UI_MESSAGE_WARN
                );
                return;
            }

            // Check for base activation energy
            if (this.gameObject.level.state.energy < this.baseActivationEnergy) {
                console.log(`[ResonanceWave] Insufficient energy. Current: ${this.gameObject.level.state.energy}, Needed: ${this.baseActivationEnergy}`);
                this.gameObject.level.hud.alert(
                    `INSUFFICIENT ENERGY:\nNeed ${this.baseActivationEnergy} energy to activate Resonance Wave!`,
                    AppColors.UI_MESSAGE_WARN,
                    1000
                );
                return;
            }

            // Deduct base activation energy
            this.gameObject.level.state.energy -= this.baseActivationEnergy;
            this.gameObject.level.hud.update();
            this.lastActivated = time; // Set lastActivated here after energy check
            console.log(`[ResonanceWave] Activated. Energy deducted: ${this.baseActivationEnergy}, New energy: ${this.gameObject.level.state.energy}`);


            if (nearestTower && (nearestTower.isNotFullHealth() || nearestTower.isTowerDeactivated())) {
                const distance = Phaser.Math.Distance.Between(
                    this.gameObject.x,
                    this.gameObject.y,
                    nearestTower.x,
                    nearestTower.y
                );
                if (distance <= this.activationRange) {
                    console.log(`[ResonanceWave] Activating for tower revive/repair. Tower: ${nearestTower.texture.key}`);
                    this.activateWave(nearestTower);
                } else {
                    console.log(`[ResonanceWave] Activating for special enemy damage (nearest tower out of range).`);
                    this.activateWave();
                }
            } else {
                // If no deactivated tower is nearby or in range, activate wave to damage special enemies
                console.log(`[ResonanceWave] Activating for special enemy damage (no eligible tower nearby).`);
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
        console.log(`[ResonanceWave] Visual wave effect created.`);
        const pulseColor = tower ? tower.tintTopLeft : PlayerConfig.resonanceWave.pulseColor;

        createWaveEffect(
            this.gameObject.scene,
            this.gameObject.x,
            this.gameObject.y,
            this.gameObject.width,
            getResonanceWaveConfig(this.activationRange, pulseColor)
        );
        this.gameObject.scene.events.emit('resonanceWave', this.gameObject.x, this.gameObject.y, this.activationRange);

        if (tower && (tower.isNotFullHealth() || tower.isTowerDeactivated())) {
            const reviveEnergyCost = tower.energyCost; // This is the additional cost for reviving
            console.log(`[ResonanceWave] Attempting to revive tower. Revive cost: ${reviveEnergyCost}, Current energy: ${this.gameObject.level.state.energy}`);
            if (this.gameObject.level.state.energy >= reviveEnergyCost) { // Updated state.money to state.energy
                this.gameObject.level.state.energy -= reviveEnergyCost; // Updated state.money to state.energy
                this.gameObject.level.hud.update();
                console.log(`[ResonanceWave] Revive energy deducted. New energy: ${this.gameObject.level.state.energy}`);


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
                        tower.enableVisualPulse()
                        tower.setOriginalPulseColor();
                        console.log(`[ResonanceWave] Tower fully revived: ${tower.texture.key}`);
                    } else {
                        console.log(`[ResonanceWave] Tower partially revived. Progress: ${tower.reviveProgress}`);
                    }
                }
            } else {
                const energyNeededToRevive = reviveEnergyCost - this.gameObject.level.state.energy; // Renamed
                this.gameObject.level.hud.alert(
                    `INSUFFICIENT ENERGY:\nNeed ${energyNeededToRevive} energy to fully revive tower!`, // Updated message
                    AppColors.UI_MESSAGE_WARN,
                    1000
                );
                // If not enough energy for full revive, refund base activation energy
                this.gameObject.level.state.energy += this.baseActivationEnergy;
                this.gameObject.level.hud.update();
                console.log(`[ResonanceWave] Insufficient energy for full revive. Refunded base activation energy. New energy: ${this.gameObject.level.state.energy}`);
            }
        }

        this.specialEnemiesGroup = this.gameObject.level.waveManager.specialEnemies;
        // Damage special enemies within range
        // @ts-ignore
        this.specialEnemiesGroup.children.each((specialEnemyObject: Phaser.GameObjects.GameObject) => {
            if (specialEnemyObject instanceof SpecialEnemy) {
                const specialEnemy = specialEnemyObject as SpecialEnemy;
                console.log(`[ResonanceWave] Checking SpecialEnemy: ${specialEnemy.texture.key}`);
                const distance = Phaser.Math.Distance.Between(
                    this.gameObject.x,
                    this.gameObject.y,
                    specialEnemy.x,
                    specialEnemy.y
                );
                console.log(`[ResonanceWave] Distance to SpecialEnemy: ${distance}, Activation Range: ${this.activationRange}`);
                if (distance <= this.activationRange) {
                    const healthComponent = specialEnemy.getComponent(Health);
                    if (healthComponent) {
                        console.log(`[ResonanceWave] Applying ${this.waveDamage} damage to SpecialEnemy. Current health: ${healthComponent.currentHealth}`);
                        healthComponent.takeDamage(this.waveDamage);
                    }
                } else {
                    console.log(`[ResonanceWave] SpecialEnemy out of range, skipping damage.`);
                }
            }
        });
    }
}
