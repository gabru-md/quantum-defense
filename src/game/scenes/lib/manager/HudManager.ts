import Phaser from "phaser";
import {Level} from "../Level.ts";
import {Manager} from "../Manager.ts";
import {GAME_HEIGHT, GAME_WIDTH, TOWER1_COST, TOWER2_COST, WIDTH} from "../../../scripts/util.ts";

export class HudManager extends Manager {

    protected gameName!: Phaser.GameObjects.Text;
    protected levelText!: Phaser.GameObjects.Text;
    protected baseHealthText!: Phaser.GameObjects.Text;
    protected moneyText!: Phaser.GameObjects.Text;
    protected waveProgressText!: Phaser.GameObjects.Text;
    protected messageText!: Phaser.GameObjects.Text;
    private rangePreview!: Phaser.GameObjects.Sprite;
    private selectionIndicator!: Phaser.GameObjects.Graphics;

    constructor(public scene: Level) {
        super(scene);
    }

    public setup() {
        const hudY = 10
        const hudX: number = GAME_WIDTH + 10
        const spacing: number = 40;

        this.gameName = this.scene.add.text(hudX, hudY, 'Quantum Defense', {
            font: '30px',
            color: '#ffffff'
        }).setScrollFactor(0).setDepth(100);
        this.levelText = this.scene.add.text(hudX, hudY + spacing, '',).setScrollFactor(0).setDepth(100);
        this.baseHealthText = this.scene.add.text(hudX, hudY + 1.5 * spacing, '',).setScrollFactor(0).setDepth(100);
        this.moneyText = this.scene.add.text(hudX, hudY + 2 * spacing, '',).setScrollFactor(0).setDepth(100);
        this.waveProgressText = this.scene.add.text(hudX, hudY + 2.5 * spacing, '',).setScrollFactor(0).setDepth(100);

        this.messageText = this.scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '', {
            font: '48px Roboto',
            color: '#ff0000',
            backgroundColor: 'rgba(0,0,0,0.40)',
            padding: {x: 20, y: 10}
        }).setOrigin(0.5).setScrollFactor(0).setVisible(false).setDepth(100);


        this.createHelpPanel();
        this.setupGameVisualSeparators();
        this.setupHudVisualSeparators();
        this.createTowerSelectionUI();
        this.update();
    }

    public update(_time: number = 0, _delta: number = 0): void {
        this.baseHealthText.setText(`Base Health: ${this.scene.state.baseHealth}`);
        this.moneyText.setText(`Money: $${this.scene.state.money}`);
        this.waveProgressText.setText(`Wave ${this.scene.waveManager.currentWave}: ${this.scene.waveManager.enemiesSpawnedInWave}/${this.scene.waveManager.maxEnemiesInWave}`);
        this.updateRangePreview();
    }

    public info(message: string, color: string, callback?: () => void) {
        this.messageText.setText(message).setColor(color).setVisible(true);
        this.scene.time.delayedCall(1500, () => {
            this.messageText.setVisible(false)
            if (callback) {
                callback();
            }
        });
    }

    private createTowerSelectionUI() {
        const hudX = GAME_WIDTH + 10;
        const hudY = 200;
        const spacing = 80;

        this.selectionIndicator = this.scene.add.graphics();
        this.selectionIndicator.lineStyle(2, 0xffffff, 1);
        this.selectionIndicator.strokeRect(0, 0, 64, 64);
        this.selectionIndicator.setDepth(101);

        // Tower 1 Button
        const tower1Button = this.scene.add.sprite(hudX + 50, hudY, 'tower1').setInteractive();
        this.scene.add.text(hudX + 100, hudY, `Tower 1\nCost: ${TOWER1_COST}`, {
            font: '16px Arial',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        tower1Button.on('pointerdown', () => {
            this.scene.state.selectedTowerType = 'tower1';
            this.selectionIndicator.setPosition(tower1Button.x - 32, tower1Button.y - 32);
        });

        // Tower 2 Button
        const tower2Button = this.scene.add.sprite(hudX + 50, hudY + spacing, 'tower2').setInteractive();
        this.scene.add.text(hudX + 100, hudY + spacing, `Tower 2\nCost: ${TOWER2_COST}`, {
            font: '16px Arial',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        tower2Button.on('pointerdown', () => {
            this.scene.state.selectedTowerType = 'tower2';
            this.selectionIndicator.setPosition(tower2Button.x - 32, tower2Button.y - 32);
        });

        // Set initial selection
        this.selectionIndicator.setPosition(tower1Button.x - 32, tower1Button.y - 32);

        // Range Preview
        this.rangePreview = this.scene.add.sprite(0, 0, 'rangePreview').setAlpha(0.10).setVisible(false);
    }

    private updateRangePreview() {
        if (this.rangePreview) {
            const pointer = this.scene.input.activePointer;
            if (pointer.x < GAME_WIDTH) {
                this.rangePreview.setVisible(true);
                this.rangePreview.setPosition(pointer.x, pointer.y);
                const range = this.scene.state.selectedTowerType === 'tower1' ? 150 : 180;
                this.rangePreview.setScale(range * 2 / 300);
            } else {
                this.rangePreview.setVisible(false);
            }
        }
    }

    private setupGameVisualSeparators() {
        this.scene.add.graphics()
            .lineStyle(2, 0xffffff, 1)
            .beginPath()
            .moveTo(GAME_WIDTH, 0)
            .lineTo(GAME_WIDTH, GAME_HEIGHT)
            .closePath()
            .stroke()
            .setScrollFactor(0);

        this.scene.add.graphics()
            .lineStyle(2, 0xffffff, 1)
            .beginPath()
            .moveTo(0, 0)
            .lineTo(0, GAME_HEIGHT)
            .closePath()
            .stroke()
            .setScrollFactor(0);

        this.scene.add.graphics()
            .lineStyle(2, 0xffffff, 1)
            .beginPath()
            .moveTo(0, 0)
            .lineTo(GAME_WIDTH, 0)
            .closePath()
            .stroke()
            .setScrollFactor(0);

        this.scene.add.graphics()
            .lineStyle(2, 0xffffff, 1)
            .beginPath()
            .moveTo(0, GAME_HEIGHT)
            .lineTo(GAME_WIDTH, GAME_HEIGHT)
            .closePath()
            .stroke()
            .setScrollFactor(0);
    }

    private setupHudVisualSeparators() {
        this.scene.add.graphics()
            .lineStyle(2, 0xffffff, 1)
            .beginPath()
            .moveTo(GAME_WIDTH, 0)
            .lineTo(GAME_WIDTH, GAME_HEIGHT)
            .closePath()
            .stroke()
            .setScrollFactor(0);

        this.scene.add.graphics()
            .lineStyle(2, 0xffffff, 1)
            .beginPath()
            .moveTo(WIDTH, 0)
            .lineTo(WIDTH, GAME_HEIGHT)
            .closePath()
            .stroke()
            .setScrollFactor(0);

        this.scene.add.graphics()
            .lineStyle(2, 0xffffff, 1)
            .beginPath()
            .moveTo(GAME_WIDTH, 0)
            .lineTo(WIDTH, 0)
            .closePath()
            .stroke()
            .setScrollFactor(0);

        this.scene.add.graphics()
            .lineStyle(2, 0xffffff, 1)
            .beginPath()
            .moveTo(GAME_WIDTH, GAME_HEIGHT)
            .lineTo(WIDTH, GAME_HEIGHT)
            .closePath()
            .stroke()
            .setScrollFactor(0);
    }

    private createHelpPanel() {
        const hudX = GAME_WIDTH + 10;
        const panelPadding = 15;
        const panelWidth = WIDTH - GAME_WIDTH - 2 * panelPadding;
        const panelHeight = 250; // Adjusted height
        const panelY = GAME_HEIGHT - panelHeight - 10; // Position at bottom

        const panel = this.scene.add.graphics().setDepth(100);
        panel.fillRect(hudX, panelY, panelWidth, panelHeight);
        panel.lineStyle(1.5, 0xffffff, 1);
        panel.strokeRect(hudX, panelY, panelWidth, panelHeight);

        const textX = hudX + panelPadding;
        let textY = panelY + panelPadding;
        this.scene.add.text(textX, textY, 'HOW TO PLAY', {font: '24px'}).setDepth(100);
        textY += 40;

        this.scene.add.text(textX, textY,
            '1. Click a tower icon to select it.\n' +
            '2. Click on the map to place it.\n\n' +
            'PLAYER CONTROLS:\n' +
            '- Move with WASD.\n' +
            '- Absorb bullets by touching them.\n' +
            '- Press "E" near a damaged tower to revive it.',
            {font: '16px', lineSpacing: 8, wordWrap: {width: panelWidth - 2 * panelPadding}}
        ).setDepth(100);
    }
}
