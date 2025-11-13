import * as Phaser from 'phaser';
import {AppColors, phaserColor} from '../../scripts/Colors';
import {HEIGHT, WIDTH} from '../../scripts/Util';
import {GameObject} from '../../core/GameObject';

export interface StoryStep {
    text: string;
    action?: (scene: BaseStoryScene) => Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[] | void;
}

export abstract class BaseStoryScene extends Phaser.Scene {
    protected steps: StoryStep[] = [];
    protected currentStep = 0;
    protected instructionText!: Phaser.GameObjects.Text;
    protected visuals: Phaser.GameObjects.GameObject[] = [];
    protected titleText!: Phaser.GameObjects.Text;
    protected continueText!: Phaser.GameObjects.Text;
    protected storyElements: Phaser.GameObjects.GameObject[] = []; // Stores elements for overall scene fade in/out (border, continue text, and persistent visuals)
    protected isTyping: boolean = false;
    private typingTimer: Phaser.Time.TimerEvent | null = null;

    constructor(key: string) {
        super(key);
    }

    // Abstract methods to be implemented by subclasses
    abstract getStoryConfig(): {
        title?: string;
        steps: StoryStep[];
        nextScene: string;
    };

    // Optional override for custom completion logic
    onStoryComplete(): void {
        this.scene.start(this.getStoryConfig().nextScene);
    }

    preload(): void {
        this.steps = this.getStoryConfig().steps;
    }

    create(): void {
        this.cameras.main.setBackgroundColor(AppColors.GAME_BACKGROUND);

        // Create initial elements (title, border, initial continue text) with alpha 0
        this.createInitialDisplay();

        // Fade in all initial story elements (title, border, continue text)
        this.tweens.add({
            targets: [...this.storyElements, this.titleText], // Include titleText in initial fade-in
            alpha: 1,
            ease: 'Power2',
            duration: 500,
            onComplete: () => {
                this.setupInput();
            }
        });
    }

    update(time: number, delta: number): void {
        this.visuals.forEach(v => {
            if (v instanceof GameObject) {
                v.update(time, delta);
            }
        });
    }

    protected setupInput(): void {
        const spaceKeyListener = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spaceKeyListener?.on('down', () => {
            this.handleSpacePress();
        });

        const escapeKeyListener = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        escapeKeyListener?.on('down', () => {
            this.scene.start('MenuScene');
        });
    }

    protected handleSpacePress(): void {
        if (this.isTyping) {
            // If currently typing, complete the text immediately
            if (this.typingTimer) {
                this.typingTimer.remove();
                this.typingTimer = null;
            }
            if (this.instructionText) {
                const currentStepIndex = this.currentStep > 0 ? this.currentStep - 1 : 0;
                if (this.steps[currentStepIndex]) {
                    this.instructionText.setText(this.steps[currentStepIndex].text);
                    this.instructionText.setAlpha(1); // Ensure it's fully visible
                }
            }
            this.isTyping = false;
            // Ensure continueText is visible after immediate completion
            if (this.continueText) {
                this.continueText.setAlpha(1);
            }
        } else {
            // If not typing, proceed to the next step
            this.showNextStep();
        }
    }

    protected createInitialDisplay(): void {
        // Create Title (temporary, not added to storyElements for final fade-out)
        this.titleText = this.add.text(WIDTH / 2, HEIGHT / 2, this.getStoryConfig().title || '', {
            font: '64px',
            color: AppColors.UI_TEXT,
            padding: {x: 20, y: 10},
            align: 'center',
            wordWrap: {width: WIDTH - 100},
            fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(200).setAlpha(0);

        // Create Continue Text (reused throughout the scene, part of storyElements for final fade-out)
        this.continueText = this.add.text(WIDTH - 250, HEIGHT - 50, 'Press [SPACE] to continue, [ESC] to quit.', {
            font: '16px',
            color: AppColors.UI_TEXT,
            padding: {x: 20, y: 10},
            align: 'center',
            wordWrap: {width: WIDTH - 100}
        }).setOrigin(0.5).setDepth(200).setAlpha(0);
        this.storyElements.push(this.continueText);

        // Create Game Visual Separators (part of storyElements for final fade-out)
        const graphics = this.add.graphics().setAlpha(0);
        graphics.lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1);
        graphics.lineBetween(0, 0, WIDTH, 0);
        graphics.lineBetween(0, HEIGHT, WIDTH, HEIGHT);
        graphics.lineBetween(0, 0, 0, HEIGHT);
        graphics.lineBetween(WIDTH, 0, WIDTH, HEIGHT);
        graphics.strokePath();
        this.storyElements.push(graphics);
    }

    protected showNextStep(): void {
        // Destroy previous title or instruction text
        if (this.titleText) {
            this.titleText.destroy();
            this.titleText = null as any;
        }
        if (this.instructionText) {
            this.instructionText.destroy();
            this.instructionText = null as any;
        }

        if (this.currentStep < this.steps.length) {
            const step = this.steps[this.currentStep];

            // Create instruction text with alpha 0 and empty text (temporary, not added to storyElements)
            this.instructionText = this.add.text(WIDTH / 2, HEIGHT / 2, '', {
                font: '32px',
                color: AppColors.UI_TEXT,
                padding: {x: 20, y: 10},
                align: 'center',
                wordWrap: {width: WIDTH - 100}
            }).setOrigin(0.5).setDepth(200).setAlpha(0);

            // Hide continue text while typing
            this.continueText.setAlpha(0);

            // Fade in the instruction text container
            this.tweens.add({
                targets: this.instructionText,
                alpha: 1,
                ease: 'Power1',
                duration: 200,
                onComplete: () => {
                    this.typeText(this.instructionText, step.text, 30);
                }
            });

            if (step.action) {
                const newVisuals = step.action(this);
                if (newVisuals) {
                    if (Array.isArray(newVisuals)) {
                        this.visuals.push(...newVisuals);
                        // Add new visuals to storyElements for fade-out at the end
                        newVisuals.forEach(v => this.storyElements.push(v));
                    } else {
                        this.visuals.push(newVisuals);
                        this.storyElements.push(newVisuals);
                    }
                }
            }

            this.currentStep++;
        } else {
            // All steps shown, fade out all elements and then complete story
            this.tweens.add({
                targets: this.storyElements, // This now includes continueText, border graphics, and all persistent visuals
                alpha: 0,
                ease: 'Power2',
                duration: 500,
                onComplete: () => {
                    this.onStoryComplete();
                }
            });
        }
    }

    protected typeText(textObject: Phaser.GameObjects.Text, fullText: string, delay: number): void {
        this.isTyping = true;
        let i = 0;
        this.typingTimer = this.time.addEvent({
            delay: delay,
            callback: () => {
                textObject.setText(fullText.substring(0, i));
                i++;
                if (i > fullText.length) { // Changed condition to allow one extra iteration to set full text
                    this.typingTimer?.remove();
                    this.typingTimer = null;
                    this.isTyping = false;
                    // Fade in the continue text after typing is complete
                    this.tweens.add({
                        targets: this.continueText,
                        alpha: 1,
                        ease: 'Power1',
                        duration: 200
                    });
                }
            },
            repeat: fullText.length // Repeat for each character
        });
    }

    shutdown(): void {
        this.currentStep = 0;
        this.steps = [];
        this.typingTimer?.remove();
        this.typingTimer = null;
        this.isTyping = false;

        // Destroy temporary elements
        this.titleText?.destroy();
        this.instructionText?.destroy();

        // Destroy all elements managed by storyElements (continueText, border graphics, and all persistent visuals)
        this.storyElements.forEach(el => el.destroy());
        this.storyElements = [];
        this.visuals = []; // Clear visuals array

        // Clear references
        this.titleText = null as any;
        this.instructionText = null as any;
        this.continueText = null as any;
    }

    // Animation Related

    protected animateIn = (element: Phaser.GameObjects.GameObject) => {
        // @ts-ignore
        const y = element.y;
        // @ts-ignore
        element.y = y < HEIGHT / 2 ? -200 : HEIGHT + 200;
        this.tweens.add({
            targets: element,
            y: y,
            duration: 1500,
            ease: 'Power2',
        });
    };

    protected animateOut(v: Phaser.GameObjects.GameObject) {
        this.tweens.add({
            targets: v,
            // @ts-ignore
            y: v.y < HEIGHT / 2 ? -200 : HEIGHT + 200,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => v.destroy(),
        });
    }

}
