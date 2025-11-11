import {Level} from '../Level';
import {Manager} from '../Manager';
import {AppColors} from '../../../scripts/Colors';
import * as Phaser from 'phaser';

export class TutorialManager extends Manager {
    private tutorialSteps: (() => void)[] = [];
    private currentStep: number = 0;
    private instructionText!: Phaser.GameObjects.Text | null;

    constructor(protected level: Level) {
        super(level);
        this.setupTutorialSteps();
    }

    public setup(): void {
        this.startNextStep();
    }

    private setupTutorialSteps(): void {
        this.tutorialSteps = [
            () => this.showInstruction("Welcome! Use WASD to move your character.", () => {
                this.level.events.once('playerMoved', () => this.startNextStep());
            }),
            () => this.showInstruction("An enemy is coming! Select a tower from the HUD on the right.", () => {
                this.level.events.once('towerPlaced', () => this.startNextStep());
            }),
            () => this.showInstruction("Great! Your tower will now attack enemies in range.", () => {
                this.level.waveManager.startWave(1); // Spawn one enemy
                this.level.events.once('enemyDied', () => this.startNextStep());
            }),
            () => this.showInstruction("Watch out! This Special Enemy deactivates nearby towers.", () => {
                this.level.waveManager.startWave(2); // Spawn one special enemy
                this.level.events.once('towerDeactivated', () => {
                    this.startNextStep();
                });
            }),
            () =>
                this.showInstruction("Your tower is now offline! Move near it and press 'E' to send a revival pulse.", () => {
                    this.level.events.once('towerRevived', () => {
                        this.level.waveManager.pause()
                        this.instructionText?.destroy();
                        this.startNextStep();
                    });
                }),
            () => this.showInstruction("Excellent! You can also use your 'E' pulse to damage Special Enemies directly. Try it now!", () => {
                this.level.events.once('specialEnemyKilledByPlayer', () => this.startNextStep());
                this.level.waveManager.resume()
            }),
            () => this.showInstruction("You've learned the basics! Survive the final wave to win.", () => {
                this.level.waveManager.startWave(3); // Final tutorial wave
                this.level.events.once('waveCompleted', () => this.startNextStep());
            }),
            () => this.showInstruction("Tutorial Complete! You are now ready for the real challenge.", () => {
                this.level.scene.start('Level 1');
            }),
        ];
    }

    private startNextStep(): void {
        if (this.currentStep < this.tutorialSteps.length) {
            this.tutorialSteps[this.currentStep]();
            this.currentStep++;
        }
    }

    private showInstruction(text: string, onAcknowledge: () => void): void {
        this.level.state.isTutorialActive = true;
        const fullText = `${text}\n\n(Press SPACE to continue)`;

        this.instructionText = this.level.add.text(this.level.scale.width / 2, 150, fullText, {
            font: '32px',
            color: AppColors.UI_TEXT,
            padding: {x: 20, y: 10},
            align: 'center',
            wordWrap: {width: this.level.scale.width - 100}
        }).setOrigin(0.625).setDepth(200);

        // @ts-ignore
        const spaceKeyListener = this.level.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        spaceKeyListener.once('down', () => {
            this.instructionText?.destroy();
            this.level.state.isTutorialActive = false;
            onAcknowledge();
        });
    }

    destroy() {
        this.instructionText?.destroy();
        this.level.state.isTutorialActive = false;
    }
}
