import { Component } from '../core/Component.ts';
import { GameObject } from '../core/GameObject.ts';

export class CircularMovement extends Component {
    private angle: number = 0;

    constructor(
        private target: GameObject,
        private radius: number,
        private speed: number
    ) {
        super();
    }

    update(time: number, delta: number): void {
        this.angle += this.speed * (delta / 1000);

        if (this.gameObject) {
            const newX = this.target.x + this.radius * Math.cos(this.angle);
            const newY = this.target.y + this.radius * Math.sin(this.angle);
            this.gameObject.setPosition(newX, newY);
        }
    }
}
