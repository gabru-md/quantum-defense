import {Level} from '../Level.ts';
import {AppColors} from '../../../scripts/Colors.ts';
import Phaser from 'phaser';
import {GAME_HEIGHT, GAME_WIDTH, WIDTH} from "../../../scripts/Util.ts";
import {Player} from "../../../entities/Player.ts";

enum TutorialStep {
    Start,
    ExplainHUD,
    ExplainStats,
    ExplainLevel,
    ExplainNexusHealth,
    ExplainEnergy,
    ExplainWave,
    ExplainTowerArsenal,
    ExplainLaserTower,
    ExplainBombTower,
    ExplainSlowTower,
    ExplainDeselect,
    ExplainHelp,
    ExplainPlayer,
    ExplainPlayerMovement,
    ExplainStaticDen,
    ExplainNexus,
    ExplainPath,
    SelectLaserTower,
    PlaceFirstTower,
    FirstWave,
    IntroduceFastEnemy,
    PlaceSecondTower,
    SecondWave,
    IntroduceTankEnemy,
    ThirdWave,
    IntroducePhantom,
    PhantomWave,
    TowerDeactivated,
    TowerRevived,
    FinalWave,
    Complete,
}

export class TutorialManager {
    private currentStep: TutorialStep = TutorialStep.Start;
    private level: Level;
    private spacebarKey: Phaser.Input.Keyboard.Key;
    private eKey: Phaser.Input.Keyboard.Key;
    private player!: Player;

    constructor(level: Level) {
        this.level = level;

        // Input keys
        // @ts-ignore
        this.spacebarKey = this.level.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // @ts-ignore
        this.eKey = this.level.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // Listen for game events
        this.level.events.on('waveCompleted', this.onWaveCompleted, this);
        this.level.events.on('towerDeactivated', this.onTowerDeactivated, this);
        this.level.events.on('towerRevived', this.onTowerRevived, this);
        this.level.events.on('towerSelected', this.onTowerSelected, this);
        this.level.events.on('towerPlaced', this.onTowerPlaced, this);
        this.level.events.on('playerMoved', this.onPlayerMoved, this);
        this.spacebarKey.on('down', this.handleSpacePress, this);
        this.eKey.on('down', this.handleEPress, this); // E key for revival
    }

    public async startTutorial(): Promise<void> {
        this.player = this.level.playerManager.player; // Get player instance

        this.level.state.energy = 9999; // Infinite energy for tutorial
        this.level.hud.disableTowerSelection();
        this.level.towerManager.disablePlacement();
        this.level.physics.pause(); // Pause physics initially

        // Hide all game elements initially
        this.level.hud.hideAllElements();
        this.level.pathsManager.hideAllElements();
        this.player.setVisible(false);

        this.level.time.delayedCall(1000, () => {
            this.executeStep();
        })

    }

    private async executeStep(): Promise<void> {
        this.level.hud.hideInfo(); // Clear previous info messages
        this.level.hud.hideMarker(); // Hide any active markers
        // this.level.physics.pause(); // Pause physics by default for instructional steps
        this.level.hud.showSpacebarPrompt(false); // Hide spacebar prompt by default

        const hudX = GAME_WIDTH + 15;
        const hudPanelWidth = WIDTH - GAME_WIDTH - 30;

        switch (this.currentStep) {
            case TutorialStep.Start:
                this.level.waveManager.pause();
                this.level.hud.showGameBoundary(true);
                this.level.hud.persistedInfo('Welcome, Guardian, to the Quantum Realm!', AppColors.UI_MESSAGE_INFO);
                await this.waitForSpacePress();
                this.currentStep = TutorialStep.ExplainHUD;
                await this.executeStep();
                break;

            case TutorialStep.ExplainHUD:
                this.level.hud.showHudBoundary(true);
                this.level.hud.persistedInfo('On the right is your Genie-powered HUD.\nIt provides vital information.', AppColors.UI_MESSAGE_INFO);
                this.level.hud.showMarker(GAME_WIDTH, 0, WIDTH, GAME_HEIGHT, "HUD");
                await this.waitForSpacePress();
                this.level.hud.showStats(true); // Show stats section
                this.currentStep = TutorialStep.ExplainStats;
                await this.executeStep();
                break;

            case TutorialStep.ExplainStats:
                this.level.hud.persistedInfo('This is where you can see your core stats:\nLevel, Nexus Health, Energy, and Wave Progress.', AppColors.UI_MESSAGE_INFO);
                this.level.hud.showMarker(hudX, 10, hudX + hudPanelWidth, 190, "Your Stats");
                await this.waitForSpacePress();
                this.currentStep = TutorialStep.ExplainLevel;
                await this.executeStep();
                break;

            case TutorialStep.ExplainLevel:
                this.level.hud.persistedInfo('This is your current level.\nAs you progress, the glitches become more formidable.', AppColors.UI_MESSAGE_INFO);
                this.level.hud.showMarker(hudX + 5, 58, hudX + hudPanelWidth - 5, 83, "Level");
                await this.waitForSpacePress();
                this.currentStep = TutorialStep.ExplainNexusHealth;
                await this.executeStep();
                break;

            case TutorialStep.ExplainNexusHealth:
                this.level.hud.persistedInfo('This is your Nexus\'s health, representing its structural integrity.\nIf it reaches zero, the Nexus collapses, and the game is over.', AppColors.UI_MESSAGE_INFO);
                this.level.hud.showMarker(hudX + 5, 83, hudX + hudPanelWidth - 5, 108, "Nexus Health");
                await this.waitForSpacePress();
                this.currentStep = TutorialStep.ExplainEnergy;
                await this.executeStep();
                break;

            case TutorialStep.ExplainEnergy:
                this.level.hud.persistedInfo('This is your Energy: The lifeblood of your defense.\nGain Energy by eliminating Glitches. Use it to construct and repair your towers.', AppColors.UI_MESSAGE_INFO);
                this.level.hud.showMarker(hudX + 5, 108, hudX + hudPanelWidth - 5, 133, "Energy");
                await this.waitForSpacePress();
                this.currentStep = TutorialStep.ExplainWave;
                await this.executeStep();
                break;

            case TutorialStep.ExplainWave:
                this.level.hud.persistedInfo('This displays the current wave of Glitches.\nEach wave brings new challenges. Prepare accordingly!', AppColors.UI_MESSAGE_INFO);
                this.level.hud.showMarker(hudX + 5, 133, hudX + hudPanelWidth - 5, 158, "Wave");
                await this.waitForSpacePress();
                this.level.hud.showTowers(true); // Show towers section
                this.currentStep = TutorialStep.ExplainTowerArsenal;
                await this.executeStep();
                break;

            case TutorialStep.ExplainTowerArsenal:
                this.level.hud.persistedInfo('Now, let\'s examine your Tower Arsenal.', AppColors.UI_MESSAGE_INFO);
                this.level.hud.showMarker(hudX, 200, hudX + hudPanelWidth, 800, "Tower Arsenal");
                await this.waitForSpacePress();
                this.currentStep = TutorialStep.ExplainLaserTower;
                await this.executeStep();
                break;

            case TutorialStep.ExplainLaserTower:
                this.level.hud.persistedInfo('The Laser Tower projects concentrated particle beams.\nThese beams travel in a straight line, dealing precise damage.', AppColors.UI_MESSAGE_INFO);
                this.level.hud.showMarker(hudX + 15, 250, hudX + hudPanelWidth - 15, 340, "Laser Tower");
                await this.waitForSpacePress();
                this.currentStep = TutorialStep.ExplainBombTower;
                await this.executeStep();
                break;

            case TutorialStep.ExplainBombTower:
                this.level.hud.persistedInfo('The Bomb Tower charges and releases a volatile\nparticle explosion. Effective against groups of Glitches.', AppColors.UI_MESSAGE_INFO);
                this.level.hud.showMarker(hudX + 15, 350, hudX + hudPanelWidth - 15, 440, "Bomb Tower");
                await this.waitForSpacePress();
                this.currentStep = TutorialStep.ExplainSlowTower;
                await this.executeStep();
                break;

            case TutorialStep.ExplainSlowTower:
                this.level.hud.persistedInfo('The Slow Tower emits a continuous, disruptive wave\nthat significantly reduces the speed of Glitches within its radius.', AppColors.UI_MESSAGE_INFO);
                this.level.hud.showMarker(hudX + 15, 450, hudX + hudPanelWidth - 15, 540, "Slow Tower");
                await this.waitForSpacePress();
                this.currentStep = TutorialStep.ExplainDeselect;
                await this.executeStep();
                break;

            case TutorialStep.ExplainDeselect:
                this.level.hud.persistedInfo('Should you wish to deselect a tower, simply click on this button.', AppColors.UI_MESSAGE_INFO);
                this.level.hud.showMarker(hudX + 40, 560, hudX + hudPanelWidth - 50, 615, "Deselect");
                await this.waitForSpacePress();
                this.level.hud.showHelp(true); // Show help section
                this.currentStep = TutorialStep.ExplainHelp;
                await this.executeStep();
                break;

            case TutorialStep.ExplainHelp:
                this.level.hud.persistedInfo('This section provides helpful reminders and tips to aid you in your defense!', AppColors.UI_MESSAGE_INFO);
                this.level.hud.showMarker(hudX, GAME_HEIGHT - 270, hudX + hudPanelWidth, GAME_HEIGHT - 20, "Help");
                await this.waitForSpacePress();
                this.player.setVisible(true);
                this.currentStep = TutorialStep.ExplainPlayer;
                await this.executeStep();
                break;

            case TutorialStep.ExplainPlayer:
                this.level.hud.persistedInfo('This is you, Guardian! The sentient protector of the Nexus.', AppColors.UI_MESSAGE_INFO);
                await this.waitForSpacePress();
                this.currentStep = TutorialStep.ExplainPlayerMovement;
                await this.executeStep();
                break;

            case TutorialStep.ExplainPlayerMovement:
                this.level.hud.persistedInfo('Navigate the battlefield using the WASD keys.', AppColors.UI_MESSAGE_INFO);
                this.level.physics.resume(); // Allow player movement
                await this.waitForEvent('playerMoved');
                this.level.physics.pause();
                this.level.pathsManager.showStart(true);
                this.currentStep = TutorialStep.ExplainStaticDen;
                await this.executeStep();
                break;

            case TutorialStep.ExplainStaticDen:
                this.level.hud.persistedInfo('This is Static\'s Den, the source of\nthe Glitch incursions. All Glitches spawn from here.', AppColors.UI_MESSAGE_INFO);
                this.level.hud.showMarker(5, GAME_HEIGHT / 2 - 48, 95, GAME_HEIGHT / 2 + 48, "Static's Den");
                await this.waitForSpacePress();
                this.level.pathsManager.showEnd(true);
                this.currentStep = TutorialStep.ExplainNexus;
                await this.executeStep();
                break;

            case TutorialStep.ExplainNexus:
                this.level.hud.persistedInfo('This is the Nexus, the heart of the Quantum Realm.\nProtect it at all costs!', AppColors.UI_MESSAGE_INFO);
                this.level.hud.showMarker(GAME_WIDTH - 95, GAME_HEIGHT / 2 - 48, GAME_WIDTH - 5, GAME_HEIGHT / 2 + 48, "The Nexus");
                await this.waitForSpacePress();
                this.level.pathsManager.showPath(true);
                this.currentStep = TutorialStep.ExplainPath;
                await this.executeStep();
                break;

            case TutorialStep.ExplainPath:
                this.level.hud.persistedInfo('This is the path Glitches will take from Static\'s Den to the Nexus.', AppColors.UI_MESSAGE_INFO);
                await this.waitForSpacePress();
                this.level.hud.hideMarker();
                this.currentStep = TutorialStep.SelectLaserTower; // Re-use this step for actual gameplay
                await this.executeStep();
                break;

            case TutorialStep.SelectLaserTower: // Actual gameplay starts here
                this.level.hud.persistedInfo('Select the Laser Tower from the menu on the right.', AppColors.UI_MESSAGE_INFO);
                this.level.hud.enableTowerSelection();
                await this.waitForEvent('towerSelected');
                this.currentStep = TutorialStep.PlaceFirstTower;
                await this.executeStep();
                break;

            case TutorialStep.PlaceFirstTower:
                this.level.hud.persistedInfo('Now, place the tower near the path to defend against the first wave.', AppColors.UI_MESSAGE_INFO);
                this.level.towerManager.enablePlacement();
                await this.waitForEvent('towerPlaced');
                this.level.hud.disableTowerSelection();
                this.level.towerManager.disablePlacement();
                this.currentStep = TutorialStep.FirstWave;
                await this.executeStep();
                break;

            case TutorialStep.FirstWave:
                this.level.hud.persistedInfo('Here come the Glitches! Your tower will attack automatically.', AppColors.UI_MESSAGE_SUCCESS);
                this.level.physics.resume();
                this.level.waveManager.resume();
                this.level.waveManager.startWave(1);
                await this.waitForEvent('waveCompleted');
                this.level.waveManager.pause();
                this.currentStep = TutorialStep.IntroduceFastEnemy;
                await this.executeStep();
                break;

            case TutorialStep.IntroduceFastEnemy:
                this.level.hud.persistedInfo('Faster enemies are approaching! Select another tower to help.', AppColors.UI_MESSAGE_INFO);
                this.level.hud.enableTowerSelection();
                await this.waitForEvent('towerSelected');
                this.currentStep = TutorialStep.PlaceSecondTower;
                await this.executeStep();
                break;

            case TutorialStep.PlaceSecondTower:
                this.level.hud.persistedInfo('Place your second tower strategically.', AppColors.UI_MESSAGE_INFO);
                this.level.towerManager.enablePlacement();
                await this.waitForEvent('towerPlaced');
                this.level.hud.disableTowerSelection();
                this.level.towerManager.disablePlacement();
                this.currentStep = TutorialStep.SecondWave;
                await this.executeStep();
                break;

            case TutorialStep.SecondWave:
                this.level.hud.persistedInfo('Excellent! Let\'s see how your defenses hold up.', AppColors.UI_MESSAGE_SUCCESS);
                this.level.physics.resume();
                this.level.waveManager.resume();
                this.level.hud.enableTowerSelection();
                this.level.towerManager.enablePlacement();
                this.level.waveManager.startWave(2);
                await this.waitForEvent('waveCompleted');
                this.level.waveManager.pause();
                this.level.hud.disableTowerSelection();
                this.level.towerManager.disablePlacement();
                this.currentStep = TutorialStep.IntroduceTankEnemy;
                await this.executeStep();
                break;

            case TutorialStep.IntroduceTankEnemy:
                this.level.hud.persistedInfo('These are Tank Glitches.\nThey are slow but have high health. Prepare for them!', AppColors.UI_MESSAGE_INFO);
                this.level.physics.resume();
                this.level.waveManager.resume();
                this.level.hud.enableTowerSelection();
                this.level.towerManager.enablePlacement();
                this.level.waveManager.startWave(3);
                await this.waitForEvent('waveCompleted');
                this.level.waveManager.pause();
                this.level.hud.disableTowerSelection();
                this.level.towerManager.disablePlacement();
                this.currentStep = TutorialStep.IntroducePhantom;
                await this.executeStep();
                break;

            case TutorialStep.IntroducePhantom:
                this.level.hud.persistedInfo('Watch out! A Phantom is on the move.\nIt disables towers! Destroy it quickly!', AppColors.UI_MESSAGE_ERROR);
                this.level.physics.resume();
                this.level.waveManager.resume();
                this.level.waveManager.startWave(4);
                await this.waitForEvent('towerDeactivated'); // Wait for a tower to be deactivated
                this.level.waveManager.pause();
                this.currentStep = TutorialStep.TowerDeactivated;
                await this.executeStep();
                break;

            case TutorialStep.TowerDeactivated:
                this.level.waveManager.pause(); // Pause wave manager
                this.level.hud.persistedInfo('A tower has been disabled! Approach it\nand press "E" THRICE to revive it.', AppColors.UI_MESSAGE_ERROR);
                this.level.physics.resume(); // Allow player movement
                await this.waitForEvent('towerRevived');
                this.currentStep = TutorialStep.TowerRevived;
                await this.executeStep();
                break;

            case TutorialStep.TowerRevived:
                this.level.waveManager.resume();
                this.level.hud.persistedInfo('Tower revived! Great job, Guardian!', AppColors.UI_MESSAGE_SUCCESS);
                this.level.waveManager.pause();
                this.currentStep = TutorialStep.FinalWave;
                await this.executeStep();
                break;

            case TutorialStep.FinalWave:
                this.level.hud.persistedInfo('Clear this final wave to complete your training!', AppColors.UI_MESSAGE_INFO);
                this.level.physics.resume();
                this.level.hud.enableTowerSelection();
                this.level.towerManager.enablePlacement();
                this.level.waveManager.resume();
                this.level.waveManager.startWave(5);
                await this.waitForEvent('waveCompleted');
                this.level.waveManager.pause();
                this.level.hud.disableTowerSelection();
                this.level.towerManager.disablePlacement();
                this.currentStep = TutorialStep.Complete;
                await this.executeStep();
                break;

            case TutorialStep.Complete:
                this.level.hud.persistedInfo('Tutorial Complete! The Quantum Realm is in your hands.', AppColors.UI_MESSAGE_SUCCESS);
                this.level.time.delayedCall(3000, () => {
                    this.level.easeOutAndStartNextScene(this.level.nextScene());
                });
                break;
        }
    }

    // --- Helper for async waiting ---
    private waitForEvent(eventName: string): Promise<void> {
        return new Promise(resolve => {
            this.level.events.once(eventName, resolve);
        });
    }

    private waitForSpacePress(): Promise<void> {
        this.level.hud.showSpacebarPrompt(true);
        return new Promise(resolve => {
            this.spacebarKey.once('down', () => {
                this.level.hud.showSpacebarPrompt(false);
                resolve();
            });
        });
    }

    // --- Event Handlers ---
    private onTowerSelected(): void {
        // Handled by executeStep after waitForEvent
    }

    private onTowerPlaced(): void {
        // Handled by executeStep after waitForEvent
    }

    private onWaveCompleted(): void {
        // Handled by executeStep after waitForEvent
    }

    private onTowerDeactivated(): void {
        // Handled by executeStep after waitForEvent
    }

    private onTowerRevived(): void {
        // Handled by executeStep after waitForEvent
    }

    private onPlayerMoved(): void {
        // Handled by executeStep after waitForEvent
    }

    private handleSpacePress(): void {
        // This is now handled by waitForSpacePress promise resolver
    }

    private handleEPress(): void {
        // This is handled by the PlayerManager's revive logic, which then emits 'towerRevived'
    }

    public destroy(): void {
        this.level.events.off('waveCompleted', this.onWaveCompleted, this);
        this.level.events.off('towerDeactivated', this.onTowerDeactivated, this);
        this.level.events.off('towerRevived', this.onTowerRevived, this);
        this.level.events.off('towerSelected', this.onTowerSelected, this);
        this.level.events.off('towerPlaced', this.onTowerPlaced, this);
        this.level.events.off('playerMoved', this.onPlayerMoved, this);

        this.spacebarKey.off('down', this.handleSpacePress, this);
        this.eKey.off('down', this.handleEPress, this);
    }
}
