import Phaser from 'phaser';
import {LevelNames, STORY_LEVEL_ORDER} from './lib/LevelNames';
import {WIDTH, HEIGHT, GAME_HEIGHT} from '../scripts/Util';
import {AppColors, phaserColor} from '../scripts/Colors';

export class FullStoryPlaybackScene extends Phaser.Scene {
    private currentStoryIndex: number = 0;
    private storyScenes: LevelNames[] = STORY_LEVEL_ORDER;
    private playbackText!: Phaser.GameObjects.Text;

    constructor() {
        super(LevelNames.FullStoryPlayback);
    }

    create() {
        this.cameras.main.setBackgroundColor(AppColors.GAME_BACKGROUND);

        // Create Game Visual Separators (part of storyElements for final fade-out)
        const graphics = this.add.graphics().setAlpha(0.8);
        graphics.lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1);
        graphics.lineBetween(0, 0, WIDTH, 0);
        graphics.lineBetween(0, HEIGHT, WIDTH, HEIGHT);
        graphics.lineBetween(0, 0, 0, HEIGHT);
        graphics.lineBetween(WIDTH, 0, WIDTH, HEIGHT);
        graphics.strokePath();

        this.playbackText = this.add.text(WIDTH / 2, GAME_HEIGHT / 2, 'Full Story Playback', {
            fontSize: '48px',
            color: AppColors.UI_ACCENT,
            fontFamily: 'PixelFont',
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: this.playbackText,
            alpha: 1,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                this.time.delayedCall(1000, this.startNextStory, [], this);
            }
        });

        // Listen for the custom event from BaseStoryScene on the global game event bus
        this.game.events.on('storyPlaybackComplete', this.onStoryCompleteHandler, this);

        // Allow ESC to exit full playback
        this.input.keyboard?.on('keydown-ESC', () => {
            this.stopAllStoryScenes();
            this.scene.start(LevelNames.MainMenu);
        });
    }

    private startNextStory(): void {
        if (this.currentStoryIndex < this.storyScenes.length) {
            const nextStoryKey = this.storyScenes[this.currentStoryIndex];
            console.log(`Starting story scene: ${nextStoryKey}`);

            // Stop the previous scene if it's still running
            if (this.currentStoryIndex > 0) {
                const previousStoryKey = this.storyScenes[this.currentStoryIndex - 1];
                // Only stop if the scene is active, as it might have already stopped itself
                if (this.scene.isActive(previousStoryKey)) {
                    this.scene.stop(previousStoryKey);
                }
            }

            // Start the next story scene in playback mode
            this.scene.start(nextStoryKey, {isPlaybackMode: true});
            this.currentStoryIndex++;
        } else {
            // All stories played, return to main menu
            console.log('All stories played. Returning to Main Menu.');
            this.stopAllStoryScenes();
            this.scene.start(LevelNames.MainMenu);
        }
    }

    private onStoryCompleteHandler(completedStoryKey: string): void {
        console.log(`Story scene completed: ${completedStoryKey}`);
        this.startNextStory();
    }

    private stopAllStoryScenes(): void {
        // Ensure all potential story scenes are stopped
        this.storyScenes.forEach(key => {
            if (this.scene.isActive(key)) {
                this.scene.stop(key);
            }
        });
    }

    destroy() {
        // Remove the listener from the global game event bus
        this.game.events.off('storyPlaybackComplete', this.onStoryCompleteHandler, this);
        this.input.keyboard?.off('keydown-ESC');
    }
}
