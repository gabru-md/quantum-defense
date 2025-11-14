import {Level} from '../lib/Level.ts';
import {AppColors, phaserColor} from '../../scripts/Colors.ts';
import {GAME_HEIGHT, GAME_WIDTH, HEIGHT, WIDTH} from '../../scripts/Util.ts';
import {getStoryName, LevelNames} from '../lib/LevelNames.ts';
import Phaser from 'phaser';

type TutorialStep = {
    text: string;
    action?: () => void;
    markerConfig?: { x1: number; y1: number; x2: number; y2: number; text: string };
    isHudInfo?: boolean;
    waitForSpacePress: boolean;
};

export class Tutorial extends Level {
    private tutorialText!: Phaser.GameObjects.Text;
    private marker!: Phaser.GameObjects.Container;
    private spacebarText!: Phaser.GameObjects.Text;
    private hudElements!: {
        stats: Phaser.GameObjects.GameObject[];
        towers: Phaser.GameObjects.GameObject[];
        help: Phaser.GameObjects.GameObject[];
        separators: Phaser.GameObjects.Graphics[];
        hudSeparators: Phaser.GameObjects.Graphics[];
    };
    private pathElements!: {
        path: Phaser.GameObjects.Graphics[];
        start: Phaser.GameObjects.Graphics[];
        end: Phaser.GameObjects.Graphics[];
    };

    constructor() {
        super(LevelNames.Introduction);
    }

    nextScene(): string {
        return getStoryName(LevelNames.HelloGenie);
    }

    definePaths(): { [key: string]: Phaser.Curves.Path } {
        const path = new Phaser.Curves.Path(50, GAME_HEIGHT / 2);
        path.lineTo(GAME_WIDTH - 50, GAME_HEIGHT / 2);
        return {path1: path};
    }

    getWaveConfig(wave: number) {
        switch (wave) {
            case 1:
                return [{
                    type: 'enemy',
                    texture: 'enemy1',
                    count: 5,
                    delay: 1000,
                    health: 50,
                    speed: 50,
                    moneyValue: 10,
                    path: 'path1'
                }];
            case 2:
                return [{
                    type: 'enemy',
                    texture: 'enemy2',
                    count: 5,
                    delay: 800,
                    health: 40,
                    speed: 80,
                    moneyValue: 15,
                    path: 'path1'
                }];
            case 3:
                return [{
                    type: 'enemy',
                    texture: 'enemy3',
                    count: 3,
                    delay: 1500,
                    health: 200,
                    speed: 40,
                    moneyValue: 25,
                    path: 'path1'
                }];
            case 4:
                return [{
                    type: 'specialEnemy',
                    texture: 'specialEnemy',
                    count: 1,
                    delay: 1000,
                    health: 50,
                    speed: 60,
                    moneyValue: 100,
                    path: 'path1'
                }];
            case 5:
                return [
                    {
                        type: 'enemy',
                        texture: 'enemy1',
                        count: 5,
                        delay: 1000,
                        health: 50,
                        speed: 50,
                        moneyValue: 10,
                        path: 'path1'
                    },
                    {
                        type: 'enemy',
                        texture: 'enemy2',
                        count: 3,
                        delay: 1200,
                        health: 40,
                        speed: 80,
                        moneyValue: 15,
                        path: 'path1'
                    }
                ];
            default:
                return [];
        }
    }

    public create(): void {
        this.physics.world.setBounds(0, 0, WIDTH, HEIGHT);

        this.hudElements = this.hud.setup();
        this.pathElements = this.pathsManager.setup();
        this.playerManager.setup();
        this.towerManager.setup();
        this.waveManager.setup();
        this.collisionManager.setup();

        this.hideAllElements();
        this.createTutorialUI();
        this.runTutorialFlow().then(() => console.log("Tutorial Completed!"));

        // @ts-ignore
        this.input.keyboard.on('keydown-ESC', () => {
            this.easeOutAndStartNextScene('MenuScene');
        });

        this.events.on('shutdown', this.shutdown, this);
    }

    private hideAllElements(): void {
        // @ts-ignore
        Object.values(this.hudElements).flat().forEach(el => el.setVisible(false));
        Object.values(this.pathElements).flat().forEach(el => el.setVisible(false));
        this.playerManager.player.setVisible(false);
    }

    private createTutorialUI(): void {
        const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            font: '24px',
            color: AppColors.UI_TEXT,
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: {x: 20, y: 10},
            align: 'center',
            wordWrap: {width: WIDTH / 2},
        };
        this.tutorialText = this.add.text(WIDTH / 2, HEIGHT - 150, '', textStyle).setOrigin(0.5).setDepth(300).setVisible(false);

        const markerGraphic = this.add.graphics();
        const markerText = this.add.text(0, 0, '', {
            font: '16px',
            color: AppColors.UI_TEXT,
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: {x: 10, y: 5}
        }).setOrigin(0.5);
        this.marker = this.add.container(0, 0, [markerGraphic, markerText]).setDepth(300).setVisible(false);

        this.spacebarText = this.add.text(WIDTH / 2, HEIGHT - 50, '[Press SPACE to continue]', {
            font: '16px',
            color: AppColors.UI_ACCENT,
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: {x: 10, y: 5}
        }).setOrigin(0.5).setDepth(301).setVisible(false);
    }

    private async runTutorialFlow(): Promise<void> {
        const hudX = GAME_WIDTH + 15;
        const hudPanelWidth = WIDTH - GAME_WIDTH - 30;

        this.hudElements.separators.forEach(sep => sep.setVisible(true)); // Show game boundaries
        await this.showStep({
            text: "Welcome to the battlefield observer",
            waitForSpacePress: true
        });
        this.hudElements.hudSeparators.forEach(sep => sep.setVisible(true));
        await this.showStep({
            text: "On the right is the Genie Powered HUD",
            markerConfig: {x1: GAME_WIDTH, y1: 0, x2: WIDTH, y2: GAME_HEIGHT, text: "HUD"},
            waitForSpacePress: true
        });
        // @ts-ignore
        this.hudElements.stats.forEach(el => el.setVisible(true));
        await this.showStep({
            text: "This is where you can see your stats like\nLevel, Health, Money and Wave Progress",
            markerConfig: {x1: hudX + 5, y1: 10, x2: hudX + hudPanelWidth - 5, y2: 190, text: "Your Stats"},
            waitForSpacePress: true
        });
        await this.showStep({
            text: "This is your current level.\nAs you progress, the glitches get stronger.",
            markerConfig: {x1: hudX + 5, y1: 58, x2: hudX + hudPanelWidth - 5, y2: 83, text: "Level"},
            waitForSpacePress: true
        });

        await this.showStep({
            text: "This is your Nexus's health. If it reaches zero, the game is over.",
            markerConfig: {x1: hudX + 5, y1: 83, x2: hudX + hudPanelWidth - 5, y2: 108, text: "Health"},
            waitForSpacePress: true
        });

        await this.showStep({
            text: "Gain money by killing Glitches.\nUse it to build and repair towers.\nCareful: Resonance Wave also costs money!",
            markerConfig: {x1: hudX + 5, y1: 108, x2: hudX + hudPanelWidth - 5, y2: 133, text: "Money"},
            waitForSpacePress: true
        });

        await this.showStep({
            text: "This shows the current wave of glitches.\nPrepare for each wave!",
            markerConfig: {x1: hudX + 5, y1: 133, x2: hudX + hudPanelWidth - 5, y2: 158, text: "Wave"},
            waitForSpacePress: true
        });

        // Step 2: Show tower arsenal panel and all dividers
        // @ts-ignore
        this.hudElements.towers.forEach(el => el.setVisible(true));
        await this.showStep({
            text: "Let's look at you tower arsenal",
            markerConfig: {x1: hudX, y1: 200, x2: hudX + hudPanelWidth, y2: 800, text: "Tower Arsenal"},
            waitForSpacePress: true
        });

        // Steps 3, 4, 5: Reveal towers
        await this.showStep({
            text: "Laser tower shoots particles emitted by a Laser beam\nThey travel in a straight line.",
            markerConfig: {x1: hudX + 15, y1: 250, x2: hudX + hudPanelWidth - 15, y2: 340, text: "Laser Tower"},
            waitForSpacePress: true
        });
        await this.showStep({
            text: "Bomb tower charges the laser and shoots out a particle explosion",
            markerConfig: {x1: hudX + 15, y1: 350, x2: hudX + hudPanelWidth - 15, y2: 440, text: "Bomb Tower"},
            waitForSpacePress: true
        });
        await this.showStep({
            text: "Continuous wave emission tower which slows the Glitches down.",
            markerConfig: {x1: hudX + 15, y1: 450, x2: hudX + hudPanelWidth - 15, y2: 540, text: "Slow Tower"},
            waitForSpacePress: true
        });

        await this.showStep({
            text: "If you wish to deselect a tower, you can click on this button.",
            markerConfig: {x1: hudX + 40, y1: 560, x2: hudX + hudPanelWidth - 80, y2: 615, text: "Deselect"},
            waitForSpacePress: true
        });

        // Step 6: Show help text
        // @ts-ignore
        this.hudElements.help.forEach(el => el.setVisible(true));
        await this.showStep({
            text: "Also some help text so you dont forget!",
            markerConfig: {
                x1: hudX,
                y1: GAME_HEIGHT - 270,
                x2: hudX + hudPanelWidth,
                y2: GAME_HEIGHT - 20,
                text: "Help"
            },
            waitForSpacePress: true
        });

        // Step 7: Show player
        this.playerManager.player.setVisible(true);
        await this.showStep({
            text: "This is you, Guardian!", isHudInfo: true,
            waitForSpacePress: true
        });

        // Step 8: Interactive steps
        await this.showStep({
            text: "Press WASD to move", isHudInfo: true,
            waitForSpacePress: false
        });
        await this.waitForEvent('playerMoved');

        this.pathElements.start.forEach(p => p.setVisible(true));
        await this.showStep({
            text: "This is Static's Den\nIt spawns the Glitches",
            markerConfig: {
                x1: 5,
                y1: GAME_HEIGHT / 2 - 48,
                x2: 95,
                y2: GAME_HEIGHT / 2 + 48,
                text: "Den"
            },
            waitForSpacePress: true
        });
        this.pathElements.end.forEach(p => p.setVisible(true));
        await this.showStep({
            text: "This is the Nexus\nProtect it at all costs!",
            markerConfig: {
                x1: GAME_WIDTH - 95,
                y1: GAME_HEIGHT / 2 - 48,
                x2: GAME_WIDTH - 5,
                y2: GAME_HEIGHT / 2 + 48,
                text: "Nexus"
            },
            waitForSpacePress: true
        });
        this.pathElements.path.forEach(p => p.setVisible(true));
        await this.showStep({
            text: "Select the Laser Tower from Tower Menu", isHudInfo: true,
            waitForSpacePress: false
        });
        await this.waitForEvent('towerSelected');
        await this.showStep({
            text: "Place the tower close to the den before the first wave comes", isHudInfo: true,
            waitForSpacePress: false
        });
        await this.waitForEvent('towerPlaced');

        await this.showStep({
            text: "Here comes the most basic of Static's Glitches: Square Glitch", isHudInfo: true,
            waitForSpacePress: true
        });
        this.waveManager.startWave(1);
        await this.waitForEvent('waveCompleted');

        await this.showStep({
            text: "Place another tower for the fast: Triangle Glitch", isHudInfo: true,
            waitForSpacePress: false
        });
        await this.waitForEvent('towerPlaced');
        this.waveManager.startWave(2);
        await this.waitForEvent('waveCompleted');

        await this.showStep({
            text: "The almost wave like: Circle Glitch",
            isHudInfo: true,
            waitForSpacePress: false
        });
        await this.waitForEvent('towerPlaced');
        this.waveManager.startWave(3);
        await this.waitForEvent('waveCompleted');

        await this.showStep({
            text: "Building Towers requires money.\nMoney can be earned by eliminating the Glitches.",
            isHudInfo: true,
            waitForSpacePress: true
        });
        await this.showStep({
            text: "Glitches deal damage to the Nexus\nIf nexus loses all health, the game is over",
            isHudInfo: true,
            waitForSpacePress: true
        });

        await this.showStep({
            text: "Now meet The Phantom!", isHudInfo: true,
            waitForSpacePress: true
        });
        await this.showStep({
            text: "It sends out a pulse which deactivates nearby towers.",
            isHudInfo: true,
            waitForSpacePress: true
        });
        await this.showStep({
            text: "No tower can kill the Wave Phantom!",
            isHudInfo: true,
            waitForSpacePress: true
        });

        this.waveManager.startWave(4);
        await this.waitForEvent('towerDeactivated');

        this.waveManager.pause();
        // this.physics.pause(); // Pausing physics prevents player movement
        await this.showStep({
            text: "Looks like your tower is down!", isHudInfo: true,
            waitForSpacePress: true
        });
        await this.showStep({
            text: "Go near it and press E to revive it!", isHudInfo: true,
            waitForSpacePress: false
        });
        await this.waitForEvent('towerRevived');

        this.waveManager.resume();
        // this.physics.resume();
        await this.showStep({
            text: "Even a single Phantom can interfere with the Nexus\nKill them, before they reach the Nexus!",
            isHudInfo: true,
            waitForSpacePress: true
        });
        await this.waitForEvent('waveCompleted');

        await this.showStep({
            text: "Towers can deactivate if they take damage\nA tower can take damage from another tower\nRevive them with Resonance Wave (E)",
            isHudInfo: true,
            waitForSpacePress: true
        });
        await this.showStep({
            text: "Remember, your Resonance Wave (E) has a cooldown and also costs money so be careful with it.",
            isHudInfo: true,
            waitForSpacePress: true
        });

        await this.showStep({
            text: "Clear this wave to finish Tutorial", isHudInfo: true,
            waitForSpacePress: true
        });
        this.waveManager.startWave(5);
        await this.waitForEvent('waveCompleted');

        this.spacebarText.setVisible(false);
        this.hud.info('Tutorial Complete!', AppColors.UI_MESSAGE_SUCCESS);
        this.time.delayedCall(2000, () => {
            this.easeOutAndStartNextScene(this.nextScene());
        });
    }

    private async showStep(step: TutorialStep): Promise<void> {
        this.spacebarText.setVisible(false);
        const markerGraphic = this.marker.list[0] as Phaser.GameObjects.Graphics;
        const markerText = this.marker.list[1] as Phaser.GameObjects.Text;

        markerGraphic.clear();
        this.marker.setVisible(false);
        this.tutorialText.setVisible(false);
        this.hud.hideInfo();

        if (step.markerConfig) {
            const {x1, y1, x2, y2, text} = step.markerConfig;
            const width = x2 - x1;
            const height = y2 - y1;

            markerGraphic.lineStyle(2, phaserColor(AppColors.UI_ACCENT), 0.8).strokeRect(0, 0, width, height);
            markerGraphic.fillStyle(phaserColor(AppColors.UI_ACCENT), 0.1).fillRect(0, 0, width, height);

            this.marker.setPosition(x1, y1);
            markerText.setText(text).setPosition(width / 2, height + 30);
            this.marker.setVisible(true);
        }

        if (step.isHudInfo) {
            this.hud.info(step.text, AppColors.UI_MESSAGE_INFO, undefined, false);
        } else {
            this.tutorialText.setText(step.text).setVisible(true);
        }
        if (step.waitForSpacePress) {
            this.spacebarText.setVisible(true);
            await this.waitForSpacePress();
        }
        this.spacebarText.setVisible(false);
    }

    private waitForSpacePress(): Promise<void> {
        return new Promise(resolve => {
            // @ts-ignore
            this.input.keyboard.once('keydown-SPACE', resolve);
        });
    }

    private waitForEvent(eventName: string): Promise<void> {
        return new Promise(resolve => {
            this.events.once(eventName, resolve);
        });
    }

    public update(): void {
    }
}
