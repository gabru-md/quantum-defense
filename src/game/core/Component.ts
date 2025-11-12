import type {GameObject} from './GameObject';

/**
 * Base class for all components that can be attached to a GameObject.
 */
export abstract class Component {
    public gameObject!: GameObject;
    public enabled: boolean = true;

    /**
     * Called once when the component is added to a GameObject, after the GameObject has been added to a Scene.
     */
    public start?(): void;

    /**
     * Called every frame, if the component is enabled.
     * @param time
     * @param deltaTime The time in milliseconds since the last frame.
     */
    public update?(time?: number, deltaTime?: number): void;
}
