import {Level} from "../Level.ts";
import {Tower} from "../../../entities/Tower.ts";
import {Bullet} from "../../../entities/Bullet.ts";
import {Bomb} from "../../../entities/Bomb.ts";
import Phaser from "phaser";
import {GameObject} from "../../../core/GameObject.ts";
import {Targeting} from "../../../components/Targeting.ts";
import {LaserAttack} from "../../../components/LaserAttack.ts";
import {VisualPulse} from "../../../components/VisualPulse.ts";
import {
    GAME_HEIGHT,
    GAME_WIDTH,
    TOWER1_COST,
    TOWER1_RANGE,
    TOWER2_COST,
    TOWER2_RANGE, TOWER3_COST, TOWER3_RANGE
} from "../../../scripts/Util.ts";
import {BombAttack} from "../../../components/BombAttack.ts";
import {Manager} from "../Manager.ts";
import {Health} from "../../../components/Health.ts";
import {AppColors, phaserColor} from "../../../scripts/Colors.ts";
import {SlowingAura} from "../../../components/SlowingAura.ts";

export class TowerManager extends Manager {
    towers!: Phaser.GameObjects.Group;
    bullets!: Phaser.GameObjects.Group;
    bombs!: Phaser.GameObjects.Group;

    constructor(protected level: Level) {
        super(level);
    }

    setup() {
        this.towers = this.level.add.group({classType: Tower, runChildUpdate: false});
        this.bullets = this.level.add.group({classType: Bullet, runChildUpdate: false});
        this.bombs = this.level.add.group({classType: Bomb, runChildUpdate: false});
        this.setupInputEventListeners();
    }

    destroy(): void {
        this.towers.destroy(true);
        this.bullets.destroy(true);
        this.bombs.destroy(true);
        this.level.input.off('pointerdown');
    }

    private setupInputEventListeners() {
        this.level.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (this.level.state.isTutorialActive) return;

            if (pointer.x <= GAME_WIDTH && pointer.y <= GAME_HEIGHT) {
                this.tryPlaceTower(pointer.x, pointer.y, this.level.state.selectedTowerType);
            }
        });
    }

    update(time: number, delta: number) {
        this.towers.children.each((tower: Phaser.GameObjects.GameObject) => {
            if (tower instanceof GameObject) {
                tower.update(time, delta);
            }
            return null;
        });
        this.bullets.children.each((bullet: Phaser.GameObjects.GameObject) => {
            if (bullet instanceof GameObject) {
                bullet.update(time, delta);
            }
            return null;
        });
        this.bombs.children.each((bomb: Phaser.GameObjects.GameObject) => {
            if (bomb instanceof GameObject) {
                bomb.update(time, delta);
            }
            return null;
        });
    }

    protected tryPlaceTower(x: number, y: number, towerType: string): void {
        if (this.level.state.isTutorialActive) {
            return;
        }
        const cost = this.getTowerCost(towerType);
        if (cost == -1) {
            this.level.hud.alert('Something went very wrong!', AppColors.UI_MESSAGE_ERROR)
            return;
        }
        if (this.level.state.money >= cost) {
            this.placeSpecificTower(x, y, towerType, cost);
            this.level.state.money -= cost;
            this.level.hud.update();
        } else {
            this.level.hud.alert('Not enough money!', AppColors.UI_MESSAGE_ERROR)
        }
    }

    protected placeSpecificTower(x: number, y: number, towerType: string, cost: number): void {
        let tower: Tower;
        if (towerType === 'tower1') {
            tower = new Tower({scene: this.level, x, y, texture: 'tower1', cost: cost});
            this.towers.add(tower, true);
            tower.addComponent(new Health(300));
            tower.addComponent(new Targeting(TOWER1_RANGE, [this.level.waveManager.enemies, this.level.waveManager.specialEnemies]));
            tower.addComponent(new LaserAttack(200, 25, 300, this.bullets));
            tower.addComponent(new VisualPulse(phaserColor(AppColors.PULSE_LASER_TOWER), 250, 1000, 2.75, 10, 0.5));
            tower.on('pointerover', () => this.level.hud.setHelpText(this.getTowerDescription(towerType)));
            tower.on('pointerout', () => this.level.hud.setHelpText(''));
        } else if (towerType === 'tower2') {
            tower = new Tower({scene: this.level, x, y, texture: 'tower2', cost: cost});
            this.towers.add(tower, true);
            tower.addComponent(new Health(500));
            tower.addComponent(new Targeting(TOWER2_RANGE, [this.level.waveManager.enemies, this.level.waveManager.specialEnemies]));
            tower.addComponent(new BombAttack(1500, 100, 133, 75, this.bombs, [this.level.waveManager.enemies, this.level.waveManager.specialEnemies]));
            tower.addComponent(new VisualPulse(phaserColor(AppColors.PULSE_BOMB_TOWER), 400, 2000, 2, 10, 0.5));
            tower.on('pointerover', () => this.level.hud.setHelpText(this.getTowerDescription(towerType)));
            tower.on('pointerout', () => this.level.hud.setHelpText(''));
        } else if (towerType === 'tower3') {
            tower = new Tower({scene: this.level, x, y, texture: 'tower3', cost: cost});
            this.towers.add(tower, true);
            tower.addComponent(new Health(200));
            tower.addComponent(new SlowingAura(TOWER3_RANGE, 0.5)); // 50% slow factor
            tower.addComponent(new VisualPulse(phaserColor(AppColors.TOWER_SLOW), 300, 1500, 3.5, 10, 0.5));
            tower.on('pointerover', () => this.level.hud.setHelpText(this.getTowerDescription(towerType)));
            tower.on('pointerout', () => this.level.hud.setHelpText(''));
        } else {
            return;
        }

        tower.on('died', () => tower.deactivateTower());
        tower.on('deactivate', () => this.deactivateTower(tower)); // Listen for deactivate event
        this.level.events.emit('towerPlaced', tower);
    }

    public getTowerRange(towerType: string): number {
        switch (towerType) {
            case 'tower1':
                return TOWER1_RANGE;
            case 'tower2':
                return TOWER2_RANGE;
            case 'tower3':
                return TOWER3_RANGE;
            default:
                return 0;
        }
    }

    getTowerCost(towerType: string): number {
        switch (towerType) {
            case 'tower1':
                return TOWER1_COST;
            case 'tower2':
                return TOWER2_COST;
            case 'tower3':
                return TOWER3_COST;
            default:
                return -1;
        }
    }

    public getTowerDescription(towerType: string): string {
        switch (towerType) {
            case 'tower1':
                return 'Laser Tower:\nRapid fire, single target damage.';
            case 'tower2':
                return 'Bomb Tower:\nSlow fire, area of effect damage.';
            case 'tower3':
                return 'Slowing Tower:\nSlows all enemies within its range.';
            default:
                return '';
        }
    }

    private deactivateTower(tower: Tower) {
        if (!tower.active) return; // Already deactivated
        tower.deactivateTower();
        this.level.hud.alert('A Tower has been deactivated!');
        this.level.events.emit('towerDeactivated', tower);
    }
}
