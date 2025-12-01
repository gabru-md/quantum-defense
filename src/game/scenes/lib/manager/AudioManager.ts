import {Manager} from '../Manager';
import {State} from '../State.ts';
import {Level} from "../Level.ts";
import {GameObject} from "../../../core/GameObject.ts";
import NoAudioSound = Phaser.Sound.NoAudioSound;
import HTML5AudioSound = Phaser.Sound.HTML5AudioSound;
import WebAudioSound = Phaser.Sound.WebAudioSound;

export class AudioManager extends Manager {
    private backgroundMusic: Phaser.Sound.BaseSound | null = null;
    private musicQueue: string[] = [];
    private _sfxVolume: number = 0.3; // Default SFX volume
    private _musicVolume: number = 0.2; // Default Music volume
    private maxDistance: number = 500; // Max distance for spatial sound
    private level?: Level;
    private playingSound!: NoAudioSound | HTML5AudioSound | WebAudioSound;

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
        this.scene.load.audio('LevelComplete', 'assets/music/LevelComplete.mp3');
        this.scene.load.audio('GameOver', 'assets/music/GameOver.mp3');
        this.scene.load.audio('WinGame', 'assets/music/WinGame.mp3');
        this.loadAllSfx();
        this.loadAllNarration();
        this.loadAllTutorialSounds();
    }

    private loadAllTutorialSounds() {
        this.scene.load.audio('Tutorial_1', 'assets/narration/Tutorial_1.mp3'); // "Welcome, commander. Our base is under attack."
        this.scene.load.audio('Tutorial_2', 'assets/narration/Tutorial_2.mp3'); // "These are Glitches, hostile entities from another dimension."
        this.scene.load.audio('Tutorial_3', 'assets/narration/Tutorial_3.mp3'); // "Your mission is to defend our core at all costs."
        this.scene.load.audio('Tutorial_4', 'assets/narration/Tutorial_4.mp3'); // "To do that, you'll deploy defense towers."
        this.scene.load.audio('Tutorial_5', 'assets/narration/Tutorial_5.mp3'); // "Click on an empty plot to open the build menu."
        this.scene.load.audio('Tutorial_6', 'assets/narration/Tutorial_6.mp3'); // "This is the Laser Tower. It fires rapid, low-damage shots."
        this.scene.load.audio('Tutorial_7', 'assets/narration/Tutorial_7.mp3'); // "This is the Bomb Tower. It deals high splash damage."
        this.scene.load.audio('Tutorial_8', 'assets/narration/Tutorial_8.mp3'); // "And this is the Slow Tower. It slows down enemies."
        this.scene.load.audio('Tutorial_9', 'assets/narration/Tutorial_9.mp3'); // "Let's start by building a Laser Tower. Click its icon."
        this.scene.load.audio('Tutorial_10', 'assets/narration/Tutorial_10.mp3'); // "Excellent. The tower will automatically target nearby Glitches."
        this.scene.load.audio('Tutorial_11', 'assets/narration/Tutorial_11.mp3'); // "You earn energy by defeating Glitches. Use it to build more towers."
        this.scene.load.audio('Tutorial_12', 'assets/narration/Tutorial_12.mp3'); // "Now, let's try upgrading a tower. Click on the Laser Tower you just built."
        this.scene.load.audio('Tutorial_13', 'assets/narration/Tutorial_13.mp3'); // "This menu shows the tower's stats and upgrade options."
        this.scene.load.audio('Tutorial_14', 'assets/narration/Tutorial_14.mp3'); // "Click the 'Upgrade' button to improve its damage and range."
        this.scene.load.audio('Tutorial_15', 'assets/narration/Tutorial_15.mp3'); // "Well done. Upgraded towers are much more effective."
        this.scene.load.audio('Tutorial_16', 'assets/narration/Tutorial_16.mp3'); // "You can also sell towers if you need to re-strategize. Click 'Sell'."
        this.scene.load.audio('Tutorial_17', 'assets/narration/Tutorial_17.mp3'); // "The tower is gone, and you've recovered some energy."
        this.scene.load.audio('Tutorial_18', 'assets/narration/Tutorial_18.mp3'); // "Now, let's build a Bomb Tower. Click an empty plot and select the Bomb Tower."
        this.scene.load.audio('Tutorial_19', 'assets/narration/Tutorial_19.mp3'); // "Good. Notice how it damages multiple enemies at once."
        this.scene.load.audio('Tutorial_20', 'assets/narration/Tutorial_20.mp3'); // "Next, a Slow Tower. Place it near the path."
        this.scene.load.audio('Tutorial_21', 'assets/narration/Tutorial_21.mp3'); // "Perfect. Slowed enemies are easier targets for your other towers."
        this.scene.load.audio('Tutorial_22', 'assets/narration/Tutorial_22.mp3'); // "Keep an eye on your core's health. If it reaches zero, the mission fails."
        this.scene.load.audio('Tutorial_23', 'assets/narration/Tutorial_23.mp3'); // "You can pause the game at any time by pressing 'P' or clicking the pause button."
        this.scene.load.audio('Tutorial_24', 'assets/narration/Tutorial_24.mp3'); // "The minimap in the corner shows the entire level and enemy paths."
        this.scene.load.audio('Tutorial_25', 'assets/narration/Tutorial_25.mp3'); // "Different Glitches have different resistances and abilities."
        this.scene.load.audio('Tutorial_26', 'assets/narration/Tutorial_26.mp3'); // "Adapt your defenses to counter them effectively."
        this.scene.load.audio('Tutorial_27', 'assets/narration/Tutorial_27.mp3'); // "Remember to use your energy wisely. Every tower counts."
        this.scene.load.audio('Tutorial_28', 'assets/narration/Tutorial_28.mp3'); // "You're doing great, commander. Keep defending the core."
        this.scene.load.audio('Tutorial_29', 'assets/narration/Tutorial_29.mp3'); // "The Glitches are relentless. Stay vigilant."
        this.scene.load.audio('Tutorial_30', 'assets/narration/Tutorial_30.mp3'); // "Good luck, commander. The fate of our base is in your hands."
        this.scene.load.audio('Tutorial_31', 'assets/narration/Tutorial_31.mp3'); // "Tutorial complete. Now, prepare for the real challenge!"

    }

    private loadAllNarration() {
        this.scene.load.audio('Story_TheGlitchAnnihilation_2', 'assets/narration/Story_TheGlitchAnnihilation_1.mp3');
        this.scene.load.audio('Story_TheGlitchAnnihilation_3', 'assets/narration/Story_TheGlitchAnnihilation_2.mp3');
        this.scene.load.audio('Story_TheGlitchAnnihilation_4', 'assets/narration/Story_TheGlitchAnnihilation_3.mp3');
        this.scene.load.audio('Story_TheFirstStand_2', 'assets/narration/Story_TheFirstStand_1.mp3');
        this.scene.load.audio('Story_TheFirstStand_3', 'assets/narration/Story_TheFirstStand_2.mp3');
        this.scene.load.audio('Story_TheFirstStand_4', 'assets/narration/Story_TheFirstStand_3.mp3');
        this.scene.load.audio('Story_TheFirstStand_5', 'assets/narration/Story_TheFirstStand_4.mp3');
        this.scene.load.audio('Story_TheDormantScars_2', 'assets/narration/Story_TheDormantScars_1.mp3');
        this.scene.load.audio('Story_TheDormantScars_3', 'assets/narration/Story_TheDormantScars_2.mp3');
        this.scene.load.audio('Story_TheDormantScars_4', 'assets/narration/Story_TheDormantScars_3.mp3');
        this.scene.load.audio('Story_VolatileInterference_2', 'assets/narration/Story_VolatileInterference_1.mp3');
        this.scene.load.audio('Story_VolatileInterference_3', 'assets/narration/Story_VolatileInterference_2.mp3');
        this.scene.load.audio('Story_VolatileInterference_4', 'assets/narration/Story_VolatileInterference_3.mp3');
        this.scene.load.audio('Story_InitialBreakthrough_2', 'assets/narration/Story_InitialBreakthrough_1.mp3');
        this.scene.load.audio('Story_InitialBreakthrough_3', 'assets/narration/Story_InitialBreakthrough_2.mp3');
        this.scene.load.audio('Story_InitialBreakthrough_4', 'assets/narration/Story_InitialBreakthrough_3.mp3');
        this.scene.load.audio('Story_StaticNewGlitches_2', 'assets/narration/Story_StaticNewGlitches_1.mp3');
        this.scene.load.audio('Story_StaticNewGlitches_3', 'assets/narration/Story_StaticNewGlitches_2.mp3');
        this.scene.load.audio('Story_StaticNewGlitches_4', 'assets/narration/Story_StaticNewGlitches_3.mp3');
        this.scene.load.audio('Story_ThePhantomArrival_2', 'assets/narration/Story_ThePhantomArrival_1.mp3');
        this.scene.load.audio('Story_ThePhantomArrival_3', 'assets/narration/Story_ThePhantomArrival_2.mp3');
        this.scene.load.audio('Story_ThePhantomArrival_4', 'assets/narration/Story_ThePhantomArrival_3.mp3');
        this.scene.load.audio('Story_EchoesOfAncientLore_2', 'assets/narration/Story_EchoesOfAncientLore_1.mp3');
        this.scene.load.audio('Story_EchoesOfAncientLore_3', 'assets/narration/Story_EchoesOfAncientLore_2.mp3');
        this.scene.load.audio('Story_EchoesOfAncientLore_4', 'assets/narration/Story_EchoesOfAncientLore_3.mp3');
        this.scene.load.audio('Story_DesigningTheBane_2', 'assets/narration/Story_DesigningTheBane_1.mp3');
        this.scene.load.audio('Story_DesigningTheBane_3', 'assets/narration/Story_DesigningTheBane_2.mp3');
        this.scene.load.audio('Story_DesigningTheBane_4', 'assets/narration/Story_DesigningTheBane_3.mp3');
        this.scene.load.audio('Story_TheFinalAssault_2', 'assets/narration/Story_TheFinalAssault_1.mp3');
        this.scene.load.audio('Story_TheFinalAssault_3', 'assets/narration/Story_TheFinalAssault_2.mp3');
        this.scene.load.audio('Story_TheFinalAssault_4', 'assets/narration/Story_TheFinalAssault_3.mp3');
        this.scene.load.audio('Story_TheResonanceWave_2', 'assets/narration/Story_TheResonanceWave_1.mp3');
        this.scene.load.audio('Story_TheResonanceWave_3', 'assets/narration/Story_TheResonanceWave_2.mp3');
        this.scene.load.audio('Story_TheResonanceWave_4', 'assets/narration/Story_TheResonanceWave_3.mp3');
        this.scene.load.audio('Story_TheResonanceWave_5', 'assets/narration/Story_TheResonanceWave_4.mp3');
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
        this.scene.load.audio('laser_deactivate', 'assets/sfx/laser_deact.mp3');
        this.scene.load.audio('bomb_deactivate', 'assets/sfx/bomb_deact.mp3');
        this.scene.load.audio('slow_deactivate', 'assets/sfx/slow_deact.mp3');
        this.scene.load.audio('laser_reactivate', 'assets/sfx/laser_react.mp3');
        this.scene.load.audio('bomb_reactivate', 'assets/sfx/bomb_react.mp3');
        this.scene.load.audio('slow_reactivate', 'assets/sfx/slow_react.mp3');

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
            if (this.playingSound) {
                this.playingSound.stop();
            }
            this.playingSound = this.scene.sound.add(key, {
                volume: finalVolume,
                detune: config?.detune ?? -600,
                rate: config?.rate ?? 1,
                loop: config?.loop ?? false,
            });
            this.playingSound.play();
            this.playingSound.once(Phaser.Sound.Events.COMPLETE, () => {
                if (config?.onComplete) {
                    config.onComplete();
                }
            });
        }
    }

    public playHeavySound(key: string, source?: GameObject) {
        return this.playSound(key, {volume: 0.8, detune: -600, rate: 1.4}, source);
    }

    public playLightSound(key: string, source?: GameObject) {
        return this.playSound(key, {volume: 0.65, detune: 0, rate: 1.1}, source);
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
        if(this.playingSound) {
            this.playingSound.stop();
        }
    }
}
