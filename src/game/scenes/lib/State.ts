export class State {
    public selectedTowerType: string = 'none'; // Default to none
    public difficulty: 'easy' | 'normal' | 'hard' = 'normal'; // Default difficulty
    public soundEnabled: boolean = true; // Sound enabled by default
    public musicVolume: number = 0.2;
    public sfxVolume: number = 0.3;
    public maxEnergy: number = 2000;

    constructor(
        public baseHealth: number,
        public energy: number, // Renamed: money to energy
        public level: string
    ) {}
}
