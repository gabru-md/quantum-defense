import * as Phaser from 'phaser';
import {AppColors, phaserColor} from '../../scripts/Colors';
import {HEIGHT, WIDTH} from '../../scripts/Util';
import {GameObject} from '../../core/GameObject';
import {
    createBigGlitchTexture,
    createBigTowerTexture,
    createEnemyTexture,
    createPlayerTexture,
    createSpecialEnemyTexture,
    createTowerTexture,
} from '../../scripts/TextureUtils';
import {getLevelNameKey, getStoryName, LevelNames} from "./LevelNames.ts";
import {AudioManager} from "./manager/AudioManager.ts";
import {BackgroundEffectsManager} from "../../effects/BackgroundEffectsManager.ts";
import {GlitchAnnihilationEffect} from "../../effects/GlitchAnnihilationEffect.ts"; // Import texture utility functions

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
    private underline: Phaser.GameObjects.Graphics;
    audioManager: AudioManager
    backgroundEffectsManager: BackgroundEffectsManager;
    riftManager: GlitchAnnihilationEffect;
    protected isPlaybackMode: boolean = false; // New property for full story playback

    constructor(key: string) {
        super(key);
        this.audioManager = new AudioManager(this);
        this.backgroundEffectsManager = new BackgroundEffectsManager(this);
        this.riftManager = new GlitchAnnihilationEffect(this);
    }

    // Abstract methods to be implemented by subclasses
    abstract getStoryConfig(): {
        title?: string;
        steps: StoryStep[];
        nextScene: LevelNames; // Changed to LevelNames enum
    };

    // Optional override for custom completion logic
    onStoryComplete(): void {
        if (this.isPlaybackMode) {
            // In playback mode, emit an event for the orchestrator to handle the next scene
            this.game.events.emit('storyPlaybackComplete', this.scene.key); // Emitting on global game events
        } else {
            // Otherwise, proceed to the next defined scene (gameplay or main menu)
            this.scene.start(this.getStoryConfig().nextScene);
        }
    }

    preload(): void {
        this.steps = this.getStoryConfig().steps;
        this.audioManager.setup();
        // Preload common textures for all story scenes
        createBigTowerTexture(this, 'nexus', 256, AppColors.NEXUS_OUTER);
        createBigGlitchTexture(this, 'static', 256, AppColors.STATIC_OUTER);
        createPlayerTexture(this, 'player', 24, AppColors.PLAYER);
        createEnemyTexture(this, 'enemy1', 32, AppColors.ENEMY_NORMAL);
        createEnemyTexture(this, 'enemy2', 32, AppColors.ENEMY_FAST);
        createEnemyTexture(this, 'enemy3', 32, AppColors.ENEMY_TANK);
        createTowerTexture(this, 'tower1', 64, AppColors.TOWER_LASER);
        createTowerTexture(this, 'tower2', 64, AppColors.TOWER_BOMB);
        createTowerTexture(this, 'tower3', 64, AppColors.TOWER_SLOW);
        createSpecialEnemyTexture(this, 'specialEnemy', 32, AppColors.SPECIAL_ENEMY);
        // Preload new textures
        createPlayerTexture(this, 'quantum_echo_texture', 24, AppColors.PLAYER); // Assuming similar to player texture for now
        createPlayerTexture(this, 'genie_texture', 2, AppColors.PLAYER); // Placeholder color
        createTowerTexture(this, 'phantom_killer_tower_texture', 64, AppColors.ENEMY_FAST); // Placeholder color
        createPlayerTexture(this, 'upgrade_icon_texture', 24, AppColors.ENEMY_TANK); // Placeholder color
    }

    init(data?: { isPlaybackMode?: boolean }): void {
        this.currentStep = 0;
        this.steps = [];
        this.visuals = [];
        this.storyElements = [];
        this.isTyping = false;
        if (this.typingTimer) {
            this.typingTimer.remove();
            this.typingTimer = null;
        }
        this.isPlaybackMode = data?.isPlaybackMode || false; // Initialize playback mode
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

        // Only allow direct scene skip if not in playback mode
        if (!this.isPlaybackMode) {
            const tildeKeyListener = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.BACKTICK);
            tildeKeyListener?.on('down', () => {
                this.scene.start(this.getStoryConfig().nextScene);
            });
        }

        const escapeKeyListener = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        escapeKeyListener?.on('down', () => {
            // If in playback mode, stop playback and go to MainMenu
            if (this.isPlaybackMode) {
                this.scene.stop(this.scene.key);
                this.scene.start(LevelNames.MainMenu);
            } else {
                // Otherwise, go to MainMenu as usual
                this.scene.start(LevelNames.MainMenu);
            }
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

        // These are the title sounds
        this.audioManager.playHeavySound(this.getCurrentStepAudio());


        const textBounds = this.titleText.getBounds();
        this.underline = this.add.graphics();
        this.underline.lineStyle(4, 0xffffff, 1); // thickness, color, alpha — adjust as needed
        this.underline.beginPath();
        this.underline.moveTo(textBounds.x, textBounds.bottom + 5); // small gap below text
        this.underline.lineTo(textBounds.x + textBounds.width, textBounds.bottom + 5);
        this.underline.strokePath();
        this.underline.setDepth(200);

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
        if (this.underline) {
            this.underline.destroy();
            this.underline = null as any;
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
            // skip animation for Introduction scene as it is handled differently
            if (this.scene.key !== getStoryName(LevelNames.Tutorial)) { // Changed from Introduction to Tutorial
                this.animateElementsOffScreen();
            }
            this.time.delayedCall(1500, () => {
                this.onStoryComplete();
            })
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
                        duration: 400
                    });
                }
            },
            repeat: fullText.length // Repeat for each character
        });
        if (this.scene.key === getStoryName(LevelNames.Tutorial)) { // Changed from Introduction to Tutorial
            this.audioManager.playHeavySound(this.getCurrentStepAudio());
        } else {
            // Play light sound during narration always
            this.audioManager.playLightSound(this.getCurrentStepAudio());
        }
    }

    shutdown(): void {
        this.currentStep = 0;
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
        
        this.backgroundEffectsManager.stop();

        // Remove textures to prevent memory leaks if they are not used elsewhere
        this.textures.remove('nexus');
        this.textures.remove('static');
        this.textures.remove('player');
        this.textures.remove('enemy1');
        this.textures.remove('enemy2');
        this.textures.remove('enemy3');
        this.textures.remove('tower1');
        this.textures.remove('tower2');
        this.textures.remove('tower3');
        this.textures.remove('specialEnemy');
        this.textures.remove('quantum_echo_texture');
        this.textures.remove('genie_texture');
        this.textures.remove('phantom_killer_tower_texture');
        this.textures.remove('upgrade_icon_texture');
    }

    // Animation Related

    animateIn = (element: Phaser.GameObjects.GameObject) => {
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

    animateOut(v: Phaser.GameObjects.GameObject) {
        this.tweens.add({
            targets: v,
            // @ts-ignore
            y: v.y < HEIGHT / 2 ? -200 : HEIGHT + 200,
            duration: 500,
            ease: 'Power2',
            onComplete: () => v.destroy(),
        });
    }

    protected animateElementsOffScreen() {
        this.visuals.forEach(v => {
            this.animateOut(v);
        });
    }

    private getCurrentStepAudio(): string {
        const levelNameKey: string = getLevelNameKey(this.scene.key);
        return `Story_${levelNameKey}_${this.currentStep + 1}`;
    }
}
