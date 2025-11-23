import { Level } from '../Level.ts';
import { Player } from '../../../entities/Player.ts';
import { FindNearestTower } from '../../../components/FindNearestTower.ts';
import { ResonanceWave } from '../../../components/ResonanceWave.ts';
import { VisualPulse } from '../../../components/VisualPulse.ts';
import { Manager } from '../Manager.ts';
import {GAME_HEIGHT, GAME_WIDTH, TOWER_UPGRADE_QUANTUM_ECHO_REQUIREMENT} from '../../../scripts/Util.ts';
import { PlayerConfig } from '../../../config/PlayerConfig.ts';
import {QuantumEcho} from "../../../entities/QuantumEcho.ts";

export class PlayerManager extends Manager {
    player!: Player;

    tower1UpgradeProgress: number = 0;
    tower2UpgradeProgress: number = 0;
    tower3UpgradeProgress: number = 0;
    tower1Upgraded: boolean = false;
    tower2Upgraded: boolean = false;
    tower3Upgraded: boolean = false;

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
        this.player.info("Hey, Guardian!");
        return this.player;
    }

    collectQuantumEcho(echo: QuantumEcho) {
        const availableUpgrades = [];
        if (!this.tower1Upgraded) availableUpgrades.push('tower1');
        if (!this.tower2Upgraded) availableUpgrades.push('tower2');
        if (!this.tower3Upgraded) availableUpgrades.push('tower3');

        if (availableUpgrades.length > 0) {
            const randomUpgrade = availableUpgrades[Math.floor(Math.random() * availableUpgrades.length)];
            switch (randomUpgrade) {
                case 'tower1':
                    this.tower1UpgradeProgress++;
                    if (this.tower1UpgradeProgress >= TOWER_UPGRADE_QUANTUM_ECHO_REQUIREMENT) {
                        this.tower1Upgraded = true;
                        this.level.events.emit('tower1Upgraded');
                    }
                    break;
                case 'tower2':
                    this.tower2UpgradeProgress++;
                    if (this.tower2UpgradeProgress >= TOWER_UPGRADE_QUANTUM_ECHO_REQUIREMENT) {
                        this.tower2Upgraded = true;
                        this.level.events.emit('tower2Upgraded');
                    }
                    break;
                case 'tower3':
                    this.tower3UpgradeProgress++;
                    if (this.tower3UpgradeProgress >= TOWER_UPGRADE_QUANTUM_ECHO_REQUIREMENT) {
                        this.tower3Upgraded = true;
                        this.level.events.emit('tower3Upgraded');
                    }
                    break;
            }
        }

        this.level.state.energy += echo.energyValue; // Updated state.money to state.energy
        if(this.level.state.energy > this.level.state.maxEnergy) {
            this.level.state.energy = this.level.state.maxEnergy;
        }
    }

    update(time: number, delta: number) {
        this.player.update(time, delta);
    }

    destroy(): void {
        this.player.destroy();
    }
}
