import {Level} from "../Level.ts";
import {Player} from "../../../entities/Player.ts";
import {FindNearestTower} from "../../../components/FindNearestTower.ts";
import {PlayerWaveAmplifier} from "../../../components/PlayerWaveAmplifier.ts";
import {VisualPulse} from "../../../components/VisualPulse.ts";
import {Manager} from "../Manager.ts";
import {AppColors, phaserColor} from "../../../scripts/Colors.ts";
import {GAME_HEIGHT, GAME_WIDTH} from "../../../scripts/Util.ts";

export class PlayerManager extends Manager {
    player!: Player;

    constructor(protected level: Level) {
        super(level);
    }

    setup() {
        this.player = new Player({scene: this.level, x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2, texture: 'player'});
        this.player.addComponent(new FindNearestTower());
        this.player.addComponent(new PlayerWaveAmplifier(this.level.waveManager.specialEnemies)) // Pass specialEnemies
        this.player.addComponent(new VisualPulse(phaserColor(AppColors.PLAYER_WAVE_PULSE), 300, 1500, 1.75, 5))
        this.level.add.existing(this.player);
        this.player.setDepth(1000); // Set a high depth value to ensure it's on top
    }

    update(time: number, delta: number) {
        this.player.update(time, delta);
    }
}
