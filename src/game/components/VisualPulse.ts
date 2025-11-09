import {Component} from '../core/Component';
import * as Phaser from 'phaser';

/**
 * A component that adds a continuous, non-damaging visual pulse to a GameObject.
 */
export class VisualPulse extends Component {
    private pulseGraphicsList!: Phaser.GameObjects.Graphics[];
    private pulseTweenList!: Phaser.Tweens.Tween[];

    constructor(private color: number, private pulseDelay: number, private duration: number, private scale: number = 2.75) {
        super();
        this.pulseTweenList = [];
        this.pulseGraphicsList = [];
    }

    public start(): void {
        let totalPulses = 10;
        for (let i = 0; i < totalPulses; i++) {
            this.gameObject.scene.time.delayedCall(i * this.pulseDelay, () => {
                if(!this.gameObject.active) {
                    return;
                }
                const pulseGraphics = this.gameObject.scene.add.graphics({
                    fillStyle: {color: this.color, alpha: 0.1},
                    lineStyle: {width: 1, color: this.color, alpha: 0.8}
                });
                pulseGraphics.setDepth(this.gameObject.depth - 1); // Draw pulse behind the game object
                pulseGraphics.x = this.gameObject.x;
                pulseGraphics.y = this.gameObject.y;

                // Create a tween that animates the pulse
                this.pulseTweenList.push( this.gameObject.scene.tweens.add({
                    targets: pulseGraphics,
                    scale: this.scale, // Scale to reach desired radius
                    alpha: 0,
                    duration: this.duration,
                    ease: 'Sine.easeOut',
                    repeat: -1,
                    onUpdate: (_tween, target) => {
                        // Draw expanding circle
                        pulseGraphics.clear();
                        pulseGraphics.lineStyle(1, this.color, target.alpha * 0.8);
                        pulseGraphics.fillStyle(this.color, target.alpha * 0.3);
                        const radius = (this.gameObject.width / 2) * target.scale;
                        pulseGraphics.fillCircle(0, 0, radius);
                        pulseGraphics.strokeCircle(0, 0, radius);
                    },
                    onComplete: () => {
                        pulseGraphics.destroy();
                    }
                }));
                this.pulseGraphicsList.push(pulseGraphics);

            });
        }
    }

    public update(_deltatime: number): void {
        // empty
    }

    public destroy(): void {
        this.pulseTweenList.forEach((tween) => {
            tween.stop();
        });
        this.pulseGraphicsList.forEach((graphics) => {
            graphics.destroy();
        })
    }
}
