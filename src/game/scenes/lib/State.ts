export class State {
    public selectedTowerType: string = 'none'; // Default to none
    public difficulty: 'easy' | 'normal' | 'hard' = 'normal'; // Default difficulty
    public soundEnabled: boolean = true; // Sound enabled by default
    public musicVolume: number = 1;
    public sfxVolume: number = 1;

    // Tower Upgrade State
    public tower1UpgradeProgress: number = 0;
    public tower2UpgradeProgress: number = 0;
    public tower3UpgradeProgress: number = 0;
    public tower1Upgraded: boolean = false;
    public tower2Upgraded: boolean = false;
    public tower3Upgraded: boolean = false;

    constructor(
        public baseHealth: number,
        public energy: number, // Renamed: money to energy
        public level: string
    ) {}
}
