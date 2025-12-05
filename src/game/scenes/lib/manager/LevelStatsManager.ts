import {Manager} from "../Manager.ts";
import {Level} from "../Level.ts";

export class LevelStatsManager extends Manager {

    pulseTowerPlaced: number = 0;
    bombTowerPlaced: number = 0;
    slowTowerPlaced: number = 0;

    enemiesEliminated: number = 0;
    phantomsEliminated: number = 0;

    towersDeactivated: number = 0;
    towersRevived: number = 0;
    resonanceWaveUsed: number = 0;
    quantumEchoesCollected: number = 0;
    energySpent: number = 0;

    constructor(protected level: Level) {
        super(level);
    }

    public setup() {
        this.pulseTowerPlaced = 0;
        this.bombTowerPlaced = 0;
        this.slowTowerPlaced = 0;

        this.enemiesEliminated = 0;
        this.phantomsEliminated = 0;

        this.towersDeactivated = 0;
        this.towersRevived = 0;
        this.resonanceWaveUsed = 0;
        this.quantumEchoesCollected = 0;
        this.energySpent = 0;
    }

    public destroy() {
        // no-op
        this.pulseTowerPlaced = 0;
        this.bombTowerPlaced = 0;
        this.slowTowerPlaced = 0;

        this.enemiesEliminated = 0;
        this.phantomsEliminated = 0;

        this.towersDeactivated = 0;
        this.towersRevived = 0;
        this.resonanceWaveUsed = 0;
        this.quantumEchoesCollected = 0;
        this.energySpent = 0;
    }
}