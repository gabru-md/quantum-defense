import { Level } from '../Level.ts';
import { AppColors } from '../../../scripts/Colors.ts';
import Phaser from 'phaser';

enum TutorialStep {
    Start,
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

    constructor(level: Level) {
        this.level = level;

        // Listen for game events
        this.level.events.on('waveCompleted', this.onWaveCompleted, this);
        this.level.events.on('towerDeactivated', this.onTowerDeactivated, this);
        this.level.events.on('towerRevived', this.onTowerRevived, this);
        this.level.events.on('towerSelected', this.onTowerSelected, this);
        this.level.events.on('towerPlaced', this.onTowerPlaced, this);
        this.level.events.on('playerMoved', this.onPlayerMoved, this); // Assuming player movement is an event

        // Input keys
        // @ts-ignore
        this.spacebarKey = this.level.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // @ts-ignore
        this.eKey = this.level.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        this.spacebarKey.on('down', this.handleSpacePress, this);
        this.eKey.on('down', this.handleEPress, this);
    }

    public startTutorial(): void {
        this.level.state.energy = 9999; // Infinite energy for tutorial
        this.level.hud.disableTowerSelection();
        this.level.towerManager.disablePlacement();
        this.level.physics.pause(); // Pause physics initially

        this.level.time.delayedCall(1000, () => this.executeStep());
    }

    private executeStep(): void {
        this.level.hud.hideInfo(); // Clear previous info messages
        this.level.physics.pause(); // Pause physics by default for instructional steps

        switch (this.currentStep) {
            case TutorialStep.Start:
                this.level.hud.info('Welcome, Guardian! We will guide you through the basics.', AppColors.UI_MESSAGE_INFO);
                this.level.time.delayedCall(3000, () => {
                    this.currentStep = TutorialStep.SelectLaserTower;
                    this.executeStep();
                });
                break;

            case TutorialStep.SelectLaserTower:
                this.level.hud.info('Select the Laser Tower from the menu on the right.', AppColors.UI_MESSAGE_INFO, undefined, false);
                this.level.hud.enableTowerSelection();
                break;

            case TutorialStep.PlaceFirstTower:
                this.level.hud.info('Now, place the tower near the path to defend against the first wave.', AppColors.UI_MESSAGE_INFO, undefined, false);
                this.level.towerManager.enablePlacement();
                break;

            case TutorialStep.FirstWave:
                this.level.hud.info('Here come the Glitches! Your tower will attack automatically.', AppColors.UI_MESSAGE_SUCCESS);
                this.level.hud.disableTowerSelection();
                this.level.towerManager.disablePlacement();
                this.level.physics.resume();
                this.level.waveManager.startWave(1);
                break;

            case TutorialStep.IntroduceFastEnemy:
                this.level.hud.info('Faster enemies are approaching! Place another tower to help.', AppColors.UI_MESSAGE_INFO, undefined, false);
                this.level.hud.enableTowerSelection();
                this.level.towerManager.enablePlacement();
                break;

            case TutorialStep.PlaceSecondTower: // This step is implicitly handled by onTowerPlaced after IntroduceFastEnemy
                break;

            case TutorialStep.SecondWave:
                this.level.hud.info('Excellent! Let\'s see how your defenses hold up.', AppColors.UI_MESSAGE_SUCCESS);
                this.level.hud.disableTowerSelection();
                this.level.towerManager.disablePlacement();
                this.level.physics.resume();
                this.level.waveManager.startWave(2);
                break;

            case TutorialStep.IntroduceTankEnemy:
                this.level.hud.info('These are Tank Glitches. They are slow but have high health.', AppColors.UI_MESSAGE_INFO);
                this.level.physics.resume();
                this.level.waveManager.startWave(3);
                break;

            case TutorialStep.IntroducePhantom:
                this.level.hud.info('Watch out! A Phantom is on the move. It disables towers!', AppColors.UI_MESSAGE_ERROR);
                this.level.physics.resume();
                this.level.waveManager.startWave(4);
                break;

            case TutorialStep.TowerDeactivated:
                this.level.waveManager.pause(); // Pause wave manager, but physics might still be running for player
                this.level.hud.info('A tower has been disabled! Approach it and press "E" to revive it.', AppColors.UI_MESSAGE_ERROR, undefined, false);
                this.level.physics.resume(); // Ensure player can move to revive
                break;

            case TutorialStep.TowerRevived:
                this.level.waveManager.resume();
                this.level.hud.info('Tower revived! Great job, Guardian!', AppColors.UI_MESSAGE_SUCCESS);
                this.level.time.delayedCall(2000, () => {
                    this.currentStep = TutorialStep.FinalWave;
                    this.executeStep();
                });
                break;

            case TutorialStep.FinalWave:
                this.level.hud.info('Clear this final wave to complete your training!', AppColors.UI_MESSAGE_INFO);
                this.level.physics.resume();
                this.level.waveManager.startWave(5);
                break;

            case TutorialStep.Complete:
                this.level.hud.info('Tutorial Complete! The Quantum Realm is in your hands.', AppColors.UI_MESSAGE_SUCCESS);
                this.level.time.delayedCall(3000, () => {
                    this.level.easeOutAndStartNextScene(this.level.nextScene());
                });
                break;
        }
    }

    // --- Event Handlers ---
    private onTowerSelected(): void {
        if (this.currentStep === TutorialStep.SelectLaserTower) {
            this.currentStep = TutorialStep.PlaceFirstTower;
            this.executeStep();
        } else if (this.currentStep === TutorialStep.IntroduceFastEnemy) {
            // User selected a tower after fast enemy intro, ready to place
            this.currentStep = TutorialStep.PlaceSecondTower; // Implicit step
            this.executeStep();
        }
    }

    private onTowerPlaced(): void {
        if (this.currentStep === TutorialStep.PlaceFirstTower) {
            this.level.hud.disableTowerSelection();
            this.level.towerManager.disablePlacement();
            this.currentStep = TutorialStep.FirstWave;
            this.executeStep();
        } else if (this.currentStep === TutorialStep.PlaceSecondTower) {
            this.level.hud.disableTowerSelection();
            this.level.towerManager.disablePlacement();
            this.currentStep = TutorialStep.SecondWave;
            this.executeStep();
        }
    }

    private onWaveCompleted(): void {
        switch (this.currentStep) {
            case TutorialStep.FirstWave:
                this.currentStep = TutorialStep.IntroduceFastEnemy;
                break;
            case TutorialStep.SecondWave:
                this.currentStep = TutorialStep.IntroduceTankEnemy;
                break;
            case TutorialStep.ThirdWave: // After tank wave, introduce phantom
                this.currentStep = TutorialStep.IntroducePhantom;
                break;
            case TutorialStep.PhantomWave: // This case should ideally not be reached if TowerDeactivated triggers first
                // If phantom wave completes without deactivation, something is wrong or phantom was killed too fast
                this.currentStep = TutorialStep.FinalWave;
                break;
            case TutorialStep.FinalWave:
                this.currentStep = TutorialStep.Complete;
                break;
        }
        this.level.time.delayedCall(2000, () => this.executeStep());
    }

    private onTowerDeactivated(): void {
        // Only trigger this step if we are currently in the PhantomWave phase
        if (this.currentStep === TutorialStep.IntroducePhantom || this.currentStep === TutorialStep.PhantomWave) {
            this.currentStep = TutorialStep.TowerDeactivated;
            this.executeStep();
        }
    }

    private onTowerRevived(): void {
        if (this.currentStep === TutorialStep.TowerDeactivated) {
            this.currentStep = TutorialStep.TowerRevived;
            this.executeStep();
        }
    }

    private onPlayerMoved(): void {
        // This event might be useful for future tutorial steps, but not strictly needed for current flow
        // For example: "Move your Guardian using WASD" -> wait for playerMoved event.
    }

    private handleSpacePress(): void {
        // Allow skipping some instructional text if needed, or just for progression
        // For now, let's keep it simple and rely on timed delays or specific game events.
        // If you want to add "Press SPACE to continue" for some steps, you'd add logic here.
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
