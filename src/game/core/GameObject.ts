import * as Phaser from 'phaser';
import { Component } from './Component';
import { Level } from '../scenes/lib/Level.ts';

/**
 * An extended Phaser GameObject that supports a component-based architecture.
 * All game entities (enemies, towers, bullets) should extend this class.
 */
export class GameObject extends Phaser.GameObjects.Sprite {
    private static nextId: number = 0; // Static counter for unique IDs
    public readonly id: number; // Unique identifier for this GameObject instance
    components: Component[] = [];

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);
        this.name = this.constructor.name; // Set the name to the class name
        this.id = GameObject.nextId++; // Assign and increment the unique ID

        // Automatically call the update method of this GameObject from the scene's update loop.
        this.scene.events.on('update', (time: number, delta: number) => {
            this.update(time, delta);
        });
    }

    /**
     * Adds a component to the GameObject and calls its start method if the GameObject is already in a scene.
     * @param component The component to add.
     */
    public addComponent(component: Component): void {
        this.components.push(component);
        component.gameObject = this;

        if (this.scene) {
            component.start?.();
        }
    }


    public addComponentOverriding(component: Component): void {
        const existingComponent = this.components.find((c) => c instanceof component.constructor);
        if (existingComponent) {
            this.deleteComponent(existingComponent);
        }
        this.addComponent(component);
    }

    /**
     * Gets a component of the specified type from the GameObject.
     * @param type The type of the component to retrieve.
     * @returns The component if found, otherwise undefined.
     */
    public getComponent<T extends Component>(type: new (...args: any[]) => T): T | undefined {
        return this.components.find((c) => c instanceof type) as T;
    }

    /**
     * Deletes a component from the GameObject.
     * @param component The component to delete.
     */
    public deleteComponent(component: Component): void {
        const index = this.components.indexOf(component);
        if (index !== -1) {
            this.components.splice(index, 1);
        }
    }

    /**
     * The update method is called every frame by the Scene's update event.
     * It calls the update method on all of its attached components.
     * @param _time The current time.
     * @param delta The delta time in ms since the last frame.
     */
    public update(time: number, delta: number): void {
        for (const component of this.components) {
            if (component.enabled) {
                try {
                    component.update?.(time, delta);
                } catch (e) {
                    // console.error(e);
                }
            }
        }
    }

    get level(): Level {
        return this.scene as Level;
    }

    setVisible(value: boolean): this {
        return super.setVisible(value);
    }
}
