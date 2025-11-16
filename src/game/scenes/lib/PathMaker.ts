import * as Phaser from 'phaser';

export class PathMaker {
    private points: Phaser.Math.Vector2[] = [];
    private currentX: number;
    private currentY: number;
    private debug: boolean;
    private debugTextObjects: Phaser.GameObjects.Text[] = [];
    private reversePath: boolean = false;

    constructor(startX: number, startY: number, debug: boolean = true) {
        this.currentX = startX;
        this.currentY = startY;
        this.debug = debug;
        this.points.push(new Phaser.Math.Vector2(startX, startY));
        this.debugTextObjects = []
    }

    /**
     * Moves the path segment upwards by the given distance.
     * @param distance The distance to move upwards.
     * @returns The PathMaker instance for chaining.
     */
    up(distance: number): PathMaker {
        this.currentY -= distance;
        this.points.push(new Phaser.Math.Vector2(this.currentX, this.currentY));
        return this;
    }

    /**
     * Moves the path segment downwards by the given distance.
     * @param distance The distance to move downwards.
     * @returns The PathMaker instance for chaining.
     */
    down(distance: number): PathMaker {
        this.currentY += distance;
        this.points.push(new Phaser.Math.Vector2(this.currentX, this.currentY));
        return this;
    }

    /**
     * Moves the path segment to the left by the given distance.
     * @param distance The distance to move to the left.
     * @returns The PathMaker instance for chaining.
     */
    left(distance: number): PathMaker {
        this.currentX -= distance;
        this.points.push(new Phaser.Math.Vector2(this.currentX, this.currentY));
        return this;
    }

    /**
     * Moves the path segment to the right by the given distance.
     * @param distance The distance to move to the right.
     * @returns The PathMaker instance for chaining.
     */
    right(distance: number): PathMaker {
        this.currentX += distance;
        this.points.push(new Phaser.Math.Vector2(this.currentX, this.currentY));
        return this;
    }

    to(x: number, y: number): PathMaker {
        this.currentX = x;
        this.currentY = y;
        this.points.push(new Phaser.Math.Vector2(this.currentX, this.currentY));
        return this;
    }

    reverse(): PathMaker {
        this.reversePath = true;
        return this;
    }

    /**
     * Creates and returns a Phaser.Curves.Path object from the accumulated points.
     * @returns A Phaser.Curves.Path object.
     */
    create(scene: Phaser.Scene): Phaser.Curves.Path {
        if (this.points.length < 2) {
            throw new Error("PathMaker requires at least two points to create a path.");
        }

        if (this.reversePath) {
            this.points.reverse();
        }

        const path = new Phaser.Curves.Path(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            path.lineTo(this.points[i].x, this.points[i].y);
        }

        if (this.debug) {
            this.drawDebugInfo(scene);
        }

        return path;
    }

    private drawDebugInfo(scene: Phaser.Scene): void {
        this.points.forEach((point, _index) => {
            const text = scene.add.text(point.x + 5, point.y + 5, `(${point.x}, ${point.y})`, {
                font: '10px monospace',
                color: '#00ff00',
                backgroundColor: '#00000080'
            }).setOrigin(0, 0).setDepth(1000);
            this.debugTextObjects.push(text);
        });
    }

    /**
     * Destroys all debug text objects created by this PathMaker instance.
     */
    destroyDebugInfo(): void {
        this.debugTextObjects.forEach(text => text.destroy());
        this.debugTextObjects = [];
    }
}
