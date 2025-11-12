import {Component} from '../core/Component';
import * as Phaser from 'phaser';
import {phaserColor} from '../scripts/Colors.ts'

/**
 * A component that adds a continuous, non-damaging visual pulse to a GameObject.
 */
export class VisualPulse extends Component {
    private pulseGraphicsList!: Phaser.GameObjects.Graphics[];
    private pulseTweenList!: Phaser.Tweens.Tween[];
    /**
     * The color of the pulse.
     */
    private _color: number;

    /**
     * Creates an instance of VisualPulse.
     * @param color The color of the pulse.
     * @param pulseDelay The delay between the start of each individual pulse in milliseconds.
     * @param duration The duration of a single pulse animation in milliseconds.
     * @param scale The maximum scale factor the pulse will reach.
     * @param totalPulses The total number of individual pulses that will be active simultaneously.
     * @param lineWidth The width of the line used to draw the pulse circle.
     */
    constructor(color: number, private pulseDelay: number, private duration: number, private scale: number = 2.75, private totalPulses: number = 10, private lineWidth: number = 1) {
        super();
        this._color = color;
        this.pulseTweenList = [];
        this.pulseGraphicsList = [];
    }

    public start(): void {
        for (let i = 0; i < this.totalPulses; i++) {
            this.gameObject.scene.time.delayedCall(i * this.pulseDelay, () => {
                if (!this.gameObject.active) {
                    return;
                }
                const pulseGraphics = this.gameObject.scene.add.graphics({
                    fillStyle: {color: phaserColor(this._color), alpha: 0.1},
                    lineStyle: {width: this.lineWidth, color: phaserColor(this._color), alpha: 0.8}
                });
                pulseGraphics.setDepth(this.gameObject.depth - 1);
                pulseGraphics.x = this.gameObject.x;
                pulseGraphics.y = this.gameObject.y;

                this.pulseTweenList.push(this.gameObject.scene.tweens.add({
                    targets: pulseGraphics,
                    scale: this.scale,
                    alpha: 0,
                    duration: this.duration,
                    ease: 'Sine.easeOut',
                    repeat: -1,
                    onUpdate: (_tween, target) => {
                        if (!this.enabled) {
                            return;
                        }
                        pulseGraphics.clear();
                        pulseGraphics.lineStyle(this.lineWidth, phaserColor(this._color), target.alpha * 0.8);
                        pulseGraphics.fillStyle(phaserColor(this._color), target.alpha * 0.3);
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

    public update(_time: number = 0, _deltaTime: number): void {
        if (!this.enabled) {
            this.destroy();
            return;
        }
        for (let i = 0; i < this.pulseGraphicsList.length; i++) {
            this.pulseGraphicsList[i].x = this.gameObject.x;
            this.pulseGraphicsList[i].y = this.gameObject.y;
        }
    }

    public setColor(newColor: number): void {
        this._color = newColor;
        // Re-draw existing pulses with new color
        this.pulseGraphicsList.forEach(graphics => {
            graphics.lineStyle(this.lineWidth, phaserColor(this._color), graphics.alpha * 0.8);
            graphics.fillStyle(phaserColor(this._color), graphics.alpha * 0.3);
        });
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
