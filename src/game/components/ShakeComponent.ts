import {Component} from "../core/Component.ts";

export class ShakeComponent extends Component {

    constructor() {
        super();
        this.enabled = false;
    }

    update(_time: number, _delta: number): void {
        if (this.gameObject) {
            const newX = this.gameObject.x + Phaser.Math.RND.pick([-1, 1]);
            const newY = this.gameObject.y + Phaser.Math.RND.pick([-1, 1]);
            this.gameObject.setPosition(newX, newY);
        }
    }
}