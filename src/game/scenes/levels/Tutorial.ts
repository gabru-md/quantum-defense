import {Level} from '../lib/Level.ts';
import {AppColors, phaserColor} from '../../scripts/Colors.ts';
import {GAME_HEIGHT, GAME_WIDTH, HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {LevelNames} from '../lib/LevelNames.ts';
import Phaser from 'phaser';
import {EnemyConfigs, SpecialEnemyConfig} from "../../config/EnemyConfigs.ts";

type TutorialStep = {
    text: string;
    action?: () => void;
    markerConfig?: { x1: number; y1: number; x2: number; y2: number; text: string };
    isHudInfo?: boolean;
    waitForSpacePress: boolean;
};

export class Gameplay_Tutorial extends Level { // Renamed class
    private tutorialText!: Phaser.GameObjects.Text;
    private marker!: Phaser.GameObjects.Container;
    private spacebarText!: Phaser.GameObjects.Text;
    private hudElements!: {
        stats: Phaser.GameObjects.GameObject[];
        towers: Phaser.GameObjects.GameObject[];
        help: Phaser.GameObjects.GameObject[];
        separators: Phaser.GameObjects.Graphics[];
        hudSeparators: Phaser.GameObjects.Graphics[];
    };
    private pathElements!: {
        path: Phaser.GameObjects.Graphics[];
        start: Phaser.GameObjects.Graphics[];
        end: Phaser.GameObjects.Graphics[];
    };

    constructor() {
        super(LevelNames.Gameplay_Tutorial); // Updated super call
    }

    nextScene(): LevelNames { // Changed return type to LevelNames
        return LevelNames.MainMenu; // Tutorial now leads back to MainMenu
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        const path = new Phaser.Curves.Path(50, GAME_HEIGHT / 2);
        path.lineTo(GAME_WIDTH - 50, GAME_HEIGHT / 2);
        return {path1: path};
    }

    getWaveConfig(wave: number) {
        switch (wave) {
            case 1:
                return [{
                    type: 'enemy',
                    texture: EnemyConfigs.enemy1.texture,
                    count: 5,
                    delay: 1000,
                    health: EnemyConfigs.enemy1.health,
                    speed: EnemyConfigs.enemy1.speed,
                    energyValue: EnemyConfigs.enemy1.energyValue,
                    path: 'path1'
                }];
            case 2:
                return [{
                    type: 'enemy',
                    texture: EnemyConfigs.enemy2.texture,
                    count: 5,
                    delay: 800,
                    health: EnemyConfigs.enemy2.health,
                    speed: EnemyConfigs.enemy2.speed,
                    energyValue: EnemyConfigs.enemy2.energyValue,
                    path: 'path1'
                }];
            case 3:
                return [{
                    type: 'enemy',
                    texture: EnemyConfigs.enemy3.texture,
                    count: 3,
                    delay: 1500,
                    health: EnemyConfigs.enemy3.health,
                    speed: EnemyConfigs.enemy3.speed,
                    energyValue: EnemyConfigs.enemy3.energyValue,
                    path: 'path1'
                }];
            case 4:
                return [{
                    type: 'specialEnemy',
                    texture: SpecialEnemyConfig.texture,
                    count: 1,
                    delay: 1000,
                    health: SpecialEnemyConfig.health,
                    speed: SpecialEnemyConfig.speed,
                    energyValue: SpecialEnemyConfig.energyValue,
                    path: 'path1'
                }];
            case 5:
                return [
                    {
                        type: 'enemy',
                        texture: EnemyConfigs.enemy1.texture,
                        count: 5,
                        delay: 1000,
                        health: EnemyConfigs.enemy1.health,
                        speed: EnemyConfigs.enemy1.speed,
                        energyValue: EnemyConfigs.enemy1.energyValue,
                        path: 'path1'
                    },
                    {
                        type: 'enemy',
                        texture: EnemyConfigs.enemy2.texture,
                        count: 3,
                        delay: 1200,
                        health: EnemyConfigs.enemy2.health,
                        speed: EnemyConfigs.enemy2.speed,
                        energyValue: EnemyConfigs.enemy2.energyValue,
                        path: 'path1'
                    }
                ];
            default:
                return [];
        }
    }

    public create(): void {
        // Call super.create() first to get all base Level setup
        super.create();

        // After super.create(), the player is set up by PlayerManager.
        // We need to immediately hide it and disable its physics for the tutorial start.
        this.playerManager.player.setVisible(false);
        this.playerManager.player.setActive(false);

        // Create tutorial UI elements, but ensure they are initially invisible
        // as animateGameElements will handle their fade-in.
        this.createTutorialUI();

        // The runTutorialFlow will now be called by the base Level's animateGameElements
        // when the initial scene animations are complete.

        // @ts-ignore
        this.input.keyboard.on('keydown-ESC', () => {
            this.easeOutAndStartNextScene(LevelNames.MainMenu);
        });

        this.events.on('shutdown', this.shutdown, this);
    }

    // Remove hideAllElements() as its functionality is now handled by Level's animateGameElements
    // and specific tutorial steps.

    private createTutorialUI(): void {
        const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            font: '24px',
            color: AppColors.UI_TEXT,
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: {x: 20, y: 10},
            align: 'center',
            wordWrap: {width: WIDTH / 2},
        };
        // Create elements with setVisible(false) and setAlpha(0)
        this.tutorialText = this.add.text(WIDTH / 2, HEIGHT - 150, '', textStyle).setOrigin(0.5).setDepth(300).setVisible(false).setAlpha(0);

        const markerGraphic = this.add.graphics();
        const markerText = this.add.text(0, 0, '', {
            font: '16px',
            color: AppColors.UI_TEXT,
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: {x: 10, y: 5}
        }).setOrigin(0.5);
        this.marker = this.add.container(0, 0, [markerGraphic, markerText]).setDepth(300).setVisible(false).setAlpha(0);

        this.spacebarText = this.add.text(WIDTH / 2, HEIGHT - 50, '[Press SPACE to continue]', {
            font: '16px',
            color: AppColors.UI_ACCENT,
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: {x: 10, y: 5}
        }).setOrigin(0.5).setDepth(301).setVisible(false).setAlpha(0);
    }

    // Implement getLevelSpecificElements to provide tutorial UI to the base Level for animation
    protected getLevelSpecificElements(): Phaser.GameObjects.GameObject[] | undefined {
        return [this.tutorialText, this.marker, this.spacebarText];
    }

    // Rename runTutorialFlow to startTutorial to be called by the base Level
    public async startTutorial(): Promise<void> {
        console.log("Tutorial Started!"); // Add this to confirm it's called

        const hudX = GAME_WIDTH + 15;
        const hudPanelWidth = WIDTH - GAME_WIDTH - 30;

        // --- Lira's Feedback Implementation ---
        this.state.energy = 9999; // Infinite energy for tutorial
        this.hud.disableTowerSelection();
        this.towerManager.disablePlacement();
        // ---

        // The initial visibility of separators is now handled by Level.ts animateGameElements
        // No need to set them visible here again.

        await this.showStep({
            text: "Welcome to the Quantum Realm, Observer. This is your battlefield.",
            markerConfig: {x1: 0, y1: 0, x2: GAME_WIDTH, y2: GAME_HEIGHT, text: "Battlefield"},
            waitForSpacePress: true
        });
        await this.showStep({
            text: "On the right is your Genie-powered HUD. It provides vital information.",
            markerConfig: {x1: GAME_WIDTH, y1: 0, x2: WIDTH, y2: GAME_HEIGHT, text: "HUD"},
            waitForSpacePress: true
        });
        // @ts-ignore
        this.hudElements.stats.forEach(el => el.setVisible(true)); // These are now faded in by Level.ts, just ensure visibility
        await this.showStep({
            text: "This is where you can see your core stats:\nLevel, Nexus Health, Energy, and Wave Progress.",
            markerConfig: {x1: hudX, y1: 10, x2: hudX + hudPanelWidth, y2: 190, text: "Your Stats"},
            waitForSpacePress: true
        });
        await this.showStep({
            text: "This is your current level.\nAs you progress, the glitches become more formidable.",
            markerConfig: {x1: hudX + 5, y1: 58, x2: hudX + hudPanelWidth - 5, y2: 83, text: "Level"},
            waitForSpacePress: true
        });

        await this.showStep({
            text: "This is your Nexus's health, representing its structural integrity.\nIf it reaches zero, the Nexus collapses, and the game is over.",
            markerConfig: {x1: hudX + 5, y1: 83, x2: hudX + hudPanelWidth - 5, y2: 108, text: "Nexus Health"},
            waitForSpacePress: true
        });

        await this.showStep({
            text: "This is your Energy. It's the lifeblood of your defense.",
            markerConfig: {x1: hudX + 5, y1: 108, x2: hudX + hudPanelWidth - 5, y2: 133, text: "Energy"},
            waitForSpacePress: true
        });

        await this.showStep({
            text: "Gain Energy by eliminating Glitches.\nUse it to construct and repair your towers.",
            markerConfig: {x1: hudX + 5, y1: 108, x2: hudX + hudPanelWidth - 5, y2: 133, text: "Energy"},
            waitForSpacePress: true
        });

        await this.showStep({
            text: "This displays the current wave of Glitches.\nEach wave brings new challenges. Prepare accordingly!",
            markerConfig: {x1: hudX + 5, y1: 133, x2: hudX + hudPanelWidth - 5, y2: 158, text: "Wave"},
            waitForSpacePress: true
        });

        // @ts-ignore
        this.hudElements.towers.forEach(el => el.setVisible(true)); // These are now faded in by Level.ts, just ensure visibility
        await this.showStep({
            text: "Now, let's examine your Tower Arsenal.",
            markerConfig: {x1: hudX, y1: 200, x2: hudX + hudPanelWidth, y2: 800, text: "Tower Arsenal"},
            waitForSpacePress: true
        });

        // Steps 3, 4, 5: Reveal towers
        await this.showStep({
            text: "The Laser Tower projects concentrated particle beams.\nThese beams travel in a straight line, dealing precise damage.",
            markerConfig: {x1: hudX + 15, y1: 250, x2: hudX + hudPanelWidth - 15, y2: 340, text: "Laser Tower"},
            waitForSpacePress: true
        });
        await this.showStep({
            text: "The Bomb Tower charges and releases a volatile particle explosion.\nEffective against groups of Glitches.",
            markerConfig: {x1: hudX + 15, y1: 350, x2: hudX + hudPanelWidth - 15, y2: 440, text: "Bomb Tower"},
            waitForSpacePress: true
        });
        await this.showStep({
            text: "The Slow Tower emits a continuous, disruptive wave that significantly reduces the speed of Glitches within its radius.",
            markerConfig: {x1: hudX + 15, y1: 450, x2: hudX + hudPanelWidth - 15, y2: 540, text: "Slow Tower"},
            waitForSpacePress: true
        });

        await this.showStep({
            text: "Should you wish to deselect a tower, simply click on this button.",
            markerConfig: {x1: hudX + 40, y1: 560, x2: hudX + hudPanelWidth - 50, y2: 615, text: "Deselect"},
            waitForSpacePress: true
        });

        // Step 6: Show help text
        // @ts-ignore
        this.hudElements.help.forEach(el => el.setVisible(true)); // These are now faded in by Level.ts, just ensure visibility
        await this.showStep({
            text: "This section provides helpful reminders and tips to aid you in your defense!",
            markerConfig: {
                x1: hudX,
                y1: GAME_HEIGHT - 270,
                x2: hudX + hudPanelWidth,
                y2: GAME_HEIGHT - 20,
                text: "Help"
            },
            waitForSpacePress: true
        });

        // Step 7: Show player
        this.playerManager.player.setVisible(true);
        this.playerManager.player.setActive(true); // Activate physics for the player

        await this.showStep({
            text: "This is you, Guardian! The sentient protector of the Nexus.", isHudInfo: true,
            waitForSpacePress: true
        });

        await this.showStep({
            text: "Navigate the battlefield using the WASD keys.", isHudInfo: true,
            waitForSpacePress: false
        });
        await this.waitForEvent('playerMoved');

        this.pathElements.start.forEach(p => p.setVisible(true)); // These are now faded in by Level.ts, just ensure visibility
        await this.showStep({
            text: "This is Static's Den, the source of the Glitch incursions.\nAll Glitches spawn from here.",
            markerConfig: {
                x1: 5,
                y1: GAME_HEIGHT / 2 - 48,
                x2: 95,
                y2: GAME_HEIGHT / 2 + 48,
                text: "Static's Den"
            },
            waitForSpacePress: true
        });
        this.pathElements.end.forEach(p => p.setVisible(true)); // These are now faded in by Level.ts, just ensure visibility
        await this.showStep({
            text: "This is the Nexus, the heart of the Quantum Realm.\nProtect it at all costs!",
            markerConfig: {
                x1: GAME_WIDTH - 95,
                y1: GAME_HEIGHT / 2 - 48,
                x2: GAME_WIDTH - 5,
                y2: GAME_HEIGHT / 2 + 48,
                text: "The Nexus"
            },
            waitForSpacePress: true
        });
        this.pathElements.path.forEach(p => p.setVisible(true)); // These are now faded in by Level.ts, just ensure visibility
        await this.showStep({
            text: "This is Static's Den, where Glitches spawn, and the Nexus you must protect.",
            waitForSpacePress: true
        });

        this.hud.enableTowerSelection();
        await this.showStep({
            text: "Select the Laser Tower from your Tower Menu.", isHudInfo: true,
            waitForSpacePress: false
        });
        await this.waitForEvent('towerSelected');

        this.towerManager.enablePlacement();
        await this.showStep({
            text: "Strategically place the tower near Static's Den before the first wave of Glitches arrives.",
            isHudInfo: true,
            waitForSpacePress: false
        });
        await this.waitForEvent('towerPlaced');
        this.hud.disableTowerSelection();
        this.towerManager.disablePlacement();

        await this.showStep({
            text: "Here comes the most basic of Static's Glitches: the Square Glitch.", isHudInfo: true,
            waitForSpacePress: false
        });
        this.waveManager.startWave(1);
        await this.waitForEvent('waveCompleted');

        this.hud.enableTowerSelection();
        await this.showStep({
            text: "Deploy another tower to counter the swift Triangle Glitch.", isHudInfo: true,
            waitForSpacePress: false
        });
        this.towerManager.enablePlacement();
        await this.waitForEvent('towerPlaced');
        await this.showStep({
            text: "Here comes the most basic of Static's Glitches: the Square Glitch.", isHudInfo: true,
            waitForSpacePress: false
        });
        this.waveManager.startWave(2);
        await this.waitForEvent('waveCompleted');

        await this.showStep({
            text: "The Circle Glitch is slow but has high health, making it a formidable tank.",
            isHudInfo: true,
            waitForSpacePress: true
        });
        this.waveManager.startWave(3);
        await this.waitForEvent('waveCompleted');

        await this.showStep({
            text: "Now, prepare to encounter The Phantom! A unique and dangerous Glitch.", isHudInfo: true,
            waitForSpacePress: true
        });
        this.waveManager.startWave(4);

        await this.waitForEvent('towerDeactivated');
        this.waveManager.pause();

        await this.showStep({
            text: "A tower has been deactivated! Approach it and press 'E' to revive it.", isHudInfo: true,
            waitForSpacePress: false
        });
        await this.waitForEvent('towerRevived');

        this.waveManager.resume();
        // this.physics.resume();
        await this.showStep({
            text: "The Phantom must not reach the Nexus. Even a single one can cause catastrophic interference.\nDestroy them before they can inflict further damage!",
            isHudInfo: true,
            waitForSpacePress: true
        });
        this.waveManager.startWave(5);
        await this.waitForEvent('waveCompleted');

        await this.showStep({
            text: "Clear this final wave to complete your Guardian training.", isHudInfo: true,
            waitForSpacePress: true
        });
        this.waveManager.startWave(5);
        await this.waitForEvent('waveCompleted');

        this.spacebarText.setVisible(false);
        this.hud.info('Tutorial Complete!', AppColors.UI_MESSAGE_SUCCESS);
        this.time.delayedCall(2000, () => {
            this.easeOutAndStartNextScene(this.nextScene());
        });
    }

    private async showStep(step: TutorialStep): Promise<void> {
        this.spacebarText.setVisible(false);
        const markerGraphic = this.marker.list[0] as Phaser.GameObjects.Graphics;
        const markerText = this.marker.list[1] as Phaser.GameObjects.Text;

        markerGraphic.clear();
        this.marker.setVisible(false);
        this.tutorialText.setVisible(false);
        this.hud.hideInfo();

        if (step.markerConfig) {
            const {x1, y1, x2, y2, text} = step.markerConfig;
            const width = x2 - x1;
            const height = y2 - y1;

            markerGraphic.lineStyle(2, phaserColor(AppColors.UI_ACCENT), 0.8).strokeRect(0, 0, width, height);
            markerGraphic.fillStyle(phaserColor(AppColors.UI_ACCENT), 0.1).fillRect(0, 0, width, height);

            this.marker.setPosition(x1, y1);
            markerText.setText(text).setPosition(width / 2, height + 30);
            this.marker.setVisible(true);
        }

        if (step.isHudInfo) {
            this.hud.info(step.text, AppColors.UI_MESSAGE_INFO, undefined, false);
        } else {
            this.tutorialText.setText(step.text).setVisible(true);
        }
        if (step.waitForSpacePress) {
            this.spacebarText.setVisible(true);
            await this.waitForSpacePress();
        }
        this.spacebarText.setVisible(false);
    }

    private waitForSpacePress(): Promise<void> {
        return new Promise(resolve => {
            // @ts-ignore
            this.input.keyboard.once('keydown-SPACE', resolve);
        });
    }

    private waitForEvent(eventName: string): Promise<void> {
        return new Promise(resolve => {
            this.events.once(eventName, resolve);
        });
    }

    public update(): void {
    }
}
