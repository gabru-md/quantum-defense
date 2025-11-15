import { Component } from '../core/Component';

/**
 * A component that gives a GameObject health and the ability to take damage.
 */
export class Health extends Component {
    _currentHealth: number;
    readonly _maxHealth: number;

    constructor(maxHealth: number) {
        super();
        this._maxHealth = maxHealth;
        this._currentHealth = maxHealth;
    }

    public get currentHealth(): number {
        return this._currentHealth;
    }

    public get maxHealth(): number {
        return this._maxHealth;
    }

    public isDead(): boolean {
        return this._currentHealth <= 0;
    }

    /**
     * Reduces the current health by the given amount.
     * If health drops to 0 or below, it emits a 'died' event from the GameObject.
     * @param amount The amount of damage to take.
     */
    public takeDamage(amount: number): void {
        if (this.isDead()) {
            console.log(`[Health] ${this.gameObject.texture.key} is already dead. No more damage.`);
            return;
        }

        const healthBefore = this._currentHealth;
        this._currentHealth -= amount;
        console.log(`[Health] ${this.gameObject.texture.key} took ${amount} damage. Health: ${healthBefore} -> ${this._currentHealth}`);

        this.gameObject.emit('healthChanged', this._currentHealth);
        if (this.isDead()) {
            this._currentHealth = 0;
            console.log(`[Health] ${this.gameObject.texture.key} died.`);
            this.gameObject.emit('died');
        }
    }
}
