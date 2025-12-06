import {GameObject} from '../core/GameObject';
import * as Phaser from 'phaser';
import {Health} from '../components/Health';
import {VisualPulse} from '../components/VisualPulse';
import {SpecialEnemyConfig} from '../config/EnemyConfigs';
import {PlayerConfig} from "../config/PlayerConfig.ts";
import {StaticAttackComponent} from "../components/StaticAttackComponent.ts";
import {StaticGenie} from "./StaticGenie.ts";
import {PlayerFollowerComponent} from "../components/PlayerFollowerComponent.ts";

export interface StaticEnemyConfig {
    scene: Phaser.Scene;
    x: number;
    y: number;
    texture: string;
    health: number;
    name: string;
}

export class StaticEnemy extends GameObject {
    private healthComponent!: Health;
    staticGenies: Phaser.GameObjects.Group;
    attackComponent: StaticAttackComponent;
    playerFollower: PlayerFollowerComponent;

    constructor(config: StaticEnemyConfig) {
        super(config.scene, config.x, config.y, config.texture);
        config.scene.physics.world.enable(this);
        this.staticGenies = this.level.add.group({classType: StaticGenie, runChildUpdate: true});
        this.healthComponent = new Health(config.health);
        this.addComponent(this.healthComponent);

        // The 'died' event is emitted by the Health component, not the GameObject itself.
        // The Level scene will listen for 'staticCoreDestroyed' event.
        this.on('died', () => {
            this.scene.events.emit('staticCoreDestroyed');
            this.destroy();
        });

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
        this.setDepth(101);
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

    // Public method to allow external components (like bullets) to deal damage
    public takeDamage(amount: number) {
        this.healthComponent.takeDamage(amount);
    }
}