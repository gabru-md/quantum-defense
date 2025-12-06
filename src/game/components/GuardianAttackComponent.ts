import {Component} from "../core/Component.ts";
import {Player} from "../entities/Player.ts";
import {CircularMovement} from "./CircularMovement.ts";
import Phaser from "phaser";
import {Genie} from "../entities/Genie.ts";
import {PlayerConfig} from "../config/PlayerConfig.ts";
import {createWaveEffect} from "../utils/WaveEffectHelper.ts";
import {getResonanceWaveConfig} from "../config/WaveConfig.ts";
import {AppColors} from "../scripts/Colors.ts";

enum GuardianAttackState {
    IDLE,
    CHARGING,
    RELEASE,
    COLLECT
}

export class GuardianAttackComponent extends Component {
    private keys!: { r: Phaser.Input.Keyboard.Key };
    private attackState: GuardianAttackState = GuardianAttackState.IDLE;
    private chargingInProgress: boolean = false;
    private releaseInProgress: boolean = false;
    private collectionInProgress: boolean = false;
    private player: Player;
    private lastAttacked: number = 0;
    private baseActivationEnergy: number = 250;
    private targetRange: number = 1000;
    private waveDamage: number = 1000; // Static health is 5k so we need to do this atleast 5 times, this should be challenging

    // Configuration constants
    private readonly NUM_ARMS = 5;
    private readonly MAX_GENIES_PER_ARM = 200;
    private readonly MAX_TOTAL_GENIES = this.NUM_ARMS * this.MAX_GENIES_PER_ARM;
    private currentGenieCount = 0;

    constructor() {
        super();
    }

    public start(): void {
        if (this.gameObject.scene.input.keyboard) {
            this.keys = this.gameObject.scene.input.keyboard.addKeys({
                r: Phaser.Input.Keyboard.KeyCodes.R,
            }) as { r: Phaser.Input.Keyboard.Key };
        }
    }

    /**
     * Dynamically adds N genies distributed across the 5 arms
     * @param numOfGenies Number of genies to add (will be capped at remaining capacity)
     */
    public addGeniesToArm(numOfGenies: number = 20) {
        this.player = this.gameObject as Player;
        this.collectionInProgress = false;

        // Calculate how many genies we can actually add
        const remainingCapacity = this.MAX_TOTAL_GENIES - this.currentGenieCount;
        const geniesToAdd = Math.min(numOfGenies, remainingCapacity);

        if (geniesToAdd <= 0) {
            this.player.showNotification(AppColors.UI_MESSAGE_WARN, `!`)
            this.player.info("Maximum genie capacity reached!")
            return;
        }

        const delayPerGenie = 5; // milliseconds per genie for gathering effect

        for (let i = 0; i < geniesToAdd; i++) {
            this.gameObject.scene.time.delayedCall(delayPerGenie * i, () => {
                // Calculate which arm and position this genie belongs to
                const totalIndex = this.currentGenieCount;
                const armIndex = Math.floor(totalIndex / this.MAX_GENIES_PER_ARM);
                const positionInArm = totalIndex % this.MAX_GENIES_PER_ARM;

                // Calculate spiral parameters
                const normalizedPosition = positionInArm / this.MAX_GENIES_PER_ARM; // 0 to 1
                const maxRadius = 100;
                const minRadius = 15;

                // Spiral equation: radius decreases as we go inward
                const radius = maxRadius - (normalizedPosition * (maxRadius - minRadius));

                // Create spiral angle
                const armAngleOffset = (armIndex * 2 * Math.PI) / this.NUM_ARMS;
                const spiralTightness = 3;
                const spiralAngle = normalizedPosition * spiralTightness * 2 * Math.PI;
                const angle = armAngleOffset - spiralAngle;

                // Calculate speeds
                const baseFallSpeed = 30;
                const fallSpeed = baseFallSpeed * (1 + normalizedPosition * 2);
                const baseOrbitSpeed = 0.3;
                const orbitSpeed = baseOrbitSpeed * (1 + (1 - normalizedPosition) * 2);

                // Create the genie with varied textures
                let genie: Genie = new Genie(
                    this.gameObject.level,
                    this.gameObject,
                    Phaser.Math.RND.pick(['genie_texture'])
                );


                // Add circular movement component
                genie.addComponentOverriding(
                    new CircularMovement(
                        this.gameObject,
                        radius,
                        orbitSpeed,
                        true, // Enable falling
                        fallSpeed,
                        minRadius // Stop at minimum radius
                    )
                );

                // Set initial angle for spiral positioning
                const circularMovement = genie.getComponent(CircularMovement);
                if (circularMovement) {
                    circularMovement.setAngle(angle);
                }

                // Visual properties based on distance
                const alphaValue = Phaser.Math.FloatBetween(0.2, 0.8) * (1 - normalizedPosition * 0.5);
                genie.setAlpha(alphaValue);

                // Scale based on distance for depth effect
                const scale = 0.5 + (1 - normalizedPosition) * 0.5;
                genie.setScale(scale);
                genie.setDepth(100);

                // Add to group and scene
                this.player.guardianGenies?.add(genie);
                this.gameObject.scene.add.existing(genie);

                this.currentGenieCount++;
            });
        }
    }

    /**
     * Get current number of genies
     */
    public getCurrentGenieCount(): number {
        return this.currentGenieCount;
    }

    /**
     * Get remaining capacity
     */
    public getRemainingCapacity(): number {
        return this.MAX_TOTAL_GENIES - this.currentGenieCount;
    }

    /**
     * Check if at max capacity
     */
    public isAtMaxCapacity(): boolean {
        return this.currentGenieCount >= this.MAX_TOTAL_GENIES;
    }

    update(_time: number, _deltaTime: number) {

        if (this.playerPressedKey(_time)) {
            if (this.cooldownOver(_time)) {
                if (this.enoughEnergyPresent()) {
                    console.log(this.currentGenieCount);
                    if(this.currentGenieCount > 0) {
                        this.attackState = GuardianAttackState.CHARGING;
                    } else {
                        this.player.warn(`Collect Quantum Echoes to activate Mega Resonance Wave!`);
                        this.gameObject.level.hud.alert(
                            `INSUFFICIENT GENIES:\nCollect Quantum Echoes to activate Mega Resonance Wave!`,
                            AppColors.UI_MESSAGE_WARN,
                            1000
                        );
                        this.gameObject.level.audioManager.playSfx('error_fx', false, this.gameObject)
                        return;
                    }
                } else {
                    // console.log(`[ResonanceWave] Insufficient energy. Current: ${this.gameObject.level.state.energy}, Needed: ${this.baseActivationEnergy}`);
                    this.player.warn(`Need ${this.baseActivationEnergy} energy to activate Mega Resonance Wave!`);
                    this.gameObject.level.hud.alert(
                        `INSUFFICIENT ENERGY:\nNeed ${this.baseActivationEnergy} energy to activate Mega Resonance Wave!`,
                        AppColors.UI_MESSAGE_WARN,
                        1000
                    );
                    this.gameObject.level.audioManager.playSfx('error_fx', false, this.gameObject)
                    return;
                }
            } else {
                this.player.warn(`Mega Resonance Wave is on cooldown!`);
                this.gameObject.level.hud.alert(
                    'ABILITY COOLDOWN:\nMega Resonance Wave is on cooldown!', // Updated message
                    AppColors.UI_MESSAGE_WARN
                );
                this.gameObject.level.audioManager.playSfx('error_fx', false, this.gameObject)
                return;
            }
        }

        switch (this.attackState) {
            case GuardianAttackState.CHARGING:
                this.chargeGenies();
                break;
            case GuardianAttackState.RELEASE:
                this.releaseGenies();
                break;
            case GuardianAttackState.COLLECT:
                this.collectGenies();
                break;
            case GuardianAttackState.IDLE:
                break;
        }
    }

    private chargeGenies() {
        if (this.chargingInProgress) {
            return;
        }
        this.chargingInProgress = true;
        for (const genie of this.player.guardianGenies?.getChildren() as Genie[]) {
            let circularMovementComponent = genie.getComponent(CircularMovement);
            if (!circularMovementComponent) {
                return;
            }
            let newCircularMovementComponent = new CircularMovement(
                this.gameObject,
                circularMovementComponent.radius,
                circularMovementComponent.speed,
                true,
                circularMovementComponent.fallSpeed,
                0
            );
            newCircularMovementComponent.repeat = false;
            genie.addComponentOverriding(newCircularMovementComponent);
        }
        this.attackState = GuardianAttackState.RELEASE;
    }

    private releaseGenies() {
        if (this.releaseInProgress) {
            return;
        }
        this.chargingInProgress = false;
        this.releaseInProgress = true;
        this.gameObject.scene.time.delayedCall(2000, () => {
            this.player.showNotification(AppColors.UI_MESSAGE_WARN, `¡`)
            for (const genie of this.player.guardianGenies?.getChildren() as Genie[]) {
                let circularMovementComponent = genie.getComponent(CircularMovement);
                if (!circularMovementComponent) {
                    return;
                }
                let newCircularMovementComponent = new CircularMovement(
                    this.gameObject,
                    circularMovementComponent.radius,
                    circularMovementComponent.speed,
                    true,
                    circularMovementComponent.fallSpeed,
                    -250
                );
                newCircularMovementComponent.repeat = false;
                genie.addComponentOverriding(newCircularMovementComponent);
            }
            createWaveEffect(
                this.gameObject.scene,
                this.gameObject.x,
                this.gameObject.y,
                this.gameObject.width,
                getResonanceWaveConfig(1000, PlayerConfig.resonanceWave.pulseColor, 0.1)
            );

            this.lastAttacked = this.gameObject.scene.time.now;


            const core = (this.gameObject.level as any).staticCore; // Access the core directly from the level
            if (core) {
                const distance = Phaser.Math.Distance.Between(
                    this.gameObject.x,
                    this.gameObject.y,
                    core.x,
                    core.y
                );
                if (distance <= this.targetRange) {
                    core.takeDamage(this.waveDamage * (this.currentGenieCount / this.MAX_TOTAL_GENIES));
                }
            }

            this.gameObject.level.audioManager.playSfx('guardian_shoot')

            this.gameObject.level.state.energy -= this.baseActivationEnergy;
            this.gameObject.level.hud.update();

            this.attackState = GuardianAttackState.COLLECT;
        });
    }

    private collectGenies() {
        if (this.collectionInProgress) {
            return;
        }
        console.log('Collection in progress!')
        this.releaseInProgress = false;
        this.collectionInProgress = true;
        this.gameObject.scene.time.delayedCall(1500, () => {
            for (const genie of this.player.guardianGenies?.getChildren() as Genie[]) {
                genie.destroy();
            }
            this.attackState = GuardianAttackState.IDLE;
            this.currentGenieCount = 0; // Reset counter
            this.player.guardianGenies?.clear(true, true);
        });
    }

    private playerPressedKey(_time: number) {
        return Phaser.Input.Keyboard.JustDown(this.keys.r);
    }

    private enoughEnergyPresent() {
        // return this.gameObject.level.state.energy === this.gameObject.level.state.maxEnergy;
        return this.gameObject.level.state.energy >= this.baseActivationEnergy;
    }

    private cooldownOver(time: number) {
        console.log(this.lastAttacked, time);
        console.log(this.lastAttacked + 5000 < time)
        return this.lastAttacked + 5000 < time;
    }
}