import {Level} from "../Level.ts";
import {Tower} from "../../../entities/Tower.ts";
import {Bullet} from "../../../entities/Bullet.ts";
import {Bomb} from "../../../entities/Bomb.ts";
import Phaser from "phaser";
import {GameObject} from "../../../core/GameObject.ts";
import {Targeting} from "../../../components/Targeting.ts";
import {LaserAttack} from "../../../components/LaserAttack.ts";
import {VisualPulse} from "../../../components/VisualPulse.ts";
import {GAME_HEIGHT, GAME_WIDTH, phaserColor, TOWER1_COST, TOWER2_COST} from "../../../scripts/util.ts";
import {BombAttack} from "../../../components/BombAttack.ts";
import {Manager} from "../Manager.ts";
import {Health} from "../../../components/Health.ts";

export class TowerManager extends Manager {
    towers!: Phaser.GameObjects.Group;
    protected bullets!: Phaser.GameObjects.Group;
    protected bombs!: Phaser.GameObjects.Group;

    selectedTowerType: string;

    constructor(protected level: Level) {
        super(level);
    }

    setup() {
        this.towers = this.level.add.group({classType: Tower, runChildUpdate: false});
        this.bullets = this.level.add.group({classType: Bullet, runChildUpdate: false});
        this.bombs = this.level.add.group({classType: Bomb, runChildUpdate: false});
        this.setupInputEventListeners();
    }


    private setupInputEventListeners() {
        this.selectedTowerType = 'tower1';
        this.level.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.x <= GAME_WIDTH && pointer.y <= GAME_HEIGHT) {
                // place tower only if witin game bounds else interact with hud
                this.tryPlaceTower(pointer.x, pointer.y, this.selectedTowerType);
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
        const cost = this.getTowerCost(towerType);
        if (cost == -1) {
            this.level.hud.info('Something went very wrong!', '#ffff00')
            return;
        }
        if (this.level.state.money >= cost) {
            this.placeSpecificTower(x, y, towerType);
            this.level.state.money -= cost;
            this.level.hud.update();
        } else {
            this.level.hud.info('Not enough money!', '#ffff00')
        }
    }

    protected placeSpecificTower(x: number, y: number, towerType: string): void {
        if (towerType === 'tower1') {
            const tower = new Tower({scene: this.level, x, y, texture: 'tower1'});
            this.towers.add(tower, true);
            tower.addComponent(new Health(100));
            tower.addComponent(new Targeting(150, [this.level.waveManager.enemies, this.level.waveManager.healers]));
            tower.addComponent(new LaserAttack(200, 25, 300, this.bullets));
            tower.addComponent(new VisualPulse(phaserColor('rgba(255,0,132,0.84)'), 250, 1000));
            tower.on('died', () => this.deactivateTower(tower));
        } else if (towerType === 'tower2') {
            const tower = new Tower({scene: this.level, x, y, texture: 'tower2'});
            this.towers.add(tower, true);
            tower.addComponent(new Health(150));
            tower.addComponent(new Targeting(180, [this.level.waveManager.enemies, this.level.waveManager.healers]));
            tower.addComponent(new BombAttack(1500, 100, 133, 75, this.bombs, [this.level.waveManager.enemies, this.level.waveManager.healers]));
            tower.addComponent(new VisualPulse(phaserColor('0xff00ff'), 400, 2000));
            tower.on('died', () => this.deactivateTower(tower));
        }
    }

    protected getTowerCost(towerType: string): number {
        switch (towerType) {
            case 'tower1':
                return TOWER1_COST;
            case 'tower2':
                return TOWER2_COST;
            default:
                return -1;
        }
    }

    private deactivateTower(tower: Tower) {
        tower.setActive(false);
        tower.setAlpha(0.5);
        tower.getComponent(VisualPulse)?.destroy();
        const attackComponents = [tower.getComponent(LaserAttack), tower.getComponent(BombAttack), tower.getComponent(VisualPulse)];
        attackComponents.forEach(c => {
            if (c) c.enabled = false;
        });
    }
}
