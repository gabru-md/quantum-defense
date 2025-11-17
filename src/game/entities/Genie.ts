import { GameObject } from '../core/GameObject.ts';
import { Player } from './Player.ts';
import { CircularMovement } from '../components/CircularMovement.ts';
import { PlayerConfig } from '../config/PlayerConfig.ts';

export class Genie extends GameObject {
    constructor(scene: Phaser.Scene, player: Player) {
        super(scene, player.x, player.y, 'genie_texture');

        this.addComponent(
            new CircularMovement(
                player,
                PlayerConfig.genie.orbitRadius,
                PlayerConfig.genie.orbitSpeed
            )
        );
    }
}
