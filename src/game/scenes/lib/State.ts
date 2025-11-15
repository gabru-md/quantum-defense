export class State {
    public selectedTowerType: string = 'tower1'; // Default to tower1
    public difficulty: 'easy' | 'normal' | 'hard' = 'normal'; // Default difficulty
    public soundEnabled: boolean = true; // Sound enabled by default
    public isTutorialActive: boolean = false; // New property to control tutorial state

    constructor(
        public baseHealth: number,
        public energy: number, // Renamed: money to energy
        public level: string
    ) {}
}
