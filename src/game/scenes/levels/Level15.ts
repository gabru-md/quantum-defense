import {Level} from '../lib/Level.ts';
import {LevelNames} from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import {GAME_HEIGHT, GAME_WIDTH} from '../../scripts/Util.ts';
import {StaticEnemy, StaticHealthState} from '../../entities/StaticEnemy.ts';
import {EnemyConfigs} from '../../config/EnemyConfigs.ts';
import {PathMaker} from '../lib/PathMaker.ts';
import {GuardianAttackComponent} from "../../components/GuardianAttackComponent.ts";
import {StaticGenie} from "../../entities/StaticGenie.ts";
import {Player} from "../../entities/Player.ts";

enum Level15Phase {
    FIGHTING_BOSS_STEADY,
    TD_WAVE_1,
    FIGHTING_BOSS_DISRUPTION,
    TD_WAVE_2,
    FIGHTING_BOSS_VOLATILE,
    TD_WAVE_3,
    FIGHTING_BOSS_ERUPTION,
    GAME_OVER,
}

export class Gameplay_TheCore extends Level {
    private staticCore: StaticEnemy;
    private currentPhase: Level15Phase = Level15Phase.FIGHTING_BOSS_STEADY;
    private pathVisuals: Phaser.GameObjects.Graphics[] = [];

    constructor() {
        super(LevelNames.Gameplay_TheCore);
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        const path1 = new PathMaker(100, GAME_HEIGHT / 4).right(GAME_WIDTH - 150).create(this);
        const path2 = new PathMaker(100, GAME_HEIGHT / 2).right(GAME_WIDTH - 150).create(this);
        const path3 = new PathMaker(100, GAME_HEIGHT * 3 / 4).right(GAME_WIDTH - 150).create(this);

        return {path1, path2, path3};
    }

    getWaveConfig(wave: number): any[] {
        switch (wave) {
            case 1:
                return [{
                    type: 'enemy',
                    texture: EnemyConfigs.enemy1.texture,
                    count: 20,
                    delay: 500,
                    health: EnemyConfigs.enemy1.health,
                    speed: EnemyConfigs.enemy1.speed,
                    energyValue: EnemyConfigs.enemy1.energyValue,
                    path: 'path1'
                }];
            case 2:
                return [{
                    type: 'enemy',
                    texture: EnemyConfigs.enemy2.texture,
                    count: 15,
                    delay: 700,
                    health: EnemyConfigs.enemy2.health,
                    speed: EnemyConfigs.enemy2.speed,
                    energyValue: EnemyConfigs.enemy2.energyValue,
                    path: 'path2'
                }];
            case 3:
                return [{
                    type: 'enemy',
                    texture: EnemyConfigs.enemy3.texture,
                    count: 10,
                    delay: 1000,
                    health: EnemyConfigs.enemy3.health,
                    speed: EnemyConfigs.enemy3.speed,
                    energyValue: EnemyConfigs.enemy3.energyValue,
                    path: 'path3'
                }];
            default:
                return [];
        }
    }

    create() {
        super.create();

        this.createRift(GAME_WIDTH / 2 - 400, GAME_HEIGHT / 4, 'static');
        this.createRift(GAME_WIDTH / 2 + 400, GAME_HEIGHT / 4, 'gradient');
        this.createRift(GAME_WIDTH / 2, GAME_HEIGHT * 3 / 4, 'nexus');

        this.populateQuantumEchoes();

        // Correctly get the graphics from the PathsManager after they have been drawn
        this.pathVisuals.push(this.pathsManager.pathGraphics['path1']);
        this.pathVisuals.push(this.pathsManager.startZoneGraphics['path1']);
        this.pathVisuals.push(this.pathsManager.endZoneGraphics['path1']);
        this.pathVisuals.push(this.pathsManager.pathGraphics['path2']);
        this.pathVisuals.push(this.pathsManager.startZoneGraphics['path2']);
        this.pathVisuals.push(this.pathsManager.endZoneGraphics['path2']);
        this.pathVisuals.push(this.pathsManager.pathGraphics['path3']);
        this.pathVisuals.push(this.pathsManager.startZoneGraphics['path3']);
        this.pathVisuals.push(this.pathsManager.endZoneGraphics['path3']);

        this.waveManager.pause(); // We control waves manually
        this.pathVisuals.forEach(p => p.setVisible(false)); // Hide all paths initially

        this.staticCore = new StaticEnemy({
            scene: this,
            x: GAME_WIDTH / 3,
            y: GAME_HEIGHT / 3,
            texture: 'static',
            health: 5000,
            name: "Static's Core"
        });
        this.staticCore.setupPlayerFollowerComponent();
        this.staticCore.setupAttackComponent();
        this.staticCore.attackComponent.addGeniesToArm(5 * 200);
        this.add.existing(this.staticCore);

        this.playerManager.player.addComponent(new GuardianAttackComponent());

        // Listen for state changes from the boss
        this.events.on('staticHealthStateChanged', this.handleBossStateChange, this);
        this.events.on('staticCoreDestroyed', this.winGame, this);

        // Inform the player about the core
        this.hud.info("Static's Core is exposed! Only your Resonance Wave can destroy it!", '#FF0000', undefined, false);

        this.hud.info("Collect Quantum Echoes and Press [R] to activate Mega Resonance Wave to deal damage to Static", '#00FF00', undefined, true);


        this.setupCoreAttackTimer();
        this.setupFinalLevelCollisions();
    }

    init() {
        super.init();
        this.state.energy = 1000;
    }

    update(time: number, delta: number) {
        super.update(time, delta);
        if (this.currentPhase === Level15Phase.GAME_OVER) return;

        this.playerManager.update(time, delta);
        this.hud.update();
        this.rifts.getChildren().forEach(rift => rift.update(time, delta));
        if (this.isInBossFightMode()) {
            this.staticCore.update(time, delta);
        }

        // Check for TD wave completion
        if (!this.isInBossFightMode() && !this.waveManager.isWaveActive) {
            this.startBossPhase();
        }
    }

    handleBossStateChange(newState: StaticHealthState) {
        switch (newState) {
            case StaticHealthState.DISRUPTION:
                if (this.currentPhase === Level15Phase.FIGHTING_BOSS_STEADY) {
                    this.hud.info("Static's core has been disrupted", '#00FF00', () => {
                        this.hud.info("He is sending out enemies, Get ready Guardian!", '#00FF00', () => {
                            this.startTDPhase(1, Level15Phase.TD_WAVE_1);
                        }, true);
                    }, true);
                }
                break;
            case StaticHealthState.VOLATILE:
                if (this.currentPhase === Level15Phase.FIGHTING_BOSS_DISRUPTION) {
                    this.hud.info("That's a great wave Guardian!", '#00FF00', () => {
                        this.hud.info("He is enraged, you are weakening him!", '#00FF00', () => {
                            this.startTDPhase(2, Level15Phase.TD_WAVE_2);
                        }, true);
                    }, true);
                }
                break;
            case StaticHealthState.ERUPTION:
                if (this.currentPhase === Level15Phase.FIGHTING_BOSS_VOLATILE) {
                    this.hud.info("I can't believe this Guardian", '#00FF00', () => {
                        this.hud.info("This looks like his final attempt to sabotage the Nexus!", '#00FF00', () => {
                            this.startTDPhase(3, Level15Phase.TD_WAVE_3);
                        }, true);
                    }, true);
                }
                break;
        }
    }

    startTDPhase(waveNumber: number, tdPhase: Level15Phase) {
        this.currentPhase = tdPhase;
        let x = -1000;
        let y = this.staticCore.y;
        switch (tdPhase) {
            case Level15Phase.TD_WAVE_1:
                x = 100
                y = GAME_HEIGHT / 4
                break;
            case Level15Phase.TD_WAVE_2:
                x = 100;
                y = GAME_HEIGHT / 2;
                break;
            case Level15Phase.TD_WAVE_3:
                x = 100;
                y = GAME_HEIGHT * 3 / 4;
                break;
            default:
                break;

        }
        this.staticCore.playerFollower.enabled = false;
        this.staticCore.disappear(x, y);
        let idx = 3 * (waveNumber - 1);
        this.pathVisuals[idx].setVisible(true); // path
        this.pathVisuals[idx + 1].setVisible(true); // start
        this.pathVisuals[idx + 2].setVisible(true); // end
        this.waveManager.isWaveActive = true;
        this.time.delayedCall(1000, () => {
            this.waveManager.resume();
            this.waveManager.startWave(waveNumber);
        });
    }

    startBossPhase() {
        // console.log("Transitioning back to Boss Fight");

        if (this.currentPhase === Level15Phase.TD_WAVE_1) this.currentPhase = Level15Phase.FIGHTING_BOSS_DISRUPTION;
        else if (this.currentPhase === Level15Phase.TD_WAVE_2) this.currentPhase = Level15Phase.FIGHTING_BOSS_VOLATILE;
        else if (this.currentPhase === Level15Phase.TD_WAVE_3) this.currentPhase = Level15Phase.FIGHTING_BOSS_ERUPTION;

        this.pathVisuals.forEach(p => p.setVisible(false));
        this.waveManager.pause();
        this.staticCore.reappear();
        this.staticCore.playerFollower.enabled = true;
    }

    winGame() {
        this.currentPhase = Level15Phase.GAME_OVER;
        this.hud.info("Static's Core has been shattered! The Quantum Realm is safe!", '#00FF00', () => {
            this.easeOutAndStartNextScene(LevelNames.EndScene, {win: true, levelStats: this.levelStatsManager});
        }, true);
    }

    nextScene(): LevelNames {
        return LevelNames.MainMenu;
    }

    private setupCoreAttackTimer() {
        this.time.addEvent({
            delay: 10000, // 10 seconds
            callback: () => {
                if (this.isInBossFightMode()) {
                    this.staticCore.attack(this.playerManager.player);
                }
            },
            loop: true
        });
    }

    private setupFinalLevelCollisions() {
        this.physics.add.overlap(
            this.staticCore.staticGenies,
            this.playerManager.player, // Use playerSprite for collision detection
            this.handleStaticEnemyPlayerCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );
    }

    private handleStaticEnemyPlayerCollision(_staticGenie: StaticGenie, player: Player) {
        this.state.baseHealth -= 0.25;
        player.shake();
        // console.log('Hit')
    }

    private isInBossFightMode() {
        switch (this.currentPhase) {
            case Level15Phase.FIGHTING_BOSS_STEADY:
            case Level15Phase.FIGHTING_BOSS_DISRUPTION:
            case Level15Phase.FIGHTING_BOSS_VOLATILE:
            case Level15Phase.FIGHTING_BOSS_ERUPTION:
                return true;
            default:
                return false;
        }
    }
}
