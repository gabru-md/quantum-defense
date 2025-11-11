export abstract class Manager {
    protected constructor(public scene: Phaser.Scene) {
    }

    abstract setup(): void;

    update?(time: number, delta: number): void;
}