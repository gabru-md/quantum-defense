import { Component } from '../core/Component';
import * as Phaser from 'phaser';

export class ContinuousBreathing extends Component {
    private breathingTween: Phaser.Tweens.Tween | null = null;
    private scale: number;
    private duration: number;

    constructor(scale: number = 1.1, duration: number = 1500) {
        super();
        this.scale = scale;
        this.duration = duration;
    }

    start(): void {
        if (this.breathingTween) {
            this.breathingTween.stop();
        }
        this.breathingTween = this.gameObject.scene.tweens.add({
            targets: this.gameObject,
            scale: this.scale,
            duration: this.duration,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }

    destroy(): void {
        if (this.breathingTween) {
            this.breathingTween.stop();
        }
    }
}
