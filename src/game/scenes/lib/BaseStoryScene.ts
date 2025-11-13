import * as Phaser from 'phaser';
import { AppColors, phaserColor } from '../../scripts/Colors';
import { HEIGHT, WIDTH } from '../../scripts/Util';
import { GameObject } from '../../core/GameObject';

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
        this.showTitle();
        this.createGameVisualSeparators();

        const spaceKeyListener = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spaceKeyListener?.on('down', () => {
            this.showNextStep();
        });

        const escapeKeyListener = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        escapeKeyListener?.on('down', () => {
            this.scene.start('MenuScene');
        });
    }

    update(time: number, delta: number): void {
        this.visuals.forEach(v => {
            if (v instanceof GameObject) {
                v.update(time, delta);
            }
        });
    }

    protected showTitle(): void {
        if (this.titleText) {
            this.titleText.destroy();
        }
        this.titleText = this.add.text(WIDTH / 2, HEIGHT / 2, this.getStoryConfig().title || '', {
            font: '64px',
            color: AppColors.UI_TEXT,
            padding: { x: 20, y: 10 },
            align: 'center',
            wordWrap: { width: WIDTH - 100 },
            fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(200);

        this.add.text(WIDTH - 250, HEIGHT - 50, 'Press [SPACE] to continue, [ESC] to quit.', {
            font: '16px',
            color: AppColors.UI_TEXT,
            padding: { x: 20, y: 10 },
            align: 'center',
            wordWrap: { width: WIDTH - 100 }
        }).setOrigin(0.5).setDepth(200);
    }

    protected showNextStep(): void {
        if (this.titleText) {
            this.titleText.destroy();
        }
        if (this.instructionText) {
            this.instructionText.destroy();
        }

        if (this.currentStep < this.steps.length) {
            const step = this.steps[this.currentStep];
            this.instructionText = this.add.text(WIDTH / 2, HEIGHT / 2, step.text, {
                font: '32px',
                color: AppColors.UI_TEXT,
                padding: { x: 20, y: 10 },
                align: 'center',
                wordWrap: { width: WIDTH - 100 }
            }).setOrigin(0.5).setDepth(200);

            if (step.action) {
                const newVisuals = step.action(this);
                if (newVisuals) {
                    if (Array.isArray(newVisuals)) {
                        this.visuals.push(...newVisuals);
                    } else {
                        this.visuals.push(newVisuals);
                    }
                }
            }

            this.currentStep++;
            this.add.text(WIDTH - 250, HEIGHT - 50, 'Press [SPACE] to continue, [ESC] to quit.', {
                font: '16px',
                color: AppColors.UI_TEXT,
                padding: { x: 20, y: 10 },
                align: 'center',
                wordWrap: { width: WIDTH - 100 }
            }).setOrigin(0.5).setDepth(200);
        } else {
            this.onStoryComplete();
        }
    }

    protected createGameVisualSeparators(): void {
        const graphics = this.add.graphics();
        graphics.lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1);
        graphics.lineBetween(0, 0, WIDTH, 0);
        graphics.lineBetween(0, HEIGHT, WIDTH, HEIGHT);
        graphics.lineBetween(0, 0, 0, HEIGHT);
        graphics.lineBetween(WIDTH, 0, WIDTH, HEIGHT);
        graphics.strokePath();
    }

    shutdown(): void {
        this.currentStep = 0;
        this.steps = [];
        this.titleText?.destroy();
        this.instructionText?.destroy();
        this.visuals?.forEach(v => v.destroy());
        this.visuals = [];
    }
}
