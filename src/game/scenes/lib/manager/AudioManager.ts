import {Manager} from '../Manager';
import {State} from '../State.ts';
import {Level} from "../Level.ts";
import {GameObject} from "../../../core/GameObject.ts";

export class AudioManager extends Manager {
    private backgroundMusic: Phaser.Sound.BaseSound | null = null;
    private musicQueue: string[] = [];
    private _sfxVolume: number = 0.3; // Default SFX volume
    private _musicVolume: number = 0.2; // Default Music volume
    private maxDistance: number = 500; // Max distance for spatial sound
    private level?: Level;

    constructor(public scene: Phaser.Scene) {
        super(scene);
        if (scene instanceof Level) {
            this.level = scene;
        }
    }

    public setup(): void {
        const gameState: State = this.scene.sys.registry.get('gameState');
        if (gameState) {
            this._musicVolume = gameState.musicVolume;
            this._sfxVolume = gameState.sfxVolume;
        }

        this.scene.load.audio('MainMenuMusic', 'assets/music/MainMenuMusic.mp3');
        this.scene.load.audio('LevelMusic', 'assets/music/LevelMusic.mp3');
        this.scene.load.audio('GameOver', 'assets/music/GameOver.mp3');
        this.loadAllSfx();
    }

    private loadAllSfx(): void {
        // Assuming 'this.level' is the context and the base path is 'assets/sfx/'

        this.scene.load.audio('bomb_hit', 'assets/sfx/bomb_hit.mp3');
        this.scene.load.audio('bomb_plot', 'assets/sfx/bomb_plot.mp3');
        this.scene.load.audio('bomb_shoot', 'assets/sfx/bomb_shoot.mp3');
        this.scene.load.audio('brute', 'assets/sfx/brute.mp3');
        this.scene.load.audio('error_fx', 'assets/sfx/error_fx.mp3');
        this.scene.load.audio('guardian_shoot', 'assets/sfx/guardian_shoot.mp3');
        this.scene.load.audio('laser_hit', 'assets/sfx/laser_hit.mp3');
        this.scene.load.audio('laser_plot', 'assets/sfx/laser_plot.mp3');
        this.scene.load.audio('laser_shoot', 'assets/sfx/laser_shoot.mp3');
        this.scene.load.audio('navigating_fx', 'assets/sfx/navigating_fx.mp3');
        this.scene.load.audio('phantom_shoot', 'assets/sfx/phantom_shoot.mp3');
        this.scene.load.audio('rift_blue_shoot', 'assets/sfx/rift_blue_shoot.mp3');
        this.scene.load.audio('rift_purple_shoot', 'assets/sfx/rift_purple_shoot.mp3');
        this.scene.load.audio('slow_plot', 'assets/sfx/slow_plot.mp3');
        this.scene.load.audio('slow_shoot', 'assets/sfx/slow_shoot.mp3');
        this.scene.load.audio('stutter_1', 'assets/sfx/stutter_1.mp3');
        this.scene.load.audio('stutter_2', 'assets/sfx/stutter_2.mp3');
        this.scene.load.audio('stutter_3', 'assets/sfx/stutter_3.mp3');
        this.scene.load.audio('stutter_4', 'assets/sfx/stutter_4.mp3');
        this.scene.load.audio('stutter_slowed_1', 'assets/sfx/stutter_slowed_1.mp3');
        this.scene.load.audio('stutter_slowed_2', 'assets/sfx/stutter_slowed_2.mp3');
        this.scene.load.audio('stutter_slowed_3', 'assets/sfx/stutter_slowed_3.mp3');
        this.scene.load.audio('stutter_slowed_4', 'assets/sfx/stutter_slowed_4.mp3');
        this.scene.load.audio('surge_1', 'assets/sfx/surge_1.mp3');
        this.scene.load.audio('surge_2', 'assets/sfx/surge_2.mp3');
        this.scene.load.audio('surge_slowed_1', 'assets/sfx/surge_slowed_1.mp3');
        this.scene.load.audio('surge_slowed_2', 'assets/sfx/surge_slowed_2.mp3');
    }

    public get sfxVolume(): number {
        return this._sfxVolume;
    }

    public set sfxVolume(value: number) {
        this._sfxVolume = Phaser.Math.Clamp(value, 0, 1);
    }

    public increaseSfxVolume(amount: number = 0.1): void {
        const gameState: State = this.scene.sys.registry.get('gameState');
        if (gameState) {
            gameState.sfxVolume += amount;
        }
        this.sfxVolume += amount;
    }

    public decreaseSfxVolume(amount: number = 0.1): void {
        const gameState: State = this.scene.sys.registry.get('gameState');
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
        const gameState: State = this.scene.sys.registry.get('gameState');
        if (gameState) {
            gameState.musicVolume += amount;
        }
        this.musicVolume += amount;
    }

    public decreaseMusicVolume(amount: number = 0.1): void {
        const gameState: State = this.scene.sys.registry.get('gameState');
        if (gameState) {
            gameState.musicVolume -= amount;
        }
        this.musicVolume -= amount;
    }

    public playEnemySound(key: string, source?: GameObject) {
        return this.playSound(key, {volume: 0.4}, source);
    }

    public playSfx(key: string, loop: boolean = false, source?: GameObject) {
        return this.playSound(key, {volume: 0.7, loop}, source);
    }

    public playTowerSfx(key: string, loop: boolean = false, source?: GameObject) {
        return this.playSound(key, {volume: 0.3, loop}, source);
    }

    public playSound(key: string, config?: {
        volume?: number;
        detune?: number;
        rate?: number,
        loop?: boolean,
        onComplete?: () => void
    }, source?: GameObject): void {
        const gameState = this.scene.sys.registry.get('gameState');

        if ((gameState as State).soundEnabled) {
            if (!this.scene.cache.audio.exists(key)) {
                console.warn(`Could not find ${key} in AudioManager.`);
                return;
            }

            let finalVolume = (config?.volume ?? 1) * this._sfxVolume;
            if(this.level) {
                let player = this.level.playerManager.player;
                if (source && player) {
                    const distance = Phaser.Math.Distance.Between(
                        source.x,
                        source.y,
                        player.x,
                        player.y
                    );

                    const volumeFalloff = 1 - Phaser.Math.Clamp(distance / this.maxDistance, 0, 1);
                    finalVolume *= volumeFalloff;
                }
            }

            if (finalVolume <= 0) {
                return; // Don't play sounds that are too far away
            }

            const sound = this.scene.sound.add(key, {
                volume: finalVolume,
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

    public playHeavySound(key: string, source?: GameObject) {
        return this.playSound(key, {volume: 0.5, detune: -600, rate: 1.4}, source);
    }

    public playLightSound(key: string, source?: GameObject) {
        return this.playSound(key, {volume: 0.4, detune: 200, rate: 1}, source);
    }

    public playMusic(key: string, loop: boolean = true): void {
        const gameState = this.scene.sys.registry.get('gameState');
        if ((gameState as State).soundEnabled) {
            if (this.backgroundMusic) {
                this.backgroundMusic.stop();
            }
            console.log(`Playing music: ${key} at volume: ${this._musicVolume}`)
            console.log(gameState)
            this.backgroundMusic = this.scene.sound.add(key, {loop});
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
