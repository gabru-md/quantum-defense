import * as Phaser from 'phaser';
import { Component } from './Component';

/**
 * An extended Phaser GameObject that supports a component-based architecture.
 * All game entities (enemies, towers, bullets) should extend this class.
 */
export class GameObject extends Phaser.GameObjects.Sprite {
  private components: Component[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

    // Automatically call the update method of this GameObject from the scene's update loop.
    // This ensures components attached to this GameObject also get updated.
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

  /**
   * Gets a component of the specified type from the GameObject.
   * @param type The type of the component to retrieve.
   * @returns The component if found, otherwise undefined.
   */
  public getComponent<T extends Component>(type: new (...args: any[]) => T): T | undefined {
    return this.components.find(c => c instanceof type) as T;
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
  public update(_time: number, delta: number): void {
    for (const component of this.components) {
      component.update?.(delta);
    }
  }
}
