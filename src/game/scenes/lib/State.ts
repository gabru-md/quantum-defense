export class State {
    public selectedTowerType: string = 'tower1'; // Default to tower1

    constructor(public baseHealth: number, public money: number, public level: string) {
    }
}
