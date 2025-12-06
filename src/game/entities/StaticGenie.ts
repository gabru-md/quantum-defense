import {Genie} from "./Genie.ts";
import {GameObject} from "../core/GameObject.ts";
import Phaser from "phaser";

export class StaticGenie extends Genie {
    // Marker for making collision
    constructor(scene: Phaser.Scene, player: GameObject, texture: string = 'static_genie_texture') {
        super(scene, player, texture);
        this.scene.physics.world.enable(this);
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true);
    }

    destroy(fromScene?: boolean) {
        this.components.forEach(component => {
            this.deleteComponent(component);
        })
        super.destroy(fromScene);
    }
}