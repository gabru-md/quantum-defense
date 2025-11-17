import {GameObject} from '../core/GameObject';
import {PlayerController} from '../scripts/PlayerController';
import * as Phaser from 'phaser';
import {BreatheOnHover} from '../components/BreatheOnHover.ts';
import {VisualPulse} from "../components/VisualPulse.ts"; // Import BreatheOnHover
import {Genie} from "./Genie.ts";
import {Health} from "../components/Health.ts";

export interface PlayerConfig {
    scene: Phaser.Scene;
    x: number;
    y: number;
    texture: string;
}

export class Player extends GameObject {
    public genie: Genie;
    private healthComponent: Health;

    constructor(config: PlayerConfig) {
        super(config.scene, config.x, config.y, config.texture);

        // Enable physics for the player
        config.scene.physics.world.enable(this);
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true); // Keep player within game bounds
        body.setDrag(350); // Add some drag for smoother movement
        this.setAlpha(0.8);

        // Add components
        this.addComponent(new PlayerController());
        this.addComponent(new BreatheOnHover(1.2, 1000));
        this.healthComponent = new Health(100); // Player has 100 health
        this.addComponent(this.healthComponent);

        // Create and add the Genie
        this.genie = new Genie(config.scene, this);
        config.scene.add.existing(this.genie);
    }

    public setVisible(value: boolean): this {
        // if player has visualpulse then set it's visible to same as well
        const visualPulse = this.getComponent(VisualPulse);
        if (visualPulse) {
            visualPulse.enabled = value;
        }
        if (this.genie) {
            this.genie.setVisible(value);
        }
        return super.setVisible(value);
    }

    public takeDamage(amount: number): void {
        this.healthComponent.takeDamage(amount);
        // You can add visual feedback here, like a screen flash or a sound effect
        this.scene.cameras.main.flash(250, 255, 0, 0);
    }

    destroy(fromScene?: boolean) {
        if (this.genie) {
            this.genie.destroy(fromScene);
        }
        for(let component of this.components) {
            component.enabled = false;
        }
        super.destroy(fromScene);
    }
}
