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
import {AppColors, phaserColor} from "../../../scripts/Colors.ts";

export class HudManager extends Manager {

    protected gameName!: Phaser.GameObjects.Text;
    protected levelText!: Phaser.GameObjects.Text;
    protected baseHealthText!: Phaser.GameObjects.Text;
    protected moneyText!: Phaser.GameObjects.Text;
    protected waveProgressText!: Phaser.GameObjects.Text;
    protected messageText!: Phaser.GameObjects.Text;
    private rangePreview!: Phaser.GameObjects.Sprite;
    private selectionIndicator!: Phaser.GameObjects.Graphics;
    private towerSelectionButtons: {
        [key: string]: {
            button: Phaser.GameObjects.Image,
            panel: Phaser.GameObjects.Graphics,
            textObjects: Phaser.GameObjects.Text[]
        }
    } = {};
    private helpTextPanel!: Phaser.GameObjects.Text;

    constructor(public scene: Level) {
        super(scene);
    }

    public setup() {
        this.createMessageText(); // Message text first so it's on top
        this.createMainStatsPanel();
        this.createTowerSelectionPanel();
        this.createHelpPanel();
        this.setupGameVisualSeparators();
        this.setupHudVisualSeparators();
        this.update(); // Initial UI update
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
        this.helpTextPanel.destroy(); // Destroy the new help text panel
        // Destroy tower selection buttons and their text objects
        for (const key in this.towerSelectionButtons) {
            this.towerSelectionButtons[key].button.destroy();
            this.towerSelectionButtons[key].panel.destroy();
            this.towerSelectionButtons[key].textObjects.forEach(text => text.destroy());
        }
    }

    public update(_time: number = 0, _delta: number = 0): void {
        this.updateMainStats();
        this.updateTowerSelectionUI();
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
        this.helpTextPanel.setText(text);
    }


    public alert(text: string, color: string = AppColors.UI_MESSAGE_ERROR, delay: number = 300): void {
        this.helpTextPanel.setText(text).setColor(color);
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
        panel.lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1);
        panel.strokeRect(hudX, startY, panelWidth, panelHeight);
        panel.setDepth(90);

        let currentY = startY + 10;
        const textX = hudX + 15;
        const textSpacing = 25;

        this.gameName = this.scene.add.text(textX, currentY, 'QUANTUM DEFENSE', {
            font: '28px',
            color: AppColors.UI_ACCENT
        }).setDepth(100);
        currentY += 40;

        this.levelText = this.scene.add.text(textX, currentY, `Level: ${this.scene.scene.key}`, {
            font: '20px',
            color: AppColors.UI_TEXT
        }).setDepth(100).setName('levelText');
        currentY += textSpacing;

        this.baseHealthText = this.scene.add.text(textX, currentY, `Health: ${this.scene.state.baseHealth}`, {
            font: '20px',
            color: AppColors.UI_TEXT
        }).setDepth(100).setName('baseHealthText');
        currentY += textSpacing;

        this.moneyText = this.scene.add.text(textX, currentY, `Money: $${this.scene.state.money}`, {
            font: '20px',
            color: AppColors.UI_TEXT
        }).setDepth(100).setName('moneyText');
        currentY += textSpacing;

        this.waveProgressText = this.scene.add.text(textX, currentY, `Wave: ${this.scene.waveManager.currentWave}`, {
            font: '20px',
            color: AppColors.UI_TEXT
        }).setDepth(100).setName('waveProgressText');
    }

    private createTowerSelectionPanel() {
        const hudX = GAME_WIDTH + 15;
        const startY = 200;
        const panelWidth = WIDTH - GAME_WIDTH - 30;
        const panelHeight = 600; // Adjusted height to make space for help text

        // Background panel
        const panel = this.scene.add.graphics();
        panel.fillRect(hudX, startY, panelWidth, panelHeight);
        panel.lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1);
        panel.strokeRect(hudX, startY, panelWidth, panelHeight);
        panel.setDepth(90);

        this.scene.add.text(hudX + 10, startY + 10, 'BUILD TOWERS', {
            font: '28px',
            color: AppColors.UI_ACCENT
        }).setDepth(100);

        // Tower 1
        this.createTowerButton(hudX + 15, startY + 50, 'tower1', TOWER1_COST, 'DMG: 25 | FR: 5/s', 'Laser Tower');
        // Tower 2
        this.createTowerButton(hudX + 15, startY + 150, 'tower2', TOWER2_COST, 'DMG: 75 | AoE: 80', 'Bomb Tower');
        // Tower 3
        this.createTowerButton(hudX + 15, startY + 250, 'tower3', TOWER3_COST, 'Slow: 50% | Range: 100', 'Slowing Tower');

        // Selection Indicator
        this.selectionIndicator = this.scene.add.graphics().setDepth(101);
        this.updateSelectionIndicator('tower1'); // Default selection

        // Help Text Panel (positioned within the tower selection panel for now)
        this.helpTextPanel = this.scene.add.text(hudX + 15, startY + panelHeight - 80, '', {
            font: '14px',
            color: AppColors.UI_TEXT,
            wordWrap: {width: panelWidth - 30}
        }).setDepth(100);

        this.rangePreview = this.scene.add.sprite(0, 0, 'rangePreview').setAlpha(0.0625).setVisible(false);
    }

    private createTowerButton(x: number, y: number, towerKey: string, cost: number, stats: string, name: string) {
        const buttonWidth = WIDTH - GAME_WIDTH - 50;
        const buttonHeight = 90;

        const buttonPanel = this.scene.add.graphics();
        buttonPanel.fillRect(x, y, buttonWidth, buttonHeight);
        buttonPanel.strokeRect(x, y, buttonWidth, buttonHeight);
        buttonPanel.setDepth(95);

        const buttonImage = this.scene.add.image(x + 40, y + buttonHeight / 2, towerKey).setInteractive().setDepth(100);
        buttonImage.setScale(1.5); // Make tower icons a bit larger

        const nameText = this.scene.add.text(x + 80, y + 10, name, {
            font: '18px',
            color: AppColors.UI_TEXT
        }).setDepth(100);
        const costText = this.scene.add.text(x + 80, y + 35, `Cost: $${cost}`, {
            font: '16px',
            color: AppColors.UI_TEXT
        }).setDepth(100);
        const statsText = this.scene.add.text(x + 80, y + 60, `Stats: ${stats}`, {
            font: '14px',
            color: AppColors.UI_DISABLED
        }).setDepth(100);

        buttonImage.on('pointerdown', () => {
            this.scene.state.selectedTowerType = towerKey;
            this.updateSelectionIndicator(towerKey);
        });
        buttonImage.on('pointerover', () => this.setHelpText(this.scene.towerManager.getTowerDescription(towerKey)));
        buttonImage.on('pointerout', () => this.setHelpText(''));

        this.towerSelectionButtons[towerKey] = {
            button: buttonImage,
            panel: buttonPanel,
            textObjects: [nameText, costText, statsText]
        };
    }

    private createHelpPanel() {
        const hudX = GAME_WIDTH + 15;
        const startY = GAME_HEIGHT - 270; // Positioned lower
        const panelWidth = WIDTH - GAME_WIDTH - 30;
        const panelHeight = 250;

        // Background panel
        const panel = this.scene.add.graphics();
        panel.fillRect(hudX, startY, panelWidth, panelHeight);
        panel.lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1);
        panel.strokeRect(hudX, startY, panelWidth, panelHeight);
        panel.setDepth(90);

        this.scene.add.text(hudX + 10, startY + 10, 'HOW TO PLAY', {
            font: '24px',
            color: AppColors.UI_ACCENT
        }).setDepth(100);
        this.scene.add.text(hudX + 10, startY + 50,
            '1. Click a tower icon to select it.\n' +
            '2. Click on the map to place it.\n' +
            '3. Use WASD to move your player.\n' +
            '4. Press E near a damaged tower to revive it.\n' +
            '5. Prevent enemies from reaching your base!',
            {font: '16px', color: AppColors.UI_TEXT, lineSpacing: 8, wordWrap: {width: panelWidth - 20}}
        ).setDepth(100);
    }

    private createMessageText() {
        this.messageText = this.scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '', {
            font: '48px',
            color: AppColors.UI_MESSAGE_ERROR,
            backgroundColor: AppColors.UI_MESSAGE_BACKGROUND,
            padding: {x: 30, y: 20}
        }).setOrigin(0.5).setScrollFactor(0).setVisible(false).setDepth(200).setName('messageText');
    }

    private updateMainStats() {
        this.levelText.setText(`Level: ${this.scene.scene.key}`);
        this.baseHealthText.setText(`Health: ${this.scene.state.baseHealth}`);
        this.moneyText.setText(`Money: $${this.scene.state.money}`);
        this.waveProgressText.setText(`Wave: ${this.scene.waveManager.enemiesSpawnedInWave}/${this.scene.waveManager.maxEnemiesInWave}`);
    }

    private updateTowerSelectionUI() {
        for (const key in this.towerSelectionButtons) {
            const cost = this.scene.towerManager.getTowerCost(key);
            const {button, panel, textObjects} = this.towerSelectionButtons[key];
            if (this.scene.state.money < cost) {
                button.setAlpha(0.5);
                panel.setAlpha(0.5);
                button.disableInteractive();
                textObjects.forEach(text => text.setColor(AppColors.UI_DISABLED));
            } else {
                button.setAlpha(1);
                panel.setAlpha(1);
                button.setInteractive();
                textObjects.forEach(text => text.setColor(AppColors.UI_TEXT));
            }
        }
    }

    private updateSelectionIndicator(towerKey: string) {
        const {button} = this.towerSelectionButtons[towerKey];
        this.selectionIndicator.clear();

        this.selectionIndicator.lineStyle(2, 0xffffff, 1);
        this.selectionIndicator.strokeRect(button.x - 32, button.y - 32, 64, 64);
    }

    private updateRangePreview() {
        if (this.rangePreview) {
            const pointer = this.scene.input.activePointer;
            if (pointer.x < GAME_WIDTH) {
                this.rangePreview.setVisible(true);
                this.rangePreview.setPosition(pointer.x, pointer.y);
                const range = this.scene.towerManager.getTowerRange(this.scene.state.selectedTowerType);
                this.rangePreview.setScale(range * 2 / 300); // Assuming original texture size is 300
            } else {
                this.rangePreview.setVisible(false);
            }
        }
    }

    private setupGameVisualSeparators() {
        this.scene.add.graphics()
            .lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1)
            .beginPath()
            .moveTo(GAME_WIDTH, 0)
            .lineTo(GAME_WIDTH, GAME_HEIGHT)
            .closePath()
            .stroke()
            .setScrollFactor(0)
            .setDepth(1500);

        this.scene.add.graphics()
            .lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1)
            .beginPath()
            .moveTo(0, 0)
            .lineTo(0, GAME_HEIGHT)
            .closePath()
            .stroke()
            .setScrollFactor(0)
            .setDepth(1500);

        this.scene.add.graphics()
            .lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1)
            .beginPath()
            .moveTo(0, 0)
            .lineTo(GAME_WIDTH, 0)
            .closePath()
            .stroke()
            .setScrollFactor(0)
            .setDepth(1500);

        this.scene.add.graphics()
            .lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1)
            .beginPath()
            .moveTo(0, GAME_HEIGHT)
            .lineTo(GAME_WIDTH, GAME_HEIGHT)
            .closePath()
            .stroke()
            .setScrollFactor(0)
            .setDepth(1500);
    }

    private setupHudVisualSeparators() {
        this.scene.add.graphics()
            .lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1)
            .beginPath()
            .moveTo(GAME_WIDTH, 0)
            .lineTo(GAME_WIDTH, GAME_HEIGHT)
            .closePath()
            .stroke()
            .setScrollFactor(0)
            .setDepth(1500);

        this.scene.add.graphics()
            .lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1)
            .beginPath()
            .moveTo(WIDTH, 0)
            .lineTo(WIDTH, GAME_HEIGHT)
            .closePath()
            .stroke()
            .setScrollFactor(0)
            .setDepth(1500);

        this.scene.add.graphics()
            .lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1)
            .beginPath()
            .moveTo(GAME_WIDTH, 0)
            .lineTo(WIDTH, 0)
            .closePath()
            .stroke()
            .setScrollFactor(0)
            .setDepth(1500);

        this.scene.add.graphics()
            .lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1)
            .beginPath()
            .moveTo(GAME_WIDTH, GAME_HEIGHT)
            .lineTo(WIDTH, GAME_HEIGHT)
            .closePath()
            .stroke()
            .setScrollFactor(0)
            .setDepth(1500);
    }
}
