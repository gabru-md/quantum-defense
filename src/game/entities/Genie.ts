import {GameObject} from '../core/GameObject.ts';
import {CircularMovement} from '../components/CircularMovement.ts';
import {PlayerConfig} from '../config/PlayerConfig.ts';

export class Genie extends GameObject {
    constructor(scene: Phaser.Scene, player: GameObject, texture: string = 'genie_texture') {
        super(scene, player.x, player.y, texture);

        this.addComponent(
            new CircularMovement(
                player,
                PlayerConfig.genie.orbitRadius,
                PlayerConfig.genie.orbitSpeed
            )
        );
    }

    public setOrbitStats(orbitRadius: number, orbitSpeed: number) {
        this.getComponent(CircularMovement)?.setRadius(orbitRadius);
        this.getComponent(CircularMovement)?.setSpeed(orbitSpeed);
    }
}
