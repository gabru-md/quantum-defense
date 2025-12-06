import {Component} from '../core/Component.ts';
import {GameObject} from '../core/GameObject.ts';
import Phaser from "phaser";
import {Genie} from "../entities/Genie.ts";

export class CircularMovement extends Component {
    private angle: number = 0;
    private originalRadius: number = 0;
    public repeat: boolean = true;

    constructor(
        private target: GameObject,
        public radius: number,
        public speed: number,
        public fall: boolean = false,
        public fallSpeed: number = 0.5,
        public maxFallRadius: number = radius
    ) {
        super();
        this.originalRadius = radius;
        this.angle = Phaser.Math.FloatBetween(0, 2 * Math.PI);
    }

    update(_time: number, delta: number): void {
        this.angle += this.speed * (delta / 1000);

        if (this.fall) {
            this.radius -= this.fallSpeed * (delta / 1000);
            if (this.radius < this.maxFallRadius) {
                // one fallen restart from the beginning
                if(this.repeat) {
                    let scale = (this.gameObject as Genie).parentObject.scaleY
                    this.radius = this.originalRadius * (scale + 0.05);
                } else {
                    this.radius = this.maxFallRadius;
                }
            }
        }

        if (this.gameObject) {
            const newX = this.target.x + this.radius * Math.cos(this.angle);
            const newY = this.target.y + this.radius * Math.sin(this.angle);
            this.gameObject.setPosition(newX, newY);
        }
    }

    public setRadius(radius: number) {
        this.radius = radius;
    }

    public setSpeed(speed: number) {
        this.speed = speed;
    }

    public setAngle(angle: number) {
        this.angle = angle;
    }

    public getAngle(): number {
        return this.angle;
    }
}