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
import {ChainPulseAttack} from "../../../components/ChainPulseAttack.ts";
import {QuantumFissureAttack} from "../../../components/QuantumFissureAttack.ts";
import {DestabilizationAura} from "../../../components/DestabilizationAura.ts";

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
            return {valid: false, reason: `Insufficient Energy\n${this.level.state.energy}/${energyCost}`};
        }

        return {valid: true};
    }

    protected tryPlaceTower(x: number, y: number, towerType: string): void {
        const placementCheck = this.checkPlacementValidity(x, y, towerType);
        if (!placementCheck.valid) {
            if (placementCheck.reason) {
                this.level.hud.alert(placementCheck.reason, AppColors.UI_MESSAGE_WARN, 1000);
                this.level.playerManager.player.warn(placementCheck.reason);
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

        const isUpgraded = this.isTowerUpgraded(towerType);
        const texture = isUpgraded ? config.upgradedTexture : config.texture;

        const tower = new Tower({scene: this.level, x, y, texture: texture, energyCost: energyCost, towerType: towerType});
        this.towers.add(tower, true);
        tower.addComponent(new Health(config.health));
        tower.addComponent(new Targeting(config.range, [this.level.waveManager.enemies]));

        this.applyAttackAndSlowing(tower, towerType, isUpgraded);

        tower.on('died', () => tower.deactivateTower());
        tower.on('deactivate', () => this.deactivateTower(tower));
        tower.on('pointerover', () => this.level.hud.setHelpText(this.getTowerDescription(towerType)));
        tower.on('pointerout', () => this.level.hud.setHelpText(''));
        return tower;
    }

    private applyAttackAndSlowing(tower: Tower, towerType: string, isUpgraded: boolean) {
        const config: TowerConfigType = TowerConfigs[towerType];

        if (isUpgraded) {
            if (towerType === 'tower1' && config.upgradedAttack) {
                tower.addComponentOverriding(new ChainPulseAttack(config.upgradedAttack.fireRate, config.upgradedAttack.damage, config.upgradedAttack.bulletSpeed!, this.bullets, config.upgradedAttack.ricochetTargets!, config.upgradedAttack.ricochetDamage!));
            } else if (towerType === 'tower2' && config.upgradedAttack) {
                tower.addComponentOverriding(new QuantumFissureAttack(config.upgradedAttack.fireRate, config.upgradedAttack.damage, config.range, config.upgradedAttack.aoeRadius!, this.bombs, [this.level.waveManager.enemies], config.upgradedAttack.fissureDamage!, config.upgradedAttack.fissureDuration!));
            } else if (towerType === 'tower3' && config.upgradedSlowing) {
                tower.addComponentOverriding(new DestabilizationAura(config.range, config.upgradedSlowing.slowFactor, config.upgradedSlowing.damageAmplification));
            }
        } else {
            if (towerType === 'tower1' && config.attack) {
                tower.addComponentOverriding(new LaserAttack(config.attack.fireRate, config.attack.damage, config.attack.bulletSpeed!, this.bullets));
            } else if (towerType === 'tower2' && config.attack) {
                tower.addComponentOverriding(new BombAttack(config.attack.fireRate, config.attack.damage, config.range, config.attack.aoeRadius!, this.bombs, [this.level.waveManager.enemies]));
            } else if (towerType === 'tower3' && config.slowing) {
                tower.addComponentOverriding(new SlowingAura(config.range, config.slowing.slowFactor));
            }
        }
    }

    private isTowerUpgraded(towerType: string): boolean {
        if (towerType === 'tower1') return this.level.state.tower1Upgraded;
        if (towerType === 'tower2') return this.level.state.tower2Upgraded;
        if (towerType === 'tower3') return this.level.state.tower3Upgraded;
        return false;
    }

    public getTowerRange(towerType: string): number {
        const config = TowerConfigs[towerType];
        if (!config) return 0;
        return this.isTowerUpgraded(towerType) ? config.range : config.range; // Can be different if you want
    }

    getTowerEnergyCost(towerType: string): number {
        const config = TowerConfigs[towerType];
        if (!config) return -1;
        return this.isTowerUpgraded(towerType) ? config.upgradedEnergyCost : config.energyCost;
    }

    public getTowerDescription(towerType: string): string {
        const config = TowerConfigs[towerType];
        if (!config) return '';
        return this.isTowerUpgraded(towerType) ? config.upgradedDescription : config.description;
    }

    private deactivateTower(tower: Tower) {
        if (!tower.active) return;
        tower.deactivateTower();
        this.level.hud.alert('TOWER DEACTIVATED:\nA Tower has been deactivated!');
        this.level.playerManager.player.danger('A Tower has been deactivated!');
        this.level.events.emit('towerDeactivated', tower);
    }
}
