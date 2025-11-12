import { Manager } from '../Manager';
import { Level } from '../Level';

export class AudioManager extends Manager {
    private backgroundMusic: Phaser.Sound.BaseSound | null = null;
    private musicQueue: string[] = [];

    constructor(protected level: Level) {
        super(level);
    }

    public setup(): void {
        // Preload audio assets here
        // Example:
        // this.level.load.audio('music1', 'assets/music/track1.mp3');
        // this.level.load.audio('laser_fire', 'assets/sfx/laser.wav');
        // this.level.load.audio('enemy_die', 'assets/sfx/explosion.wav');
    }

    public playSound(key: string): void {
        if (this.level.state.soundEnabled) {
            this.level.sound.play(key);
        }
    }

    public playMusic(key: string, loop: boolean = true): void {
        if (this.level.state.soundEnabled) {
            if (this.backgroundMusic) {
                this.backgroundMusic.stop();
            }
            this.backgroundMusic = this.level.sound.add(key, { loop });
            this.backgroundMusic.play();
        }
    }

    public queueMusic(key: string): void {
        this.musicQueue.push(key);
        if (!this.backgroundMusic || !this.backgroundMusic.isPlaying) {
            this.playNextInQueue();
        }
    }

    private playNextInQueue(): void {
        if (this.musicQueue.length > 0) {
            const nextTrack = this.musicQueue.shift() as string;
            this.playMusic(nextTrack, false); // Play once, don't loop
            if (this.backgroundMusic) {
                this.backgroundMusic.once('complete', this.playNextInQueue, this);
            }
        }
    }

    public stopMusic(): void {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
        }
    }

    public destroy(): void {
        this.stopMusic();
        this.musicQueue = [];
    }
}
