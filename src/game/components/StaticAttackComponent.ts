import {Component} from "../core/Component.ts";
import Phaser from "phaser";
import {CircularMovement} from "./CircularMovement.ts";
import {GameObject} from "../core/GameObject.ts";
import {PathMaker} from "../scenes/lib/PathMaker.ts";
import {PathFollower} from "./PathFollower.ts";
import {StaticGenie} from "../entities/StaticGenie.ts";
import {StaticEnemy, StaticHealthState} from "../entities/StaticEnemy.ts";

enum StaticAttackState {
    IDLE,
    CHARGING,
    RELEASE,
    COLLECT
}

export class StaticAttackComponent extends Component {
    private attackState: StaticAttackState = StaticAttackState.IDLE;
    private attacking: GameObject;
    private targetingX!: number;
    private targetingY!: number;
    private attackSpeed: number = 700;
    private chargingInProgress: boolean = false;
    private releaseInProgress: boolean = false;
    private collectionInProgress: boolean = false;
    private static: StaticEnemy;
    private percentageOfGeniesStuck: number = 0;

    // Configuration constants
    private NUM_ARMS = 5;
    private MAX_GENIES_PER_ARM = 200;
    private MAX_TOTAL_GENIES = this.NUM_ARMS * this.MAX_GENIES_PER_ARM;
    private currentGenieCount = 0;

    constructor() {
        super();
    }

    /**
     * Dynamically adds N genies distributed across the 5 arms
     * @param numOfGenies Number of genies to add (will be capped at remaining capacity)
     */
    public addGeniesToArm(numOfGenies: number = 20) {
        this.static = this.gameObject as StaticEnemy;
        this.collectionInProgress = false;

        // Calculate how many genies we can actually add
        const remainingCapacity = this.MAX_TOTAL_GENIES - this.currentGenieCount;
        const geniesToAdd = Math.min(numOfGenies, remainingCapacity);

        if (geniesToAdd <= 0) {
            // console.log("Maximum genie capacity reached!");
            return;
        }

        const delayPerGenie = 5; // milliseconds per genie for gathering effect

        for (let i = 0; i < geniesToAdd; i++) {
            this.static = this.gameObject as StaticEnemy;
            if(!this.static || !this.gameObject || !this.gameObject.scene) {
                return;
            }
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
                let radius = maxRadius - (normalizedPosition * (maxRadius - minRadius));

                // Create spiral angle
                const armAngleOffset = (armIndex * 2 * Math.PI) / this.NUM_ARMS;
                const spiralTightness = 3;
                const spiralAngle = normalizedPosition * spiralTightness * 2 * Math.PI;
                const angle = armAngleOffset - spiralAngle;

                // Calculate speeds
                const baseFallSpeed = 30;
                const fallSpeed = baseFallSpeed * (1 + normalizedPosition * 2);
                const baseOrbitSpeed = 0.3;
                let orbitSpeed = baseOrbitSpeed * (1 + (1 - normalizedPosition) * 2);

                if(!this.gameObject || !this.gameObject.level) {
                    // scene ended?
                    return;
                }

                // Create the genie with varied textures
                let genie = new StaticGenie(
                    this.gameObject.level,
                    this.gameObject,
                    Phaser.Math.RND.pick(['genie_texture', 'static_genie_texture'])
                );

                // Every 3rd genie gets a special texture
                if (totalIndex % 3 === 0) {
                    genie = new StaticGenie(
                        this.gameObject.level,
                        this.gameObject,
                        Phaser.Math.RND.pick(['stutter_genie_texture', 'surge_genie_texture', 'brutes_genie_texture'])
                    );
                }

                this.percentageOfGeniesStuck = 0;
                switch(this.static.staticHealthState) {
                    case StaticHealthState.STEADY:
                        this.percentageOfGeniesStuck = 0;
                        break;
                    case StaticHealthState.DISRUPTION:
                        this.percentageOfGeniesStuck = 0.25
                        break;
                    case StaticHealthState.VOLATILE:
                        this.percentageOfGeniesStuck = 0.5
                        break;
                    case StaticHealthState.ERUPTION:
                        this.percentageOfGeniesStuck = 0.75
                        break;
                }

                // fall if random > percentage of stuck
                if(Phaser.Math.RND.frac() > this.percentageOfGeniesStuck) {
                    orbitSpeed = 0;
                    radius = radius * Phaser.Math.FloatBetween(0.8, 1.5); // scatter them across
                }

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
                this.static.staticGenies.add(genie);
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

    public attack(target: GameObject) {
        this.attackState = StaticAttackState.CHARGING;
        this.attacking = target;
    }

    update(_time: number, _deltaTime: number) {
        switch (this.attackState) {
            case StaticAttackState.CHARGING:
                this.chargeGenies();
                break;
            case StaticAttackState.RELEASE:
                this.releaseGenies();
                break;
            case StaticAttackState.COLLECT:
                this.collectGenies();
                break;
            case StaticAttackState.IDLE:
                break;
        }
    }

    private chargeGenies() {
        if (this.chargingInProgress) {
            return;
        }
        this.chargingInProgress = true;

        for (const genie of this.static.staticGenies.getChildren() as StaticGenie[]) {
            let circularMovementComponent = genie.getComponent(CircularMovement);
            if (!circularMovementComponent) {
                return;
            }
            if(!circularMovementComponent.fall) {
                // if not falling means stuck, means no need to damage player
                continue;
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
        this.attackState = StaticAttackState.RELEASE;
    }

    private releaseGenies() {
        if (this.releaseInProgress) {
            return;
        }
        this.chargingInProgress = false;
        this.releaseInProgress = true;

        this.static = this.gameObject as StaticEnemy;
        if(!this.static || !this.gameObject || !this.gameObject.scene) {
            return;
        }
        this.gameObject.scene.time.delayedCall(2000, () => {
            for (const genie of this.static.staticGenies.getChildren() as StaticGenie[]) {
                // Calculate a delay for each genie to create a "ray" effect
                const delayPerGenie = 0.75; // milliseconds per genie
                const genieIndex = this.static.staticGenies.getChildren().indexOf(genie);

                this.static = this.gameObject as StaticEnemy;
                if(!this.static || !this.gameObject || !this.gameObject.scene) {
                    return;
                }
                this.gameObject.scene.time.delayedCall(delayPerGenie * genieIndex, () => {
                    this.targetingX = this.attacking.x;
                    this.targetingY = this.attacking.y;

                    // Calculate the direction vector from genie to target
                    const dirX = this.targetingX - this.gameObject.x;
                    const dirY = this.targetingY - this.gameObject.y;

                    // Normalize the direction vector
                    const length = Math.sqrt(dirX * dirX + dirY * dirY);
                    const normalizedDirX = dirX / length;
                    const normalizedDirY = dirY / length;
                    let beamThickness = 10;

                    let startX = this.gameObject.x + Phaser.Math.RND.between(-beamThickness, beamThickness);
                    let startY = this.gameObject.y + Phaser.Math.RND.between(-beamThickness, beamThickness);
                    let targetX = this.targetingX + Phaser.Math.RND.between(-beamThickness, beamThickness);
                    let targetY = this.targetingY + Phaser.Math.RND.between(-beamThickness, beamThickness);
                    let path = new PathMaker(startX, startY)
                        .to(targetX, targetY)
                        .to(targetX + normalizedDirX * 1000, targetY + normalizedDirY * 1000);

                    genie.deleteComponentByType(CircularMovement);
                    genie.addComponentOverriding(new PathFollower(path.create(this.gameObject.scene), this.attackSpeed));
                });
            }
            this.attackState = StaticAttackState.COLLECT;
        });
    }

    private collectGenies() {
        if (this.collectionInProgress) {
            return;
        }
        this.releaseInProgress = false;
        this.collectionInProgress = true;

        this.static = this.gameObject as StaticEnemy;
        if(!this.static || !this.gameObject || !this.gameObject.scene) {
            return;
        }
        this.gameObject.scene.time.delayedCall(1500, () => {
            for (const genie of this.static.staticGenies.getChildren() as StaticGenie[]) {
                genie.destroy();
            }
            this.attackState = StaticAttackState.IDLE;
            this.currentGenieCount = 0; // Reset counter
            this.static.staticGenies.clear(true, true);
            this.addGeniesToArm(this.MAX_TOTAL_GENIES * (1 - this.percentageOfGeniesStuck/2));
        });
    }
}