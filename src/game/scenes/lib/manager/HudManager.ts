import Phaser from 'phaser';
import {Level} from '../Level.ts';
import {Manager} from '../Manager.ts';
import {
    GAME_HEIGHT,
    GAME_WIDTH, HEIGHT, TOWER_UPGRADE_QUANTUM_ECHO_REQUIREMENT,
    WIDTH
} from '../../../scripts/Util.ts';
import {AppColors, phaserColor} from '../../../scripts/Colors.ts';
import {TowerConfigs, TowerConfigType} from '../../../config/TowerConfigs.ts';
import {GameObject} from "../../../core/GameObject.ts";
import Graphics = Phaser.GameObjects.Graphics;

export class HudManager extends Manager {
    protected gameName!: Phaser.GameObjects.Text;
    protected levelText!: Phaser.GameObjects.Text;
    protected baseHealthText!: Phaser.GameObjects.Text;
    protected energyText!: Phaser.GameObjects.Text;
    protected waveNumberText!: Phaser.GameObjects.Text;
    protected waveProgressText!: Phaser.GameObjects.Text;
    protected messageText!: Phaser.GameObjects.Text;
    private rangePreview!: Phaser.GameObjects.Graphics;
    private selectionIndicator!: Phaser.GameObjects.Graphics;
    private towerSelectionButtons: {
        [key: string]: {
            button: Phaser.GameObjects.Image;
            panel: Phaser.GameObjects.Graphics;
            textObjects: Phaser.GameObjects.Text[];
        };
    } = {};
    private deselectButton!: Phaser.GameObjects.Text;
    private helpTextPanel!: Phaser.GameObjects.Text;
    private markerGraphics!: Phaser.GameObjects.Graphics; // For highlighting sections
    private markerText!: Phaser.GameObjects.Text; // Text for the marker
    private spacebarPrompt!: Phaser.GameObjects.Text; // "Press SPACE to continue" prompt
    private speedButton!: Phaser.GameObjects.Text;

    // Group elements by section for easy visibility toggling
    private statsElements: Phaser.GameObjects.GameObject[] = [];
    private towerElements: Phaser.GameObjects.GameObject[] = [];
    private helpElements: Phaser.GameObjects.GameObject[] = [];
    private gameSeparators: Phaser.GameObjects.Graphics[] = [];
    private hudSeparators: Phaser.GameObjects.Graphics[] = [];

    // Upgrade progress text elements
    private tower1UpgradeText!: Phaser.GameObjects.Text;
    private tower2UpgradeText!: Phaser.GameObjects.Text;
    private tower3UpgradeText!: Phaser.GameObjects.Text;

    constructor(public scene: Level) {
        super(scene);
    }

    public setup(): {
        stats: Phaser.GameObjects.GameObject[];
        towers: Phaser.GameObjects.GameObject[];
        help: Phaser.GameObjects.GameObject[];
        separators: Phaser.GameObjects.Graphics[];
        hudSeparators: Phaser.GameObjects.Graphics[];
    } {
        this.createMessageText();
        this.createSpacebarPrompt();
        this.createMarker();

        this.gameSeparators = this.setupGameVisualSeparators();
        this.hudSeparators = this.setupHudVisualSeparators();

        const hudBackground = this.createHudBackground();
        this.statsElements = [hudBackground, ...this.createMainStatsPanel()];
        this.towerElements = this.createTowerSelectionPanel();
        this.helpElements = this.createHelpPanel();

        this.update();

        return {
            stats: this.statsElements,
            towers: this.towerElements,
            help: this.helpElements,
            separators: this.gameSeparators,
            hudSeparators: this.hudSeparators,
        };
    }

    destroy(): void {
        this.gameName.destroy();
        this.levelText.destroy();
        this.baseHealthText.destroy();
        this.energyText.destroy();
        this.waveNumberText.destroy();
        this.waveProgressText.destroy();
        this.messageText.destroy();
        this.rangePreview.destroy();
        this.selectionIndicator.destroy();
        this.helpTextPanel.destroy();
        this.deselectButton.destroy();
        this.markerGraphics.destroy();
        this.markerText.destroy();
        this.spacebarPrompt.destroy();
        this.speedButton.destroy();

        this.tower1UpgradeText.destroy();
        this.tower2UpgradeText.destroy();
        this.tower3UpgradeText.destroy();

        for (const key in this.towerSelectionButtons) {
            this.towerSelectionButtons[key].button.destroy();
            this.towerSelectionButtons[key].panel.destroy();
            this.towerSelectionButtons[key].textObjects.forEach((text) => text.destroy());
        }
    }

    public enableTowerSelection(): void {
        for (const key in this.towerSelectionButtons) {
            this.towerSelectionButtons[key].button.setInteractive();
        }
        this.deselectButton.setInteractive({useHandCursor: true});
    }

    public disableTowerSelection(): void {
        for (const key in this.towerSelectionButtons) {
            this.towerSelectionButtons[key].button.disableInteractive();
        }
        this.deselectButton.disableInteractive();
    }

    public update(_time: number = 0, _delta: number = 0): void {
        this.updateMainStats();
        this.updateTowerSelectionUI();
        this.updateRangePreview();
        this.updateSelectionIndicator(this.scene.state.selectedTowerType);
        this.updateUpgradeProgress();
    }

    public persistedInfo(message: string, color: string, centre: boolean = true) {
        this.messageText.setText(message).setColor(color).setVisible(true).setDepth(200).setPosition(centre ? WIDTH / 2 : GAME_WIDTH / 2, GAME_HEIGHT / 8);
    }

    public info(message: string, color: string, callback?: () => void, autoHide: boolean = true) {
        this.messageText.setText(message).setColor(color).setVisible(true).setDepth(200).setPosition(GAME_WIDTH / 2, GAME_HEIGHT / 2);
        if (autoHide) {
            this.scene.time.delayedCall(2500, () => {
                this.messageText.setVisible(false);
                if (callback) {
                    callback();
                }
            });
        }
    }

    public hideInfo(): void {
        this.messageText.setVisible(false);
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

    // --- New methods for tutorial ---
    public showMarker(x1: number, y1: number, x2: number, y2: number, text: string): void {
        this.markerGraphics.clear();
        this.markerGraphics.lineStyle(4, phaserColor(AppColors.UI_ACCENT), 1);
        this.markerGraphics.strokeRect(x1, y1, x2 - x1, y2 - y1);
        this.markerGraphics.setVisible(true);
        this.markerText.setText(text).setPosition(x1 + (x2 - x1) / 2, y2 + 20).setVisible(true);
    }

    public hideMarker(): void {
        this.markerGraphics.setVisible(false);
        this.markerText.setVisible(false);
    }

    public showStats(visible: boolean): void {
        this.statsElements.forEach(el => (el as GameObject).setVisible(visible));
    }

    public showTowers(visible: boolean): void {
        this.towerElements.forEach(el => (el as GameObject).setVisible(visible));
    }

    public showHelp(visible: boolean): void {
        this.helpElements.forEach(el => (el as GameObject).setVisible(visible));
    }

    public hideAllElements(): void {
        this.statsElements.forEach(el => (el as GameObject).setVisible(false));
        this.towerElements.forEach(el => (el as GameObject).setVisible(false));
        this.helpElements.forEach(el => (el as GameObject).setVisible(false));
        this.gameSeparators.forEach(el => (el as Graphics).setVisible(false));
        this.hudSeparators.forEach(el => (el as Graphics).setVisible(false));
    }

    public showAllElements(): void {
        this.statsElements.forEach(el => (el as GameObject).setVisible(true));
        this.towerElements.forEach(el => (el as GameObject).setVisible(true));
        this.helpElements.forEach(el => (el as GameObject).setVisible(true));
        this.gameSeparators.forEach(el => (el as Graphics).setVisible(true));
        this.hudSeparators.forEach(el => (el as Graphics).setVisible(true));
    }

    public showSpacebarPrompt(visible: boolean): void {
        this.spacebarPrompt.setVisible(visible);
    }

    public showGameBoundary(visible: boolean) {
        this.gameSeparators.forEach(el => (el as Graphics).setVisible(visible));
    }

    public showHudBoundary(visible: boolean) {
        this.hudSeparators.forEach(el => (el as Graphics).setVisible(visible));
    }

    // --- End new methods ---

    private createHudBackground(): Phaser.GameObjects.Graphics {
        const panel = this.scene.add.graphics();
        panel.fillStyle(phaserColor(AppColors.GAME_BACKGROUND));
        panel.fillRect(GAME_WIDTH, 0, WIDTH - GAME_WIDTH, GAME_HEIGHT);
        panel.setDepth(80);
        return panel;
    }

    private createMainStatsPanel(): Phaser.GameObjects.GameObject[] {
        const hudX = GAME_WIDTH + 15;
        const panelWidth = WIDTH - GAME_WIDTH - 30;
        const panelHeight = 180;
        const startY = 10;

        const panel = this.scene.add.graphics();
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

        this.levelText = this.scene.add.text(textX, currentY, `Level: ${this.getLevelName()}`, {
            font: '20px',
            color: AppColors.UI_TEXT
        }).setDepth(100).setName('levelText');
        currentY += textSpacing;

        this.baseHealthText = this.scene.add.text(textX, currentY, `Health: ${this.scene.state.baseHealth}`, {
            font: '20px',
            color: AppColors.UI_TEXT
        }).setDepth(100).setName('baseHealthText');
        currentY += textSpacing;

        this.energyText = this.scene.add.text(textX, currentY, `Energy: ${this.scene.state.energy}`, {
            font: '20px',
            color: AppColors.UI_TEXT
        }).setDepth(100).setName('energyText');
        currentY += textSpacing;

        this.waveNumberText = this.scene.add.text(textX, currentY, `Wave: ${this.scene.waveManager.currentWave}/${this.scene.waveManager.totalWaves}`, {
            font: '20px',
            color: AppColors.UI_TEXT
        }).setDepth(100).setName('waveNumberText');
        currentY += textSpacing;

        this.waveProgressText = this.scene.add.text(textX, currentY, `Enemies: ${this.scene.waveManager.enemiesSpawnedInWave}/${this.scene.waveManager.maxEnemiesInWave}`, {
            font: '20px',
            color: AppColors.UI_TEXT
        }).setDepth(100).setName('waveProgressText');

        return [panel, this.gameName, this.levelText, this.baseHealthText, this.energyText, this.waveNumberText, this.waveProgressText];
    }

    private createTowerSelectionPanel(): Phaser.GameObjects.GameObject[] {
        const hudX = GAME_WIDTH + 15;
        const startY = 200;
        const panelWidth = WIDTH - GAME_WIDTH - 30;
        const panelHeight = 600;

        const panel = this.scene.add.graphics();
        panel.lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1);
        panel.strokeRect(hudX, startY, panelWidth, panelHeight);
        panel.setDepth(90);

        const title = this.scene.add.text(hudX + 10, startY + 10, 'BUILD TOWERS', {
            font: '28px',
            color: AppColors.UI_ACCENT
        }).setDepth(100);

        let currentTowerY = startY + 50;
        let towerIndex = 1;
        for (const towerKey in TowerConfigs) {
            const config: TowerConfigType = TowerConfigs[towerKey];
            if (towerKey === 'specialTower') {
                // we will allow special tower after a certain level only
                // and this will require collecting the quantum echoes
                continue;
            }
            let statsString = '';
            if (config.attack) {
                statsString = `DMG: ${config.attack.damage} | FR: ${(1000 / config.attack.fireRate).toFixed(2)}/s | R: ${config.range}`;
            } else if (config.slowing) {
                statsString = `Slow: ${config.slowing.slowFactor * 100}% | R: ${config.range}`;
            }
            this.createTowerButton(hudX + 15, currentTowerY, towerKey, config.energyCost, statsString, config.description.split('\n')[0].split(':')[0]);

            // Add upgrade progress text
            const upgradeText = this.scene.add.text(hudX + 200, currentTowerY + 35, '', { font: '16px', color: AppColors.UI_ACCENT }).setDepth(100);
            if (towerIndex === 1) this.tower1UpgradeText = upgradeText;
            if (towerIndex === 2) this.tower2UpgradeText = upgradeText;
            if (towerIndex === 3) this.tower3UpgradeText = upgradeText;

            currentTowerY += 100;
            towerIndex++;
        }

        this.deselectButton = this.scene.add.text(hudX + 50, currentTowerY + 25, 'CLEAR TOWER SELECTION', {
            font: '18px',
            color: AppColors.GAME_BACKGROUND,
            backgroundColor: AppColors.UI_ACCENT,
            padding: {x: 10, y: 5}
        }).setDepth(100);
        this.deselectButton.setInteractive({useHandCursor: true});
        this.deselectButton.on('pointerdown', () => {
            this.scene.state.selectedTowerType = 'none';
            this.scene.events.emit('towerSelected', 'none');
        });

        this.speedButton = this.scene.add.text(hudX + 115, currentTowerY + 75, 'Speed: 1x', {
            font: '18px',
            color: AppColors.GAME_BACKGROUND,
            backgroundColor: AppColors.UI_ACCENT,
            padding: {x: 10, y: 5}
        }).setDepth(100).setInteractive({useHandCursor: true});

        this.speedButton.on('pointerdown', () => {
            if (this.scene.gameSpeed === 1) {
                this.scene.setGameSpeed(2);
                this.speedButton.setText('Speed: 2x');
            } else {
                this.scene.setGameSpeed(1);
                this.speedButton.setText('Speed: 1x');
            }
        });


        this.selectionIndicator = this.scene.add.graphics().setDepth(101);
        this.updateSelectionIndicator('tower1');

        this.helpTextPanel = this.scene.add.text(hudX + 15, startY + panelHeight - 100, '', {
            font: '14px',
            color: AppColors.UI_TEXT,
            wordWrap: {width: panelWidth - 30}
        }).setDepth(100);

        this.rangePreview = this.scene.add.graphics().setDepth(0);

        const elements: Phaser.GameObjects.GameObject[] = [panel, title, this.selectionIndicator, this.helpTextPanel, this.tower1UpgradeText, this.tower2UpgradeText, this.tower3UpgradeText];
        for (const key in this.towerSelectionButtons) {
            elements.push(this.towerSelectionButtons[key].button, this.towerSelectionButtons[key].panel, ...this.towerSelectionButtons[key].textObjects);
        }
        return [...elements, this.deselectButton, this.speedButton];
    }

    private createTowerButton(x: number, y: number, towerKey: string, energyCost: number, stats: string, name: string) {
        const buttonWidth = WIDTH - GAME_WIDTH - 50;
        const buttonHeight = 90;

        const buttonPanel = this.scene.add.graphics();
        buttonPanel.lineStyle(0, phaserColor(AppColors.UI_SEPARATOR), 0.5);
        buttonPanel.strokeRect(x, y, buttonWidth, buttonHeight);
        buttonPanel.setDepth(95);

        const buttonImage = this.scene.add.image(x + 40, y + buttonHeight / 2, towerKey).setInteractive().setDepth(100);
        buttonImage.setScale(1.5);

        const nameText = this.scene.add.text(x + 80, y + 10, name, {
            font: '18px',
            color: AppColors.UI_TEXT
        }).setDepth(100);
        const energyText = this.scene.add.text(x + 80, y + 35, `Energy: ${energyCost}`, {
            font: '16px',
            color: AppColors.UI_TEXT
        }).setDepth(100);
        const statsText = this.scene.add.text(x + 80, y + 60, `${stats}`, {
            font: '14px',
            color: AppColors.UI_DISABLED
        }).setDepth(100);

        buttonImage.on('pointerdown', () => {
            this.scene.events.emit('towerSelected', towerKey);
            this.scene.state.selectedTowerType = towerKey;
        });
        buttonImage.on('pointerover', () => this.setHelpText(this.scene.towerManager.getTowerDescription(towerKey)));
        buttonImage.on('pointerout', () => this.setHelpText(''));

        this.towerSelectionButtons[towerKey] = {
            button: buttonImage,
            panel: buttonPanel,
            textObjects: [nameText, energyText, statsText]
        };
    }

    private createHelpPanel(): Phaser.GameObjects.GameObject[] {
        const hudX = GAME_WIDTH + 15;
        const startY = GAME_HEIGHT - 270;
        const panelWidth = WIDTH - GAME_WIDTH - 30;
        const panelHeight = 250;

        const panel = this.scene.add.graphics();
        panel.lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1);
        panel.strokeRect(hudX, startY, panelWidth, panelHeight);
        panel.setDepth(90);

        const title = this.scene.add.text(hudX + 10, startY + 10, 'HOW TO PLAY', {
            font: '24px',
            color: AppColors.UI_ACCENT
        }).setDepth(100);
        const helpText = this.scene.add.text(hudX + 10, startY + 50, '1. Click a tower icon to select it.\n2. Click on the map to place a tower.\n3. Use WASD to move your player.\n4. Press E near a damaged tower to revive it.\n5. Prevent enemies from reaching your base!', {
            font: '16px',
            color: AppColors.UI_TEXT,
            lineSpacing: 4,
            wordWrap: {width: panelWidth - 20}
        }).setDepth(100);

        return [panel, title, helpText];
    }

    private createMessageText() {
        this.messageText = this.scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '', {
            font: '32px',
            color: AppColors.UI_MESSAGE_ERROR,
            backgroundColor: AppColors.UI_MESSAGE_BACKGROUND,
            padding: {x: 30, y: 20},
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0).setVisible(false).setDepth(200).setName('messageText').setScale(0.75);
    }

    private createSpacebarPrompt(): void {
        this.spacebarPrompt = this.scene.add.text(WIDTH / 2, HEIGHT - 50, '[Press SPACE to continue]', {
            font: '16px',
            color: AppColors.UI_ACCENT,
            // @ts-ignore
            backgroundColor: phaserColor(AppColors.GAME_BACKGROUND),
            padding: {x: 10, y: 5}
        }).setOrigin(0.5).setDepth(301).setVisible(false);
    }

    private createMarker(): void {
        this.markerGraphics = this.scene.add.graphics().setDepth(300).setVisible(false);
        this.markerText = this.scene.add.text(0, 0, '', {
            font: '16px',
            color: AppColors.UI_TEXT,
            // @ts-ignore
            backgroundColor: phaserColor(AppColors.GAME_BACKGROUND),
            padding: {x: 10, y: 5}
        }).setOrigin(0.5).setDepth(300).setVisible(false);
    }

    private updateMainStats() {
        this.levelText.setText(`Level: ${this.getLevelName()}`);
        this.baseHealthText.setText(`Health: ${this.scene.state.baseHealth}`);
        this.energyText.setText(`Energy: ${this.scene.state.energy}`);
        this.waveNumberText.setText(`Wave: ${this.scene.waveManager.currentWave}/${this.scene.waveManager.totalWaves}`);
        this.waveProgressText.setText(`Enemies: ${this.scene.waveManager.enemiesSpawnedInWave}/${this.scene.waveManager.maxEnemiesInWave}`);
    }

    private updateUpgradeProgress() {
        if (this.scene.state.tower1Upgraded) {
            this.tower1UpgradeText.setText('Upgraded!');
        } else {
            this.tower1UpgradeText.setText(`${this.scene.state.tower1UpgradeProgress}/${TOWER_UPGRADE_QUANTUM_ECHO_REQUIREMENT}`);
        }

        if (this.scene.state.tower2Upgraded) {
            this.tower2UpgradeText.setText('Upgraded!');
        } else {
            this.tower2UpgradeText.setText(`${this.scene.state.tower2UpgradeProgress}/${TOWER_UPGRADE_QUANTUM_ECHO_REQUIREMENT}`);
        }

        if (this.scene.state.tower3Upgraded) {
            this.tower3UpgradeText.setText('Upgraded!');
        } else {
            this.tower3UpgradeText.setText(`${this.scene.state.tower3UpgradeProgress}/${TOWER_UPGRADE_QUANTUM_ECHO_REQUIREMENT}`);
        }
    }

    private updateTowerSelectionUI() {
        for (const key in this.towerSelectionButtons) {
            const config = TowerConfigs[key];
            const { button, panel, textObjects } = this.towerSelectionButtons[key];

            // Update texture if upgraded
            if (key === 'tower1' && this.scene.state.tower1Upgraded) {
                button.setTexture(config.upgradedTexture);
            } else if (key === 'tower2' && this.scene.state.tower2Upgraded) {
                button.setTexture(config.upgradedTexture);
            } else if (key === 'tower3' && this.scene.state.tower3Upgraded) {
                button.setTexture(config.upgradedTexture);
            }

            const energyCost = this.scene.towerManager.getTowerEnergyCost(key);
            if (this.scene.state.energy < energyCost) {
                button.setAlpha(0.5);
                panel.setAlpha(0.5);
                button.disableInteractive();
                textObjects.forEach((text) => text.setColor(AppColors.UI_DISABLED));
            } else {
                button.setAlpha(1);
                panel.setAlpha(1);
                button.setInteractive();
                textObjects.forEach((text) => text.setColor(AppColors.UI_TEXT));
            }
        }
    }

    private updateSelectionIndicator(towerKey: string) {
        this.selectionIndicator.clear();
        if (towerKey && towerKey !== 'none' && this.towerSelectionButtons[towerKey]) {
            const {button} = this.towerSelectionButtons[towerKey];
            this.selectionIndicator.lineStyle(2, 0xffffff, 1);
            this.selectionIndicator.strokeRect(button.x - 32, button.y - 32, 64, 64);
        }
    }

    private updateRangePreview() {
        this.rangePreview.clear();

        const pointer = this.scene.input.activePointer;
        const selectedTower = this.scene.state.selectedTowerType;

        if (selectedTower && selectedTower !== 'none' && pointer.x < GAME_WIDTH && pointer.y < GAME_HEIGHT) {
            const range = this.scene.towerManager.getTowerRange(selectedTower);
            const placementCheck = this.scene.towerManager.checkPlacementValidity(pointer.x, pointer.y, selectedTower);

            let previewColor: number;
            let alpha: number;

            if (placementCheck.valid) {
                const towerConfig = TowerConfigs[selectedTower];
                previewColor = towerConfig ? towerConfig.pulse.color : phaserColor(AppColors.UI_ACCENT);
                alpha = 0.1;
            } else {
                previewColor = phaserColor(AppColors.UI_DISABLED);
                alpha = 0.2;
            }

            this.rangePreview.lineStyle(2, previewColor, alpha * 2);
            this.rangePreview.fillStyle(previewColor, alpha);
            this.rangePreview.fillCircle(pointer.x, pointer.y, range);
            this.rangePreview.strokeCircle(pointer.x, pointer.y, range);
        }
    }

    private setupGameVisualSeparators(): Phaser.GameObjects.Graphics[] {
        const g1 = this.scene.add.graphics().lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1).beginPath().moveTo(WIDTH, 0).lineTo(WIDTH, GAME_HEIGHT).closePath().stroke().setScrollFactor(0).setDepth(1500);
        const g2 = this.scene.add.graphics().lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1).beginPath().moveTo(0, 0).lineTo(0, GAME_HEIGHT).closePath().stroke().setScrollFactor(0).setDepth(1500);
        const g3 = this.scene.add.graphics().lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1).beginPath().moveTo(0, 0).lineTo(WIDTH, 0).closePath().stroke().setScrollFactor(0).setDepth(1500);
        const g4 = this.scene.add.graphics().lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1).beginPath().moveTo(0, GAME_HEIGHT).lineTo(WIDTH, GAME_HEIGHT).closePath().stroke().setScrollFactor(0).setDepth(1500);
        return [g1, g2, g3, g4];
    }

    private setupHudVisualSeparators(): Phaser.GameObjects.Graphics[] {
        const g1 = this.scene.add.graphics().lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1).beginPath().moveTo(GAME_WIDTH, 0).lineTo(GAME_WIDTH, GAME_HEIGHT).closePath().stroke().setScrollFactor(0).setDepth(1500);
        const g2 = this.scene.add.graphics().lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1).beginPath().moveTo(WIDTH, 0).lineTo(WIDTH, GAME_HEIGHT).closePath().stroke().setScrollFactor(0).setDepth(1500);
        const g3 = this.scene.add.graphics().lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1).beginPath().moveTo(GAME_WIDTH, 0).lineTo(WIDTH, 0).closePath().stroke().setScrollFactor(0).setDepth(1500);
        const g4 = this.scene.add.graphics().lineStyle(2, phaserColor(AppColors.UI_SEPARATOR), 1).beginPath().moveTo(GAME_WIDTH, GAME_HEIGHT).lineTo(WIDTH, GAME_HEIGHT).closePath().stroke().setScrollFactor(0).setDepth(1500);
        return [g1, g2, g3, g4];
    }

    private getLevelName(): string {
        return this.scene.scene.key.replace('Gameplay_', '');
    }
}
