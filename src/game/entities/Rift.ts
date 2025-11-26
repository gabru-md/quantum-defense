import {GameObject} from '../core/GameObject.ts';
import * as Phaser from 'phaser';
import {RiftWave} from './RiftWave.ts';
import {QuantumEcho} from './QuantumEcho.ts';
import {AppColors, phaserColor} from '../scripts/Colors.ts';
import {RiftElements} from "../effects/GlitchAnnihilationEffect.ts";
import {Level} from "../scenes/lib/Level.ts";
import {capitalize} from "../scripts/Util.ts";
import {Hoverable} from "../components/Hoverable.ts";

export type RiftType = 'static' | 'guardian' | 'gradient' | 'dormant';

export class Rift extends GameObject {
    public riftType: RiftType;
    private waveCooldown: number;
    private lastWaveTime: number = 0;
    private riftColor: number;
    private secondaryColor: number | null = null;
    private riftElements: RiftElements;
    public scaleFactor: number;

    constructor(scene: Level, x: number, y: number, type: RiftType, scale: number = -1) {
        super(scene, x, y, ''); // No texture needed

        this.riftType = type;
        this.waveCooldown = 10000; // 10 seconds, can be configured
        this.scaleFactor = scale === -1 ? Phaser.Math.FloatBetween(0.7, 1.0) : scale;

        switch (this.riftType) {
            case 'static':
                this.riftColor = phaserColor(AppColors.SPECIAL_ENEMY);
                break;
            case 'guardian':
                this.riftColor = phaserColor(AppColors.PLAYER);
                break;
            case 'gradient':
                this.riftColor = phaserColor(AppColors.PLAYER);
                this.secondaryColor = phaserColor(AppColors.SPECIAL_ENEMY);
                break;
            case 'dormant':
                this.riftColor = phaserColor(AppColors.UI_DISABLED);
                break;
        }

        this.riftElements = scene.glitchManager.drawRiftElements(x, y, 3 * this.scaleFactor, this.scaleFactor, this.riftColor, this.secondaryColor, 0.8);
        scene.glitchManager.animateRiftIdle(this.riftElements);

        const hitAreaRadius = 100 * this.scaleFactor;
        this.setInteractive(new Phaser.Geom.Circle(0, 0, hitAreaRadius), Phaser.Geom.Circle.Contains);

        this.on('pointerover', () => {
            console.log('Pointer on Rift')
            this.level.hud.setHelpText(`${capitalize(this.riftType)} Rift:\n${this.getRiftDescription()} `)
        });
        this.on('pointerout', () => this.level.hud.setHelpText(''));

        this.addComponent(new Hoverable(`${capitalize(this.riftType)} Rift`));
    }

    update(time: number, delta: number): void {
        super.update(time, delta);
        if (this.active) {
            if (time > this.lastWaveTime + this.waveCooldown) {
                this.emitWave();
                this.lastWaveTime = time;
            }
        }
    }

    private emitWave(): void {
        let waveType = this.riftType;
        let waveColor = this.riftColor;

        if (this.riftType === 'gradient') {
            if (Math.random() < 0.5) {
                waveType = 'static';
                waveColor = phaserColor(AppColors.SPECIAL_ENEMY);
            } else {
                waveType = 'guardian';
                waveColor = phaserColor(AppColors.PLAYER);
            }
        }

        const wave = new RiftWave(this.scene, this.x, this.y, waveType, 300 * this.scaleFactor, 125 * this.scaleFactor, waveColor);
        (this.scene as Level).riftWaves.add(wave);

        if (this.riftType === 'dormant') {
            // dormant rifts do not spawn the echoes
            return;
        }

        for (let i = 0; i < Phaser.Math.Between(3, 5); i++) {
            let offsetX = Phaser.Math.Between(-15, 15);
            let offsetY = Phaser.Math.Between(-15, 15);
            const echo = new QuantumEcho(this.scene, this.x + offsetX, this.y + offsetY);
            (this.scene as Level).quantumEchoes.add(echo);
        }
    }

    destroy(fromScene?: boolean) {
        this.riftElements.core.destroy();
        this.riftElements.innerGlow.destroy();
        this.riftElements.outerGlow.destroy();
        this.riftElements.rays.forEach(ray => ray.destroy());
        this.riftElements.fragments.forEach(fragment => fragment.destroy());
        super.destroy(fromScene);
    }

    getRiftDescription() {
        switch (this.riftType) {
            case 'static':
                return 'Emits static energy wave that disables towers\nDrops quantum echoes on every wave.';
            case 'guardian':
                return 'Emits nexus energy wave that revives towers\nPhantoms hit by the wave die instantly\nDrops quantum echoes on every wave.';
            case 'gradient':
                return 'Emits nexus and static energy randomly\nDrops quantum echoes on every wave.';
            case 'dormant':
                return 'Emits dormant energy waves\nDoes not drop quantum echoes.';
        }
    }
}
