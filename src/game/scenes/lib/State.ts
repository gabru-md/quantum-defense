export class State {
    public selectedTowerType: string = 'none'; // Default to none
    public difficulty: 'easy' | 'normal' | 'hard' = 'normal'; // Default difficulty
    public soundEnabled: boolean = true; // Sound enabled by default
    public musicVolume: number = 1;
    public sfxVolume: number = 1;

    constructor(
        public baseHealth: number,
        public energy: number, // Renamed: money to energy
        public level: string
    ) {}
}
