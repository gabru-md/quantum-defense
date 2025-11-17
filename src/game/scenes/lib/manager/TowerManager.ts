import {Level} from '../Level.ts';
import {Tower} from '../../../entities/Tower.ts';
import {Bullet} from '../../../entities/Bullet.ts';
import {Bomb} from '../../../entities/Bomb.ts';
import Phaser from 'phaser';
import {GameObject} from '../../../core/GameObject.ts';
import {Targeting} from '../../../components/Targeting.ts';
import {LaserAttack} from '../../../components/LaserAttack.ts';
import {GAME_HEIGHT, GAME_WIDTH} from '../../../scripts/Util.ts';
import {BombAttack} from '../../../components/BombAttack.ts';
import {Manager} from '../Manager.ts';
import {Health} from '../../../components/Health.ts';
import {AppColors} from '../../../scripts/Colors.ts';
import {SlowingAura} from '../../../components/SlowingAura.ts';
import {TowerConfigs, TowerConfigType} from '../../../config/TowerConfigs.ts';

export class TowerManager extends Manager {
    towers!: Phaser.GameObjects.Group;
    bullets!: Phaser.GameObjects.Group;
    bombs!: Phaser.GameObjects.Group;
    private canPlaceTowers: boolean = true;

    constructor(protected level: Level) {
        super(level);
    }

    setup(): { towers: Phaser.GameObjects.Group; bullets: Phaser.GameObjects.Group; bombs: Phaser.GameObjects.Group } {
        this.towers = this.level.add.group({classType: Tower, runChildUpdate: false});
        this.bullets = this.level.add.group({classType: Bullet, runChildUpdate: false});
        this.bombs = this.level.add.group({classType: Bomb, runChildUpdate: false});
        this.setupInputEventListeners();
        return {towers: this.towers, bullets: this.bullets, bombs: this.bombs};
    }

    destroy(): void {
        this.towers.destroy(true);
        this.bullets.destroy(true);
        this.bombs.destroy(true);
        this.level.input.off('pointerdown');
    }

    public enablePlacement(): void {
        this.canPlaceTowers = true;
    }

    public disablePlacement(): void {
        this.canPlaceTowers = false;
    }

    private setupInputEventListeners() {
        this.level.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (!this.canPlaceTowers || pointer.x > GAME_WIDTH || pointer.y > GAME_HEIGHT) return;

            if (pointer.leftButtonDown()) {
                this.tryPlaceTower(pointer.x, pointer.y, this.level.state.selectedTowerType);
            }
        });
    }

    update(time: number, delta: number) {
        // @ts-ignore
        this.towers.children.each((tower: Phaser.GameObjects.GameObject) => {
            if (tower instanceof GameObject) tower.update(time, delta);
        });
        // @ts-ignore
        this.bullets.children.each((bullet: Phaser.GameObjects.GameObject) => {
            if (bullet instanceof GameObject) bullet.update(time, delta);
        });
        // @ts-ignore
        this.bombs.children.each((bomb: Phaser.GameObjects.GameObject) => {
            if (bomb instanceof GameObject) bomb.update(time, delta);
        });
    }

    public checkPlacementValidity(x: number, y: number, towerType: string): { valid: boolean; reason?: string } {
        if (!towerType || towerType === 'none') {
            return {valid: false, reason: 'No tower selected.'};
        }

        const buildableCheck = this.level.isPositionBuildable(x, y);
        if (!buildableCheck.buildable) {
            return {valid: false, reason: buildableCheck.reason};
        }

        const energyCost = this.getTowerEnergyCost(towerType);
        if (this.level.state.energy < energyCost) {
            return {valid: false, reason: `Insufficient energy. Need ${energyCost}.`};
        }

        return {valid: true};
    }

    protected tryPlaceTower(x: number, y: number, towerType: string): void {
        const placementCheck = this.checkPlacementValidity(x, y, towerType);
        if (!placementCheck.valid) {
            if (placementCheck.reason) {
                this.level.hud.alert(placementCheck.reason, AppColors.UI_MESSAGE_WARN, 1000);
            }
            return;
        }

        const energyCost = this.getTowerEnergyCost(towerType);
        const tower = this.placeSpecificTower(x, y, towerType, energyCost);
        this.level.state.energy -= energyCost;
        this.level.hud.update();
        this.level.events.emit('towerPlaced', tower);
    }

    protected placeSpecificTower(x: number, y: number, towerType: string, energyCost: number): Tower {
        const config: TowerConfigType = TowerConfigs[towerType];
        if (!config) {
            throw new Error(`Tower configuration not found for type: ${towerType}`);
        }

        const tower = new Tower({scene: this.level, x, y, texture: config.texture, energyCost: energyCost});
        this.towers.add(tower, true);
        tower.addComponent(new Health(config.health));
        tower.addComponent(new Targeting(config.range, [this.level.waveManager.enemies]));

        if (config.attack) {
            if (towerType === 'tower1') {
                tower.addComponent(new LaserAttack(config.attack.fireRate, config.attack.damage, config.attack.bulletSpeed!, this.bullets));
            } else if (towerType === 'tower2') {
                tower.addComponent(new BombAttack(config.attack.fireRate, config.attack.damage, config.range, config.attack.aoeRadius!, this.bombs, [this.level.waveManager.enemies]));
            }
        }

        if (config.slowing) {
            tower.addComponent(new SlowingAura(config.range, config.slowing.slowFactor));
        }

        tower.on('died', () => tower.deactivateTower());
        tower.on('deactivate', () => this.deactivateTower(tower));
        tower.on('pointerover', () => this.level.hud.setHelpText(this.getTowerDescription(towerType)));
        tower.on('pointerout', () => this.level.hud.setHelpText(''));
        return tower;
    }

    public getTowerRange(towerType: string): number {
        return TowerConfigs[towerType]?.range || 0;
    }

    getTowerEnergyCost(towerType: string): number {
        return TowerConfigs[towerType]?.energyCost || -1;
    }

    public getTowerDescription(towerType: string): string {
        return TowerConfigs[towerType]?.description || '';
    }

    private deactivateTower(tower: Tower) {
        if (!tower.active) return;
        tower.deactivateTower();
        this.level.hud.alert('TOWER DEACTIVATED:\nA Tower has been deactivated!');
        this.level.events.emit('towerDeactivated', tower);
    }
}
