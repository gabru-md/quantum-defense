import { Level } from '../Level.ts';
import { Player } from '../../../entities/Player.ts';
import { FindNearestTower } from '../../../components/FindNearestTower.ts';
import { ResonanceWave } from '../../../components/ResonanceWave.ts';
import { VisualPulse } from '../../../components/VisualPulse.ts';
import { Manager } from '../Manager.ts';
import { GAME_HEIGHT, GAME_WIDTH } from '../../../scripts/Util.ts';
import { PlayerConfig } from '../../../config/PlayerConfig.ts';

export class PlayerManager extends Manager {
    player!: Player;

    constructor(protected level: Level) {
        super(level);
    }

    setup(): Player {
        this.player = new Player({ scene: this.level, x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2, texture: PlayerConfig.texture });
        this.player.addComponent(new FindNearestTower());
        const resonanceWave = new ResonanceWave(this.level.waveManager.specialEnemies);
        this.player.addComponent(resonanceWave); // Pass specialEnemies
        this.player.addComponent(
            new VisualPulse(
                PlayerConfig.resonanceWave.pulseColor,
                PlayerConfig.resonanceWave.pulseDelay,
                PlayerConfig.resonanceWave.pulseDuration,
                PlayerConfig.resonanceWave.activationRange, // Use activationRange as targetRadius
                PlayerConfig.resonanceWave.pulseTotalPulses,
                PlayerConfig.resonanceWave.pulseLineWidth,
                resonanceWave // Pass the resonanceWave instance
            )
        );
        this.level.add.existing(this.player);
        this.player.setDepth(150); // Set a high depth value to ensure it's on top
        this.player.on('pointerover', () =>
            this.level.hud.setHelpText('Player:\nHelp the towers and protect the base')
        );
        this.player.on('pointerout', () => this.level.hud.setHelpText(''));
        return this.player;
    }

    update(time: number, delta: number) {
        this.player.update(time, delta);
    }

    destroy(): void {
        this.player.destroy();
    }
}
