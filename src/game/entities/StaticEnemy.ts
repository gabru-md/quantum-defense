import {GameObject} from '../core/GameObject';
import * as Phaser from 'phaser';
import {Health} from '../components/Health';
import {VisualPulse} from '../components/VisualPulse';
import {SpecialEnemyConfig} from '../config/EnemyConfigs';
import {PlayerConfig} from "../config/PlayerConfig.ts";
import {StaticAttackComponent} from "../components/StaticAttackComponent.ts";
import {StaticGenie} from "./StaticGenie.ts";
import {PlayerFollowerComponent} from "../components/PlayerFollowerComponent.ts";
import {ShakeComponent} from "../components/ShakeComponent.ts";
import {GAME_WIDTH} from "../scripts/Util.ts";
import {CircularMovement} from "../components/CircularMovement.ts";

export interface StaticEnemyConfig {
    scene: Phaser.Scene;
    x: number;
    y: number;
    texture: string;
    health: number;
    name: string;
}

export enum StaticHealthState {
    STEADY,
    DISRUPTION,
    VOLATILE,
    ERUPTION
}

export class StaticEnemy extends GameObject {
    healthComponent!: Health;
    staticGenies: Phaser.GameObjects.Group;
    attackComponent: StaticAttackComponent;
    playerFollower: PlayerFollowerComponent;
    staticHealthState: StaticHealthState = StaticHealthState.STEADY;

    constructor(config: StaticEnemyConfig) {
        super(config.scene, config.x, config.y, config.texture);
        config.scene.physics.world.enable(this);
        this.staticGenies = this.level.add.group({classType: StaticGenie, runChildUpdate: true});
        this.healthComponent = new Health(config.health);
        this.addComponent(this.healthComponent);

        this.on('died', () => {
            this.scene.events.emit('staticCoreDestroyed');
            this.destroy();
        });

        this.on('healthChanged', this.onHealthChanged, this);

        this.level.onHover(this, config.name);

        this.addComponent(
            new VisualPulse(
                SpecialEnemyConfig.pulseColor,
                PlayerConfig.resonanceWave.pulseDelay * 4,
                PlayerConfig.resonanceWave.pulseDuration,
                SpecialEnemyConfig.deactivationRadius * 5,
                PlayerConfig.resonanceWave.pulseTotalPulses,
                PlayerConfig.resonanceWave.pulseLineWidth
            )
        );

        this.addComponent(new ShakeComponent());
        this.setDepth(101);
    }

    public disappear(): void {
        this.scene.tweens.add({
            targets: this,
            x: -1000, // Move off-screen to the left
            duration: 2500,
            ease: 'Sine.easeOut',
            onStart: () => {
                this.setActive(false);
                this.staticGenies.setActive(false);
            },
            onComplete: () => {
                for (const genie of this.staticGenies.getChildren() as StaticGenie[]) {
                    let circularMovementComponent = genie.getComponent(CircularMovement);
                    if (!circularMovementComponent) {
                        return;
                    }
                    circularMovementComponent.enabled = false;
                }
            }
        });
    }

    public reappear(): void {
        this.scene.tweens.add({
            targets: this,
            x: GAME_WIDTH / 3, // Assuming it reappears in the center
            duration: 2500,
            ease: 'Sine.easeOut',
            onStart: () => {
                this.setActive(true);
                this.staticGenies.setActive(true);
            },
            onComplete: () => {
                for (const genie of this.staticGenies.getChildren() as StaticGenie[]) {
                    let circularMovementComponent = genie.getComponent(CircularMovement);
                    if (!circularMovementComponent) {
                        return;
                    }
                    circularMovementComponent.enabled = true;
                }
            }
        });

    }

    public setupPlayerFollowerComponent() {
        this.playerFollower = new PlayerFollowerComponent();
        this.addComponent(this.playerFollower);
    }

    public setupAttackComponent() {
        this.attackComponent = new StaticAttackComponent();
        this.addComponent(this.attackComponent);
    }

    public attack(target: GameObject) {
        this.attackComponent.attack(target);
    }

    public takeDamage(amount: number) {
        this.healthComponent.takeDamage(amount);
    }

    private onHealthChanged(currentHealth: number) {
        const previousState = this.staticHealthState;
        let shakeTime = 1250;
        if (currentHealth >= 4000) {
            this.staticHealthState = StaticHealthState.STEADY;
        } else if (currentHealth >= 3000) {
            this.staticHealthState = StaticHealthState.DISRUPTION;
        } else if (currentHealth >= 2000) {
            this.staticHealthState = StaticHealthState.VOLATILE;
            shakeTime = 2500;
        } else {
            this.staticHealthState = StaticHealthState.ERUPTION;
            shakeTime = 5000;
            if (currentHealth <= 500) {
                // shake permanently when super low health
                shakeTime = -1;
            }
        }

        if (this.staticHealthState !== previousState) {
            this.scene.events.emit('staticHealthStateChanged', this.staticHealthState);
        }
        this.shake(shakeTime);
    }

    public shake(time: number = 1250): void {
        let shakeComponent = this.getComponent(ShakeComponent);
        if (shakeComponent) {
            shakeComponent.enabled = true;
            if (time === -1) {
                return;
            }
            this.scene.time.delayedCall(time, () => {
                shakeComponent.enabled = false;
            })
        }
    }

    public destroy() {
        if (this.staticGenies) {
            this.staticGenies.destroy(true);
        }
        this.components.forEach(component => {
            this.deleteComponent(component);
        })
        super.destroy();
    }
}
