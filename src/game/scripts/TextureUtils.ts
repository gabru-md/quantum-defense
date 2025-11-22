import * as Phaser from 'phaser';
import {AppColors, phaserColor} from './Colors';

export function createEnemyTexture(scene: Phaser.Scene, key: string, size: number, color: string): string {
    if (scene.textures.exists(key)) {
        scene.textures.remove(key);
    }
    const graphics = scene.make.graphics({x: 0, y: 0});
    graphics.fillStyle(phaserColor(color));
    if (key.includes('enemy2')) {
        // Triangle
        graphics.fillTriangle(size / 2, 0, 0, size, size, size);
    } else if (key.includes('enemy3') || key.includes('upgradedEnemy')) {
        // Hexagon
        graphics
            .slice(size / 2, size / 2, size / 2, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(360), false, 6)
            .fill();
    } else {
        // Square
        graphics.fillRect(0, 0, size, size);
    }
    graphics.generateTexture(key, size, size);
    graphics.destroy();
    return key;
}

export function createTowerTexture(scene: Phaser.Scene, key: string, size: number, color: string): string {
    if (scene.textures.exists(key)) {
        scene.textures.remove(key);
    }
    const graphics = scene.make.graphics({x: 0, y: 0});
    graphics.fillStyle(phaserColor(color));
    graphics.fillCircle(size / 2, size / 2, size / 2);
    graphics.fillStyle(phaserColor('0x000000'), 0.5); // Inner circle black
    graphics.fillCircle(size / 2, size / 2, size / 4);
    graphics.generateTexture(key, size, size);
    graphics.destroy();
    return key;
}

export function createBigTowerTexture(scene: Phaser.Scene, key: string, size: number, color: string): string {
    if (scene.textures.exists(key)) {
        scene.textures.remove(key);
    }
    const graphics = scene.make.graphics({x: 0, y: 0});
    graphics.fillStyle(phaserColor(color));
    graphics.fillCircle(size / 2, size / 2, size / 2);
    graphics.fillStyle(phaserColor('0x000000'), 0.4); // Inner circle black
    graphics.fillCircle(size / 2, size / 2, size / 3);
    graphics.fillStyle(phaserColor(color)); // Inner circle black
    graphics.fillCircle(size / 2, size / 2, size / 6);
    graphics.generateTexture(key, size, size);
    graphics.destroy();
    return key;
}

export function createBigGlitchTexture(scene: Phaser.Scene, key: string, size: number, color: string): string {
    if (scene.textures.exists(key)) {
        scene.textures.remove(key);
    }
    const graphics = scene.make.graphics({x: 0, y: 0});
    graphics.fillStyle(phaserColor(color));
    graphics.fillCircle(size / 2, size / 2, size / 2);
    graphics.fillStyle(phaserColor('0x000000'), 0.4); // Inner circle black
    graphics.fillCircle(size / 2, size / 2, size / 3);
    graphics.fillStyle(phaserColor(color)); // Inner circle black
    graphics.fillCircle(size / 2, size / 2, size / 6);
    graphics.generateTexture(key, size, size);
    graphics.destroy();
    return key;
}

export function createBulletTexture(scene: Phaser.Scene, key: string, size: number, color: string): void {
    if (scene.textures.exists(key)) {
        scene.textures.remove(key);
    }
    const graphics = scene.make.graphics({x: 0, y: 0});
    graphics.fillStyle(phaserColor(color));
    graphics.fillCircle(size / 2, size / 2, size / 2);
    graphics.generateTexture(key, size, size);
    graphics.destroy();
}

export function createBombTexture(scene: Phaser.Scene, key: string, size: number, color: string): void {
    if (scene.textures.exists(key)) {
        scene.textures.remove(key);
    }
    const graphics = scene.make.graphics({x: 0, y: 0});
    graphics.fillStyle(phaserColor(color));
    graphics.fillCircle(size / 2, size / 2, size / 2);
    graphics.generateTexture(key, size, size);
    graphics.destroy();
}

export function createPlayerTexture(scene: Phaser.Scene, key: string, size: number, color: string): string {
    if (scene.textures.exists(key)) {
        scene.textures.remove(key);
    }
    const graphics = scene.make.graphics({x: 0, y: 0});
    graphics.fillStyle(phaserColor(color));
    graphics.fillCircle(size / 2, size / 2, size / 2);
    graphics.generateTexture(key, size, size);
    graphics.destroy();
    return key;
}


export function createQuantumEchoTexture(scene: Phaser.Scene, key: string, size: number) {
    if (scene.textures.exists(key)) {
        scene.textures.remove(key);
    }
    const graphics = scene.make.graphics({x: 0, y: 0}).setAlpha(0.85);


    const numElements = Phaser.Math.Between(5, 8);
    const shapes = ['circle', 'rectangle', 'line'];
    const elementSize = size / 4;
    const placedBounds: Phaser.Geom.Rectangle[] = [];

    for (let i = 0; i < numElements; i++) {
        const shapeType = Phaser.Math.RND.pick(shapes);
        let x, y;
        let currentBounds: any;
        let attempts = 0;
        let selectedColor = Phaser.Math.RND.pick([AppColors.TOWER_LASER, AppColors.TOWER_BOMB, AppColors.TOWER_SLOW]);
        let colorNumber = phaserColor(selectedColor);
        graphics.fillStyle(colorNumber);

        do {
            x = Phaser.Math.FloatBetween(0, size - elementSize);
            y = Phaser.Math.FloatBetween(0, size - elementSize);
            currentBounds = new Phaser.Geom.Rectangle(x, y, elementSize, elementSize);
            attempts++;
        } while (
            placedBounds.some(b => Phaser.Geom.Intersects.RectangleToRectangle(b, currentBounds)) &&
            attempts < 100
            );

        if (attempts < 100) {
            placedBounds.push(currentBounds);
            switch (shapeType) {
                case 'circle':
                    graphics.fillCircle(x + elementSize / 2, y + elementSize / 2, elementSize / 2);
                    break;
                case 'rectangle':
                    graphics.fillRect(x, y, elementSize, elementSize);
                    break;
                case 'line':
                    graphics.lineStyle(2, phaserColor(selectedColor), 1);
                    graphics.lineBetween(x, y, x + elementSize, y + elementSize);
                    break;
            }
        }
    }

    graphics.generateTexture(key, size, size);
    graphics.destroy();
}

export function createSpecialEnemyTexture(scene: Phaser.Scene, key: string, size: number, color: string): void {
    if (scene.textures.exists(key)) {
        scene.textures.remove(key);
    }
    const graphics = scene.make.graphics({x: 0, y: 0});
    graphics.fillStyle(phaserColor(color));
    graphics.fillCircle(size / 2, size / 2, size / 2);
    graphics.generateTexture(key, size, size);
    graphics.destroy();
}

export function createRangePreviewTexture(scene: Phaser.Scene, key: string, size: number, color: string): void {
    if (scene.textures.exists(key)) {
        scene.textures.remove(key);
    }
    const graphics = scene.make.graphics({x: 0, y: 0});
    graphics.fillStyle(phaserColor(color));
    graphics.fillCircle(size / 2, size / 2, size / 2);
    graphics.generateTexture(key, size, size);
    graphics.destroy();
}

export function createPlaceholderTexture(
    scene: Phaser.Scene,
    key: string,
    width: number,
    height: number,
    color: string
): void {
    if (scene.textures.exists(key)) {
        scene.textures.remove(key);
    }
    const graphics = scene.make.graphics({x: width, y: height});
    graphics.fillStyle(phaserColor(color));
    graphics.fillRect(0, 0, width, height);
    graphics.generateTexture(key, width, height);
    graphics.destroy();
}
