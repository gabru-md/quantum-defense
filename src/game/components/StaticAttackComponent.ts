import {Component} from "../core/Component.ts";
import Phaser from "phaser";
import {CircularMovement} from "./CircularMovement.ts";
import {GameObject} from "../core/GameObject.ts";
import {PathMaker} from "../scenes/lib/PathMaker.ts";
import {PathFollower} from "./PathFollower.ts";
import {StaticGenie} from "../entities/StaticGenie.ts";
import {StaticEnemy} from "../entities/StaticEnemy.ts";

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


    constructor() {
        super();
    }

    public setupGeniesInArms() {
        this.static = this.gameObject as StaticEnemy;
        this.static.staticGenies.clear(true, true);
        this.collectionInProgress = false;

        const numArms = 5; // Number of spiral arms
        const geniesPerArm = 200; // Genies per arm
        const totalGenies = numArms * geniesPerArm;

        // Add a delay for each genie to create a "gathering" effect
        const delayPerGenie = 5; // milliseconds per genie
        for (let i = 0; i < totalGenies; i++) {
            this.gameObject.scene.time.delayedCall(delayPerGenie * i, () => {
                const armIndex = Math.floor(i / geniesPerArm);
                const positionInArm = i % geniesPerArm;

                // Calculate spiral parameters
                const normalizedPosition = positionInArm / geniesPerArm; // 0 to 1
                const maxRadius = 100; // Maximum distance from center
                const minRadius = 15;
                // const minRadius = Phaser.Math.Between(0, 10); // Minimum distance (near the center)

                // Spiral equation: radius decreases as we go inward
                const radius = maxRadius - (normalizedPosition * (maxRadius - minRadius));

                // Create spiral angle: each arm offset by 2π/numArms, plus spiral rotation
                const armAngleOffset = (armIndex * 2 * Math.PI) / numArms;
                const spiralTightness = 3; // How many rotations the spiral makes
                const spiralAngle = normalizedPosition * spiralTightness * 2 * Math.PI;
                const angle = armAngleOffset - spiralAngle; // Negative for inward spiral

                // Calculate fall speed based on distance (farther = slower start)
                const baseFallSpeed = 30;
                const fallSpeed = baseFallSpeed * (1 + normalizedPosition * 2); // Outer genies fall slower initially

                // Calculate orbit speed (inner genies orbit faster)
                const baseOrbitSpeed = 0.3;
                const orbitSpeed = baseOrbitSpeed * (1 + (1 - normalizedPosition) * 2);

                // Create the genie
                // randomly change texture to genie_texture
                let genie = new StaticGenie(this.gameObject.level, this.gameObject, Phaser.Math.RND.pick(['genie_texture', 'static_genie_texture']));
                if(i % 3 === 0) {
                    genie = new StaticGenie(this.gameObject.level, this.gameObject, Phaser.Math.RND.pick(['stutter_genie_texture','surge_genie_texture', 'brutes_genie_texture']));
                }

                // Add the circular movement with fall effect
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

                // Optional: scale based on distance for depth effect
                const scale = 0.5 + (1 - normalizedPosition) * 0.5; // Smaller when far, bigger when close
                genie.setScale(scale);
                genie.setDepth(100);
                this.static.staticGenies.add(genie);
                this.gameObject.scene.add.existing(genie);
            });
        }

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
                // set to default state
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
            let newCircularMovementComponent = new CircularMovement(
                this.gameObject,
                circularMovementComponent.radius, // Use current radius
                circularMovementComponent.speed,
                true, // Enable falling
                circularMovementComponent.fallSpeed,
                0 // Stop at minimum radius
            );
            // fall only once when charging
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

        this.gameObject.scene.time.delayedCall(2000, () => {
            for (const genie of this.static.staticGenies.getChildren() as StaticGenie[]) {

                // Calculate a delay for each genie to create a "ray" effect
                const delayPerGenie = 1; // milliseconds per genie
                const genieIndex = this.static.staticGenies.getChildren().indexOf(genie);
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
                    let path = new PathMaker(startX, startY).to(targetX, targetY).to(targetX + normalizedDirX * 1000, targetY + normalizedDirY * 1000); // Extend 1000 pixels out of screen

                    genie.deleteComponentByType(CircularMovement); // Remove circular movement
                    genie.addComponent(new PathFollower(path.create(this.gameObject.scene), this.attackSpeed)); // Add path follower
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
        this.gameObject.scene.time.delayedCall(1500, () => {
            for (const genie of this.static.staticGenies.getChildren() as StaticGenie[]) {
                genie.destroy();
            }
            this.setupGeniesInArms();
            this.attackState = StaticAttackState.IDLE;
        });
    }
}