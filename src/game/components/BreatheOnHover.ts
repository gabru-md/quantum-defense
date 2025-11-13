import { Component } from '../core/Component';
import * as Phaser from 'phaser';

export class BreatheOnHover extends Component {
    private breathingTween: Phaser.Tweens.Tween | null = null;
    private scale: number;
    private duration: number;

    constructor(scale: number = 1.2, duration: number = 1000) {
        super();
        this.scale = scale;
        this.duration = duration;
    }

    start(): void {
        if (!this.gameObject.input) {
            this.gameObject.setInteractive();
        }

        this.gameObject.on('pointerover', () => {
            if (this.breathingTween) {
                this.breathingTween.stop();
            }
            this.breathingTween = this.gameObject.scene.tweens.add({
                targets: this.gameObject,
                scale: this.scale,
                duration: this.duration,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1,
            });
        });

        this.gameObject.on('pointerout', () => {
            if (this.breathingTween) {
                this.breathingTween.stop();
                this.breathingTween = null;
            }
            this.gameObject.scene.tweens.add({
                targets: this.gameObject,
                scale: 1,
                duration: 200,
                ease: 'Sine.easeInOut',
            });
        });
    }

    destroy(): void {
        if (this.breathingTween) {
            this.breathingTween.stop();
        }
        this.gameObject.off('pointerover');
        this.gameObject.off('pointerout');
    }
}
