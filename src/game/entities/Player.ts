import {GameObject} from '../core/GameObject';
import {PlayerController} from '../scripts/PlayerController';
import * as Phaser from 'phaser';
import {BreatheOnHover} from '../components/BreatheOnHover.ts';
import {VisualPulse} from "../components/VisualPulse.ts";
import {Genie} from "./Genie.ts";
import {Health} from "../components/Health.ts";
import {AppColors} from "../scripts/Colors.ts";

export interface PlayerConfig {
    scene: Phaser.Scene;
    x: number;
    y: number;
    texture: string;
}

export class Player extends GameObject {
    public genie: Genie;
    private healthComponent: Health;
    private notificationText: Phaser.GameObjects.Text;
    private genieTextObject: Phaser.GameObjects.Text;
    private notificationTween?: Phaser.Tweens.Tween;
    private genieTextTween?: Phaser.Tweens.Tween;

    constructor(config: PlayerConfig) {
        super(config.scene, config.x, config.y, config.texture);

        // Enable physics for the player
        config.scene.physics.world.enable(this);
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true);
        body.setDrag(350);
        this.setAlpha(0.8);

        // Add components
        this.addComponent(new PlayerController());
        this.addComponent(new BreatheOnHover(1.2, 1000));
        this.healthComponent = new Health(100);
        this.addComponent(this.healthComponent);

        // Create and add the Genie
        this.genie = new Genie(config.scene, this);
        config.scene.add.existing(this.genie);

        // Create the notification text
        this.notificationText = this.scene.add.text(this.x, this.y - 30, '!', {
            font: '24px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setVisible(false);

        // Create the genie text object
        this.genieTextObject = this.scene.add.text(this.x, this.y + 30, '', {
            font: '12px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setVisible(false);
    }

    public info(text?: string): void {
        if (text) {
            this.genieText(text, AppColors.UI_ACCENT);
        }
        // this.showNotification(AppColors.UI_ACCENT);
    }

    public warn(text?: string): void {
        if (text) {
            this.genieText(text, '#FFFF00');
        }
        // this.showNotification('#FFFF00');
    }

    public danger(text?: string): void {
        if (text) {
            this.genieText(text, '#FF0000');
        }
        // this.showNotification('#FF0000');
    }

    public genieText(text: string, color?: string): void {
        // Stop any existing tween
        if (this.genieTextTween) {
            this.genieTextTween.stop();
            this.genieTextTween = undefined;
        }

        // Reset the text object to its initial state
        this.genieTextObject.setY(this.y + 30);
        this.genieTextObject.setAlpha(1);

        // Set color and text
        if (color) {
            this.genieTextObject.setColor(color);
        }
        this.genieTextObject.setText(text).setVisible(true);

        // Create new tween
        this.genieTextTween = this.scene.tweens.add({
            targets: this.genieTextObject,
            alpha: 0,
            duration: 2500,
            ease: 'Power2',
            onComplete: () => {
                this.genieTextObject.setVisible(false);
                this.genieTextObject.setAlpha(1);
                this.genieTextObject.setY(this.y + 30);
                this.genieTextTween = undefined;
            }
        });
    }

    // private showNotification(color: string): void {
    //     // Stop any existing tween
    //     if (this.notificationTween) {
    //         this.notificationTween.stop();
    //         this.notificationTween = undefined;
    //     }
    //
    //     // Reset the notification to its initial state
    //     this.notificationText.setY(this.y - 30);
    //     this.notificationText.setAlpha(1);
    //
    //     // Set color and make visible
    //     this.notificationText.setColor(color).setVisible(true);
    //
    //     // Create new tween
    //     this.notificationTween = this.scene.tweens.add({
    //         targets: this.notificationText,
    //         y: this.y - 50,
    //         alpha: 0,
    //         duration: 1500,
    //         ease: 'Power2',
    //         onComplete: () => {
    //             this.notificationText.setVisible(false);
    //             this.notificationText.setAlpha(1);
    //             this.notificationText.setY(this.y - 30);
    //             this.notificationTween = undefined;
    //         }
    //     });
    // }

    public update(time: number, delta: number): void {
        super.update(time, delta);

        // Always update X position to follow player horizontally
        this.notificationText.setX(this.x);
        this.genieTextObject.setX(this.x);

        this.notificationText.setY(this.y - 30);
        this.genieTextObject.setY(this.y + 30);

    }

    public setVisible(value: boolean): this {
        const visualPulse = this.getComponent(VisualPulse);
        if (visualPulse) {
            visualPulse.enabled = value;
        }
        if (this.genie) {
            this.genie.setVisible(value);
        }
        return super.setVisible(value);
    }

    public takeDamage(amount: number): void {
        this.healthComponent.takeDamage(amount);
        this.scene.cameras.main.flash(250, 255, 0, 0);
    }

    destroy(fromScene?: boolean) {
        // Clean up tweens
        if (this.notificationTween) {
            this.notificationTween.stop();
            this.notificationTween = undefined;
        }
        if (this.genieTextTween) {
            this.genieTextTween.stop();
            this.genieTextTween = undefined;
        }

        if (this.genie) {
            this.genie.destroy(fromScene);
        }
        for (let component of this.components) {
            component.enabled = false;
        }
        this.notificationText.destroy();
        this.genieTextObject.destroy();
        super.destroy(fromScene);
    }
}