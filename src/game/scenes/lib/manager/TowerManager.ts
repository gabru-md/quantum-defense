import {Level} from '../Level.ts';
import {Tower} from '../../../entities/Tower.ts';
import {Bullet} from '../../../entities/Bullet.ts';
import {Bomb} from '../../../entities/Bomb.ts';
import Phaser from 'phaser';
import {GameObject} from '../../../core/GameObject.ts';
import {Targeting} from '../../../components/Targeting.ts';
import {LaserAttack} from '../../../components/LaserAttack.ts';
import {VisualPulse} from '../../../components/VisualPulse.ts';
import {GAME_HEIGHT, GAME_WIDTH} from '../../../scripts/Util.ts';
import {BombAttack} from '../../../components/BombAttack.ts';
import {Manager} from '../Manager.ts';
import {Health} from '../../../components/Health.ts';
import {AppColors} from '../../../scripts/Colors.ts';
import {SlowingAura} from '../../../components/SlowingAura.ts';
import {TowerConfigs, TowerConfigType} from '../../../config/TowerConfigs.ts'; // Import TowerConfigs

export class TowerManager extends Manager {
    towers!: Phaser.GameObjects.Group;
    bullets!: Phaser.GameObjects.Group;
    bombs!: Phaser.GameObjects.Group;
    private canPlaceTowers: boolean = true; // Control flag for tower placement

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

    protected tryPlaceTower(x: number, y: number, towerType: string): void {
        if (!towerType || towerType === 'none') return;

        const energyCost = this.getTowerEnergyCost(towerType); // Renamed getTowerCost
        if (energyCost === -1) {
            this.level.hud.alert('TOWER ERROR:\nSomething went very wrong!', AppColors.UI_MESSAGE_ERROR);
            return;
        }
        if (this.level.state.energy >= energyCost) { // Updated state.money to state.energy
            this.placeSpecificTower(x, y, towerType, energyCost);
            this.level.state.energy -= energyCost; // Updated state.money to state.energy
            this.level.hud.update();
            this.level.state.selectedTowerType = 'none';
            this.level.events.emit('towerPlaced');
        } else {
            const energyNeededToPlace = energyCost - this.level.state.energy; // Updated state.money to state.energy
            this.level.hud.alert(`INSUFFICIENT ENERGY:\nNeed ${energyNeededToPlace} energy to place tower!`, AppColors.UI_MESSAGE_WARN, 1000); // Updated message
        }
    }

    protected placeSpecificTower(x: number, y: number, towerType: string, energyCost: number): void { // Renamed cost to energyCost
        const config: TowerConfigType = TowerConfigs[towerType];
        if (!config) {
            console.error(`Tower configuration not found for type: ${towerType}`);
            return;
        }

        let tower: Tower;
        tower = new Tower({scene: this.level, x, y, texture: config.texture, energyCost: energyCost}); // Updated cost to energyCost
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

        tower.addComponent(
            new VisualPulse(
                config.pulse.color,
                config.pulse.pulseDelay,
                config.pulse.pulseDuration,
                config.range, // Use tower's range as targetRadius
                config.pulse.pulseTotalPulses,
                config.pulse.pulseLineWidth
            )
        );

        tower.on('died', () => tower.deactivateTower());
        tower.on('deactivate', () => this.deactivateTower(tower));
        tower.on('pointerover', () => this.level.hud.setHelpText(this.getTowerDescription(towerType)));
        tower.on('pointerout', () => this.level.hud.setHelpText(''));
    }

    public getTowerRange(towerType: string): number {
        return TowerConfigs[towerType]?.range || 0;
    }

    getTowerEnergyCost(towerType: string): number { // Renamed getTowerCost
        return TowerConfigs[towerType]?.energyCost || -1; // Updated to energyCost
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
