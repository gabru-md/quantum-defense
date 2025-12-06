// src/game/scenes/levels/Level15.ts
import {Level} from '../lib/Level.ts';
import {LevelNames} from '../lib/LevelNames.ts';
import * as Phaser from 'phaser';
import {GAME_WIDTH, GAME_HEIGHT} from "../../scripts/Util.ts";
import {StaticEnemy} from "../../entities/StaticEnemy.ts";
import {Player} from "../../entities/Player.ts";
import {StaticGenie} from "../../entities/StaticGenie.ts";

export class Gameplay_TheCore extends Level {
    private staticCore!: StaticEnemy; // Use the new StaticEnemy type

    constructor() {
        super(LevelNames.Gameplay_TheCore);
    }

    // No paths needed for this level as the core is stationary
    definePaths(): { [key: string]: Phaser.Curves.Path } {
        return {};
    }

    create() {
        super.create();
        // Place rifts strategically for the final battle aesthetic
        this.createRift(GAME_WIDTH / 2 - 400, GAME_HEIGHT / 4, 'static');
        this.createRift(GAME_WIDTH / 2 + 400, GAME_HEIGHT / 4, 'static');
        this.createRift(GAME_WIDTH / 2, GAME_HEIGHT * 3 / 4, 'nexus');

        this.populateQuantumEchoes();

        // Create Static's Core using the new StaticEnemy class
        this.staticCore = new StaticEnemy({
            scene: this,
            x: GAME_WIDTH / 3,
            y: GAME_HEIGHT / 3,
            texture: 'static', // Use a specific texture for the core (assuming 'static' is loaded)
            health: 5000, // Very high health for the boss
            name: "Static's Core"
        });
        this.staticCore.setupPlayerFollowerComponent();
        this.staticCore.setupAttackComponent();
        this.staticCore.attackComponent.setupGeniesInArms();
        this.add.existing(this.staticCore);

        // Listen for core destruction to trigger win condition
        this.events.on('staticCoreDestroyed', this.handleCoreDestroyed, this);

        // Inform the player about the core
        this.hud.info("Static's Core is exposed! Only your Resonance Wave can destroy it!", '#FF0000', undefined, false);

        this.hud.info("The finale is still under development!", '#00FF00', () => {
            this.easeOutAndStartNextScene(LevelNames.MainMenu, { win: true }); // Or an Epilogue scene
        }, false);

        this.setupCoreAttackTimer();
        this.setupCollisionWithPlayer();
    }

    getWaveConfig(_wave: number): {
        type: string;
        texture: string;
        count: number;
        delay: number;
        health: number;
        speed: number;
        energyValue: number;
        path: string;
    }[] {
        // No traditional waves for the final boss level
        return [];
    }

    // Override update to focus on core and player interaction
    update(time: number, delta: number): void {
        if (!this.isLoaded || this.waveManager.gameOver) return;
        this.playerManager.update(time, delta);
        this.hud.update();
        this.rifts.getChildren().forEach(rift => rift.update(time, delta));
        this.staticCore.update(time, delta); // Update the core
    }

    private handleCoreDestroyed(): void {
        this.hud.info("Static's Core has been shattered! The Quantum Realm is safe!", '#00FF00', () => {
            this.easeOutAndStartNextScene(LevelNames.MainMenu, { win: true }); // Or an Epilogue scene
        }, false);
    }

    nextScene(): LevelNames {
        return LevelNames.MainMenu; // Next scene is the MainMenu after the final level
    }

    private setupCoreAttackTimer() {
        this.time.addEvent({
            delay: 10000, // 10 seconds
            callback: () => {
            this.staticCore.attack(this.playerManager.player);
            },
            loop: true
        });
    }

    private setupCollisionWithPlayer() {
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
}