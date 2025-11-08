# Nova Framework (for Phaser)

A flexible and powerful component-based framework designed to sit on top of the [Phaser 3](https://phaser.io/) game engine. Nova provides a structured, component-based architecture to help you build complex and maintainable games like top-down adventures and tower defense titles.

We leverage Phaser's robust and optimized core for rendering, physics, and input, while providing a higher-level framework for organizing your game's entities and logic.

## Core Concepts

The Nova Framework is built around a few core concepts that integrate seamlessly with Phaser's lifecycle.

### `GameObject`

The `GameObject` is the fundamental building block for all entities in your game. It is a standard `Phaser.GameObjects.Sprite` that has been extended to act as a container for `Components`.

Because it's a native Phaser object, it has a `transform` (position, rotation, scale) and can be easily added to a scene, participate in physics, and be rendered by Phaser's engine.

### `Component`

`Components` are the reusable building blocks of functionality that are attached to `GameObject`s. They define the behavior of an entity. This allows you to favor composition over inheritance, leading to a more flexible and modular design.

A `Component` is a simple class with lifecycle methods that are called automatically by its parent `GameObject`.
*   **`start()`**: Called once when the `GameObject` is created and added to a scene.
*   **`update(deltaTime)`**: Called every frame, allowing the component to perform ongoing logic.

Example components could be `PlayerController`, `EnemyAI`, `Health`, or `Inventory`.

### `Phaser.Scene`

We use standard `Phaser.Scene` classes as the container for our `GameObject`s. You use them exactly as you would in any other Phaser project, with the core `preload()`, `create()`, and `update()` methods.

## Architecture Overview

The engine's flow is driven by Phaser, with our component system layered on top.

1.  **Phaser Game Loop**: Phaser runs the main game loop.
2.  **Scene Update**: On each frame, Phaser calls the `update(time, delta)` method of the current `Phaser.Scene`.
3.  **GameObject Update**: Our `GameObject` automatically listens for the scene's update event and calls its own `update(delta)` method.
4.  **Component Update**: The `GameObject`'s `update` method then calls the `update(delta)` method on all of its attached `Component`s.

This creates a clean, hierarchical update cycle that is easy to follow and debug.

## Getting Started (Example)

Here is a conceptual example of how you might create a simple player entity within a `Phaser.Scene`:

```typescript
import { GameObject } from './core/GameObject';
import { PlayerController } from './scripts/PlayerController';

class GameScene extends Phaser.Scene {
  preload() {
    this.load.image('player', 'assets/player.png');
  }

  create() {
    // Create a new GameObject, which is a Phaser Sprite at its core
    const player = new GameObject(this, 300, 200, 'player');
    
    // Add the GameObject to the scene and enable physics
    this.add.existing(player);
    this.physics.add.existing(player);
    
    // Add a custom component to handle player logic
    player.addComponent(new PlayerController());
  }
}
```

## Future Vision

Nova Framework is designed to be a versatile tool for game creation. To guide its development and showcase its capabilities, we plan to build several example projects, including:

*   **A Tower Defense Game**: This will drive the development of features like enemy pathfinding (A*), wave management, and dynamic placement of `GameObject`s (towers).
*   **A Zelda-like Adventure Game**: This will require a more complex set of features, including an inventory system, a dialogue and quest system, and more sophisticated AI for enemies and NPCs.

By building these games, we will ensure that Nova develops into a mature and feature-rich framework suitable for a wide range of projects.
