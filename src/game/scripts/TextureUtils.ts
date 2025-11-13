import * as Phaser from 'phaser';
import { phaserColor } from './Colors';

export function createEnemyTexture(scene: Phaser.Scene, key: string, size: number, color: string): string {
    if (scene.textures.exists(key)) {
        scene.textures.remove(key);
    }
    const graphics = scene.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(phaserColor(color));
    if (key.includes('enemy2')) {
        // Triangle
        graphics.fillTriangle(size / 2, 0, 0, size, size, size);
    } else if (key.includes('enemy3')) {
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
    const graphics = scene.make.graphics({ x: 0, y: 0 });
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
    const graphics = scene.make.graphics({ x: 0, y: 0 });
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
    const graphics = scene.make.graphics({ x: 0, y: 0 });
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
    const graphics = scene.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(phaserColor(color));
    graphics.fillCircle(size / 2, size / 2, size / 2);
    graphics.generateTexture(key, size, size);
    graphics.destroy();
}

export function createBombTexture(scene: Phaser.Scene, key: string, size: number, color: string): void {
    if (scene.textures.exists(key)) {
        scene.textures.remove(key);
    }
    const graphics = scene.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(phaserColor(color));
    graphics.fillCircle(size / 2, size / 2, size / 2);
    graphics.generateTexture(key, size, size);
    graphics.destroy();
}

export function createPlayerTexture(scene: Phaser.Scene, key: string, size: number, color: string): string {
    if (scene.textures.exists(key)) {
        scene.textures.remove(key);
    }
    const graphics = scene.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(phaserColor(color));
    graphics.fillCircle(size / 2, size / 2, size / 2);
    graphics.generateTexture(key, size, size);
    graphics.destroy();
    return key;
}

export function createSpecialEnemyTexture(scene: Phaser.Scene, key: string, size: number, color: string): void {
    if (scene.textures.exists(key)) {
        scene.textures.remove(key);
    }
    const graphics = scene.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(phaserColor(color));
    graphics.fillCircle(size / 2, size / 2, size / 2);
    graphics.generateTexture(key, size, size);
    graphics.destroy();
}

export function createRangePreviewTexture(scene: Phaser.Scene, key: string, size: number, color: string): void {
    if (scene.textures.exists(key)) {
        scene.textures.remove(key);
    }
    const graphics = scene.make.graphics({ x: 0, y: 0 });
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
    const graphics = scene.make.graphics({ x: width, y: height });
    graphics.fillStyle(phaserColor(color));
    graphics.fillRect(0, 0, width, height);
    graphics.generateTexture(key, width, height);
    graphics.destroy();
}
