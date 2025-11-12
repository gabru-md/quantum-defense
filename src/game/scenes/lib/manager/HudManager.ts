import Phaser from "phaser";
import {Level} from "../Level.ts";
import {Manager} from "../Manager.ts";
import {
    GAME_HEIGHT,
    GAME_WIDTH,
    TOWER1_COST,
    TOWER2_COST,
    TOWER3_COST,
    WIDTH
} from "../../../scripts/Util.ts";
import {AppColors} from "../../../scripts/Colors.ts";

export class HudManager extends Manager {

    protected gameName!: Phaser.GameObjects.Text;
    protected levelText!: Phaser.GameObjects.Text;
    protected baseHealthText!: Phaser.GameObjects.Text;
    protected moneyText!: Phaser.GameObjects.Text;
    protected waveProgressText!: Phaser.GameObjects.Text;
    protected messageText!: Phaser.GameObjects.Text;
    private rangePreview!: Phaser.GameObjects.Sprite;
    private selectionIndicator!: Phaser.GameObjects.Graphics;
    private helpText!: Phaser.GameObjects.Text;

    constructor(public scene: Level) {
        super(scene);
    }

    public setup() {
        this.messageText = this.scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '', {
            font: '48px',
            color: AppColors.UI_PRIMARY_BG,
            backgroundColor: AppColors.UI_MESSAGE_BACKGROUND,
            padding: {x: 20, y: 10}
        }).setOrigin(0.5).setScrollFactor(0).setVisible(false).setDepth(100);


        this.createMainStatsPanel();
        this.createTowerSelectionUI();
        this.createHelpPanel();
        this.setupGameVisualSeparators();
        this.setupHudVisualSeparators();
        this.update();
    }

    destroy(): void {
        this.gameName.destroy();
        this.levelText.destroy();
        this.baseHealthText.destroy();
        this.moneyText.destroy();
        this.waveProgressText.destroy();
        this.messageText.destroy();
        this.rangePreview.destroy();
        this.selectionIndicator.destroy();
        this.helpText.destroy();
    }

    public update(_time: number = 0, _delta: number = 0): void {
        this.baseHealthText.setText(`Base Health: ${this.scene.state.baseHealth}`);
        this.moneyText.setText(`Money: $${this.scene.state.money}`);
        this.waveProgressText.setText(`Wave ${this.scene.waveManager.currentWave}: ${this.scene.waveManager.enemiesSpawnedInWave}/${this.scene.waveManager.maxEnemiesInWave}`);
        this.updateRangePreview();
    }

    public info(message: string, color: string, callback?: () => void) {
        this.messageText.setText(message).setColor(color).setVisible(true).setDepth(200);
        this.scene.time.delayedCall(1500, () => {
            this.messageText.setVisible(false)
            if (callback) {
                callback();
            }
        });
    }

    public setHelpText(text: string): void {
        this.helpText.setText(text);
    }

    public alert(text: string, color: string = AppColors.UI_MESSAGE_ERROR, delay: number = 300): void {
        this.helpText.setText(text).setColor(color);
        this.scene.time.delayedCall(delay, () => {
            this.setHelpText('');
        });
    }

    private createMainStatsPanel() {
        const hudX = GAME_WIDTH + 15;
        const panelWidth = WIDTH - GAME_WIDTH - 30;
        const panelHeight = 180;
        const startY = 10;

        // Background panel
        const panel = this.scene.add.graphics();
        panel.fillRect(hudX, startY, panelWidth, panelHeight);
        panel.lineStyle(1, 0xffffff, 1);
        panel.strokeRect(hudX, startY, panelWidth, panelHeight);

        let currentY = startY + 10;
        const textX = hudX + 15;
        const textSpacing = 25;

        this.gameName = this.scene.add.text(textX, currentY, 'QUANTUM DEFENSE', {font: '28px'}).setDepth(100).setOrigin(-0.125, 0);
        this.scene.add.graphics()
            .lineStyle(1, 0xffffff, 1)
            .beginPath()
            .moveTo(hudX, currentY + 35)
            .lineTo(hudX + panelWidth, currentY + 35)
            .closePath()
            .stroke();
        currentY += 50;

        this.levelText = this.scene.add.text(textX, currentY, `Level: ${this.scene.scene.key}`, {font: '20px'}).setDepth(100).setName('levelText');
        currentY += textSpacing;

        this.baseHealthText = this.scene.add.text(textX, currentY, `❤Health: ${this.scene.state.baseHealth}`, {font: '20px'}).setDepth(100).setName('baseHealthText');
        currentY += textSpacing;

        this.moneyText = this.scene.add.text(textX, currentY, `Money: $${this.scene.state.money}`, {font: '20px'}).setDepth(100).setName('moneyText');
        currentY += textSpacing;

        this.waveProgressText = this.scene.add.text(textX, currentY, `Wave: ${this.scene.waveManager.currentWave}`, {font: '20px'}).setDepth(100).setName('waveProgressText');
    }

    private createHelpPanel() {
        const hudX = GAME_WIDTH + 15;
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
        this.scene.add.text(textX, textY, 'HOW TO PLAY', {font: '24px'}).setDepth(100).setOrigin(-0.50, 0);
        this.scene.add.graphics()
            .lineStyle(1, 0xffffff, 1)
            .beginPath()
            .moveTo(hudX, textY + 25)
            .lineTo(hudX + panelWidth, textY + 25)
            .closePath()
            .stroke();
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

    private createTowerSelectionUI() {
        const hudX = GAME_WIDTH + 15;
        const hudY = 210;
        const spacing = 80;

        const panelWidth = WIDTH - GAME_WIDTH - 30;
        const panelHeight = 600;
        const startY = 200;

        // Background panel
        const panel = this.scene.add.graphics();
        panel.fillRect(hudX, startY, panelWidth, panelHeight);
        panel.lineStyle(1, 0xffffff, 1);
        panel.strokeRect(hudX, startY, panelWidth, panelHeight);

        this.selectionIndicator = this.scene.add.graphics();
        this.selectionIndicator.lineStyle(2, 0xffffff, 1);
        this.selectionIndicator.strokeRect(0, 0, 64, 64);
        this.selectionIndicator.setDepth(101);

        this.scene.add.text(hudX + 100, hudY, 'Towers', {
            font: '48px',
            color: AppColors.UI_TEXT,
        });

        this.scene.add.graphics()
            .lineStyle(1, 0xffffff, 1)
            .beginPath()
            .moveTo(hudX, hudY + 50)
            .lineTo(hudX + panelWidth, hudY + 50)
            .closePath()
            .stroke();

        let yOffset = hudY + 100;

        // Tower 1 Button
        const tower1Button = this.scene.add.sprite(hudX + 50, yOffset, 'tower1').setInteractive();
        this.scene.add.text(hudX + 100, yOffset, `Tower 1\nCost: ${TOWER1_COST}\nRange: ${this.scene.towerManager.getTowerRange('tower1')}`, {
            font: '16px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        tower1Button.on('pointerdown', () => {
            this.scene.state.selectedTowerType = 'tower1';
            this.selectionIndicator.setPosition(tower1Button.x - 32, tower1Button.y - 32);
        });
        tower1Button.on('pointerover', () => this.setHelpText(this.scene.towerManager.getTowerDescription('tower1')));
        tower1Button.on('pointerout', () => this.setHelpText(''));

        // Tower 2 Button
        const tower2Button = this.scene.add.sprite(hudX + 50, yOffset + spacing, 'tower2').setInteractive();
        this.scene.add.text(hudX + 100, yOffset + spacing, `Tower 2\nCost: ${TOWER2_COST}\nRange: ${this.scene.towerManager.getTowerRange('tower2')}`, {
            font: '16px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        tower2Button.on('pointerdown', () => {
            this.scene.state.selectedTowerType = 'tower2';
            this.selectionIndicator.setPosition(tower2Button.x - 32, tower2Button.y - 32);
        });
        tower2Button.on('pointerover', () => this.setHelpText(this.scene.towerManager.getTowerDescription('tower2')));
        tower2Button.on('pointerout', () => this.setHelpText(''));

        // Tower 3 Button
        const tower3Button = this.scene.add.sprite(hudX + 50, yOffset + spacing * 2, 'tower3').setInteractive();
        this.scene.add.text(hudX + 100, yOffset + spacing * 2, `Tower 3\nCost: ${TOWER3_COST}\nRange: ${this.scene.towerManager.getTowerRange('tower3')}`, {
            font: '16px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        tower3Button.on('pointerdown', () => {
            this.scene.state.selectedTowerType = 'tower3';
            this.selectionIndicator.setPosition(tower3Button.x - 32, tower3Button.y - 32);
        });
        tower3Button.on('pointerover', () => this.setHelpText(this.scene.towerManager.getTowerDescription('tower3')));
        tower3Button.on('pointerout', () => this.setHelpText(''));

        // Help Text
        this.helpText = this.scene.add.text(hudX + 15, yOffset + spacing * 4 + 20, '', {
            font: '14px',
            color: '#dddddd',
            wordWrap: {width: panelWidth - 30}
        }).setDepth(100);

        // Set initial selection
        this.selectionIndicator.setPosition(tower1Button.x - 32, tower1Button.y - 32);

        // Range Preview
        this.rangePreview = this.scene.add.sprite(0, 0, 'rangePreview').setAlpha(0.0625).setVisible(false);
    }

    private updateRangePreview() {
        if (this.rangePreview) {
            const pointer = this.scene.input.activePointer;
            if (pointer.x < GAME_WIDTH) {
                this.rangePreview.setVisible(true);
                this.rangePreview.setPosition(pointer.x, pointer.y);
                const range = this.scene.towerManager.getTowerRange(this.scene.state.selectedTowerType);
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
}
