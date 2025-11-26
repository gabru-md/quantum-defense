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

        const gameState: State = this.level.sys.registry.get('gameState');
        if (gameState) {
            this._musicVolume = gameState.musicVolume;
            this._sfxVolume = gameState.sfxVolume;
        }

        this.level.load.audio('MainMenuMusic', 'assets/music/MainMenuMusic.mp3');
        this.loadAllSfx();
    }

    private loadAllSfx(): void {
        // Assuming 'this.level' is the context and the base path is 'assets/sfx/'

        this.level.load.audio('bomb_hit', 'assets/sfx/bomb_hit.mp3');
        this.level.load.audio('bomb_plot', 'assets/sfx/bomb_plot.mp3');
        this.level.load.audio('bomb_shoot', 'assets/sfx/bomb_shoot.mp3');
        this.level.load.audio('brute', 'assets/sfx/brute.mp3');
        this.level.load.audio('error_fx', 'assets/sfx/error_fx.mp3');
        this.level.load.audio('guardian_shoot', 'assets/sfx/guardian_shoot.mp3');
        this.level.load.audio('laser_hit', 'assets/sfx/laser_hit.mp3');
        this.level.load.audio('laser_plot', 'assets/sfx/laser_plot.mp3');
        this.level.load.audio('laser_shoot', 'assets/sfx/laser_shoot.mp3');
        this.level.load.audio('navigating_fx', 'assets/sfx/navigating_fx.mp3');
        this.level.load.audio('phantom_shoot', 'assets/sfx/phantom_shoot.mp3');
        this.level.load.audio('rift_blue_shoot', 'assets/sfx/rift_blue_shoot.mp3');
        this.level.load.audio('rift_purple_shoot', 'assets/sfx/rift_purple_shoot.mp3');
        this.level.load.audio('slow_plot', 'assets/sfx/slow_plot.mp3');
        this.level.load.audio('slow_shoot', 'assets/sfx/slow_shoot.mp3');
        this.level.load.audio('stutter_1', 'assets/sfx/stutter_1.mp3');
        this.level.load.audio('stutter_2', 'assets/sfx/stutter_2.mp3');
        this.level.load.audio('stutter_3', 'assets/sfx/stutter_3.mp3');
        this.level.load.audio('stutter_4', 'assets/sfx/stutter_4.mp3');
        this.level.load.audio('stutter_slowed_1', 'assets/sfx/stutter_slowed_1.mp3');
        this.level.load.audio('stutter_slowed_2', 'assets/sfx/stutter_slowed_2.mp3');
        this.level.load.audio('stutter_slowed_3', 'assets/sfx/stutter_slowed_3.mp3');
        this.level.load.audio('stutter_slowed_4', 'assets/sfx/stutter_slowed_4.mp3');
        this.level.load.audio('surge_1', 'assets/sfx/surge_1.mp3');
        this.level.load.audio('surge_2', 'assets/sfx/surge_2.mp3');
        this.level.load.audio('surge_slowed_1', 'assets/sfx/surge_slowed_1.mp3');
        this.level.load.audio('surge_slowed_2', 'assets/sfx/surge_slowed_2.mp3');
    }

    public get sfxVolume(): number {
        return this._sfxVolume;
    }

    public set sfxVolume(value: number) {
        this._sfxVolume = Phaser.Math.Clamp(value, 0, 1);
    }

    public increaseSfxVolume(amount: number = 0.1): void {
        const gameState: State = this.level.sys.registry.get('gameState');
        if (gameState) {
            gameState.sfxVolume += amount;
        }
        this.sfxVolume += amount;
    }

    public decreaseSfxVolume(amount: number = 0.1): void {
        const gameState: State = this.level.sys.registry.get('gameState');
        if (gameState) {
            gameState.sfxVolume -= amount;
        }
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
        const gameState: State = this.level.sys.registry.get('gameState');
        if (gameState) {
            gameState.musicVolume += amount;
        }
        this.musicVolume += amount;
    }

    public decreaseMusicVolume(amount: number = 0.1): void {
        const gameState: State = this.level.sys.registry.get('gameState');
        if (gameState) {
            gameState.musicVolume -= amount;
        }
        this.musicVolume -= amount;
    }

    public playEnemySound(key: string) {
        return this.playSound(key, {volume: 0.4});
    }

    public playSfx(key: string, loop: boolean = false) {
        return this.playSound(key, {volume: 0.7, loop});
    }

    public playSound(key: string, config?: {
        volume?: number;
        detune?: number;
        rate?: number,
        loop?: boolean,
        onComplete?: () => void
    }): void {
        const gameState = this.level.sys.registry.get('gameState');
        console.log(`Playing sound: ${key} at volume: ${this._sfxVolume}`)

        if ((gameState as State).soundEnabled) {
            // clear any playing sound
            // this.level.sound.stopAll();
            if (!this.level.cache.audio.exists(key)) {
                console.warn(`Could not find ${key} in AudioManager.`);
                return;
            }
            const sound = this.level.sound.add(key, {
                volume: (config?.volume ?? 1) * this._sfxVolume,
                detune: config?.detune ?? -600,
                rate: config?.rate ?? 1,
                loop: config?.loop ?? false,
            });
            sound.play();
            sound.once(Phaser.Sound.Events.COMPLETE, () => {
                if (config?.onComplete) {
                    config.onComplete();
                }
            });
        }
    }

    public playHeavySound(key: string) {
        return this.playSound(key, {volume: 0.5, detune: -600, rate: 1.4});
    }

    public playLightSound(key: string) {
        return this.playSound(key, {volume: 0.4, detune: 200, rate: 1});
    }

    public playMusic(key: string, loop: boolean = true): void {
        const gameState = this.level.sys.registry.get('gameState');
        if ((gameState as State).soundEnabled) {
            if (this.backgroundMusic) {
                this.backgroundMusic.stop();
            }
            console.log(`Playing music: ${key} at volume: ${this._musicVolume}`)
            console.log(gameState)
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
