import {Manager} from '../Manager';
import {State} from '../State.ts';

export class AudioManager extends Manager {
    private backgroundMusic: Phaser.Sound.BaseSound | null = null;
    private musicQueue: string[] = [];
    private _sfxVolume: number = 1; // Default SFX volume
    private _musicVolume: number = 1; // Default Music volume

    constructor(protected level: Phaser.Scene) {
        super(level);
    }

    public setup(): void {

        this.level.load.audio('MainMenuMusic', 'assets/music/MainMenuMusic.mp3');
        //
        // // Audio for Introduction
        // this.level.load.audio('Story_Introduction_1', 'assets/narration/Story_Introduction_Title.wav');
        // this.level.load.audio('Story_Introduction_2', 'assets/narration/Story_Introduction_1.wav');
        // this.level.load.audio('Story_Introduction_3', 'assets/narration/Story_Introduction_2.wav');
        // this.level.load.audio('Story_Introduction_4', 'assets/narration/Story_Introduction_3.wav');
        // this.level.load.audio('Story_Introduction_5', 'assets/narration/Story_Introduction_4.wav');
        // this.level.load.audio('Story_Introduction_6', 'assets/narration/Story_Introduction_5.wav');
        // this.level.load.audio('Story_Introduction_7', 'assets/narration/Story_Introduction_6.wav');
        // this.level.load.audio('Story_Introduction_8', 'assets/narration/Story_Introduction_7.wav');
        // this.level.load.audio('Story_Introduction_9', 'assets/narration/Story_Introduction_8.wav');
        // this.level.load.audio('Story_Introduction_10', 'assets/narration/Story_Introduction_9.wav');
        //
        // // Audio for HelloGenie
        // this.level.load.audio('Story_HelloGenie_1', 'assets/narration/Story_HelloGenie_Title.wav');
        // this.level.load.audio('Story_HelloGenie_2', 'assets/narration/Story_HelloGenie_1.wav');
        // this.level.load.audio('Story_HelloGenie_3', 'assets/narration/Story_HelloGenie_2.wav');
        // this.level.load.audio('Story_HelloGenie_4', 'assets/narration/Story_HelloGenie_3.wav');
        //
        // // Audio for TrustMe
        // this.level.load.audio('Story_TrustMe_1', 'assets/narration/Story_TrustMe_Title.wav');
        // this.level.load.audio('Story_TrustMe_2', 'assets/narration/Story_TrustMe_1.wav');
        // this.level.load.audio('Story_TrustMe_3', 'assets/narration/Story_TrustMe_2.wav');
        //
        // // Audio for ThePhantom
        // this.level.load.audio('Story_ThePhantom_1', 'assets/narration/Story_ThePhantom_Title.wav');
        // this.level.load.audio('Story_ThePhantom_2', 'assets/narration/Story_ThePhantom_1.wav');
        // this.level.load.audio('Story_ThePhantom_3', 'assets/narration/Story_ThePhantom_2.wav');
        // this.level.load.audio('Story_ThePhantom_4', 'assets/narration/Story_ThePhantom_3.wav');
        // this.level.load.audio('Story_ThePhantom_5', 'assets/narration/Story_ThePhantom_4.wav');
        // this.level.load.audio('Story_ThePhantom_6', 'assets/narration/Story_ThePhantom_5.wav');
        //
        // // Audio for RiseOfStatic
        // this.level.load.audio('Story_RiseOfStatic_1', 'assets/narration/Story_RiseOfStatic_Title.wav');
        // this.level.load.audio('Story_RiseOfStatic_2', 'assets/narration/Story_RiseOfStatic_1.wav');
        // this.level.load.audio('Story_RiseOfStatic_3', 'assets/narration/Story_RiseOfStatic_2.wav');
        // this.level.load.audio('Story_RiseOfStatic_4', 'assets/narration/Story_RiseOfStatic_3.wav');
        // this.level.load.audio('Story_RiseOfStatic_5', 'assets/narration/Story_RiseOfStatic_4.wav');
        // this.level.load.audio('Story_RiseOfStatic_6', 'assets/narration/Story_RiseOfStatic_5.wav');
        //
        // // Audio for Breakthrough
        // this.level.load.audio('Story_Breakthrough_1', 'assets/narration/Story_Breakthrough_Title.wav');
        // this.level.load.audio('Story_Breakthrough_2', 'assets/narration/Story_Breakthrough_1.wav');
        // this.level.load.audio('Story_Breakthrough_3', 'assets/narration/Story_Breakthrough_2.wav');
        // this.level.load.audio('Story_Breakthrough_4', 'assets/narration/Story_Breakthrough_3.wav');
        //
        // // Audio for TheCliffhanger
        // this.level.load.audio('Story_TheCliffhanger_1', 'assets/narration/Story_TheCliffhanger_Title.wav');
    }

    public get sfxVolume(): number {
        return this._sfxVolume;
    }

    public set sfxVolume(value: number) {
        this._sfxVolume = Phaser.Math.Clamp(value, 0, 1);
    }

    public increaseSfxVolume(amount: number = 0.1): void {
        this.sfxVolume += amount;
    }

    public decreaseSfxVolume(amount: number = 0.1): void {
        this.sfxVolume -= amount;
    }

    public get musicVolume(): number {
        return this._musicVolume;
    }

    public set musicVolume(value: number) {
        this._musicVolume = Phaser.Math.Clamp(value, 0, 1);
        if (this.backgroundMusic && this.backgroundMusic.isPlaying) {
            // @ts-ignore
            this.backgroundMusic.setVolume(this._musicVolume);
        }
    }

    public increaseMusicVolume(amount: number = 0.1): void {
        this.musicVolume += amount;
    }

    public decreaseMusicVolume(amount: number = 0.1): void {
        this.musicVolume -= amount;
    }

    public playSound(key: string, config?: { volume?: number; detune?: number; rate?: number}): void {
        const gameState = this.level.sys.registry.get('gameState');
        if ((gameState as State).soundEnabled) {
            // clear any playing sound
            this.level.sound.stopAll();
            if (!this.level.cache.audio.exists(key)) {
                console.warn(`Could not find ${key} in AudioManager.`);
                return;
            }
            this.level.sound.play(key, {
                volume: (config?.volume ?? 1) * this._sfxVolume,
                detune: config?.detune ?? -600,
                rate: config?.rate ?? 1
            });
        }
    }

    public playHeavySound(key: string) {
        return this.playSound(key, {volume:0.5, detune: -600, rate: 1.4});
    }

    public playLightSound(key: string) {
        return this.playSound(key, {volume:0.4, detune: 200, rate: 1});
    }

    public playMusic(key: string, loop: boolean = true): void {
        const gameState = this.level.sys.registry.get('gameState');
        if ((gameState as State).soundEnabled) {
            if (this.backgroundMusic) {
                this.backgroundMusic.stop();
            }
            this.backgroundMusic = this.level.sound.add(key, {loop});
            this.backgroundMusic.play({volume: this._musicVolume});
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
