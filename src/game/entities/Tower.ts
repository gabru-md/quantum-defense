import {GameObject} from '../core/GameObject';
import * as Phaser from 'phaser';
import {Health} from "../components/Health.ts";

export interface TowerConfig {
    scene: Phaser.Scene;
    x: number;
    y: number;
    texture: string;
}

export class Tower extends GameObject {
    public reviveProgress: number = 0;

    constructor(config: TowerConfig) {
        super(config.scene, config.x, config.y, config.texture);
        config.scene.physics.world.enable(this);
    }

    public isTowerDeactivated() {
        let healthComponent = this.getComponent(Health);
        return healthComponent && healthComponent.isDead() || this.reviveProgress > 0;
    }
}
