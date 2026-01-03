import { Operation, E } from "../types";

/**
 * Reprezentace pásky Turingova stroje
 * Páska je nekonečná v obou směrech a automaticky se rozšiřuje
 */
export class Tape {
  /** Symboly na pásce */
  symbols: string[];

  /** Pozice R/W hlavy (index v poli symbols) */
  head: number;

  /**
   * Vytvoří novou pásku s inicializačními symboly
   * @param initialSymbols - Počáteční obsah pásky (výchozí: prázdná páska s jedním blank symbolem)
   * @param headPosition - Počáteční pozice hlavy (výchozí: 0)
   */
  constructor(initialSymbols: string[] = [E], headPosition: number = 0) {
    this.symbols = [...initialSymbols];
    this.head = headPosition;
  }

  /**
   * Přečte symbol na aktuální pozici hlavy
   * @returns Symbol na pozici hlavy
   */
  read(): string {
    this._ensureCapacity();
    return this.symbols[this.head];
  }

  /**
   * Zapíše symbol na aktuální pozici hlavy
   * @param symbol - Symbol k zapsání
   */
  write(symbol: string): void {
    this._ensureCapacity();
    this.symbols[this.head] = symbol;
  }

  /**
   * Posune hlavu podle zadané operace
   * @param operation - Operace pohybu (R = doprava, L = doleva, S = zůstat)
   */
  move(operation: Operation): void {
    switch (operation) {
      case "R":
        this.head++;
        break;
      case "L":
        this.head--;
        break;
      case "S":
        // Zůstat na místě - nic nedělat
        break;
    }
    this._ensureCapacity();
  }

  /**
   * Zajistí, že páska je dostatečně velká pro aktuální pozici hlavy
   * Automaticky rozšiřuje pásku prázdnými symboly
   * @private
   */
  private _ensureCapacity(): void {
    // Rozšířit zleva, pokud je hlava před začátkem
    while (this.head < 0) {
      this.symbols.unshift(E);
      this.head++;
    }

    // Rozšířit zprava, pokud je hlava za koncem
    while (this.head >= this.symbols.length) {
      this.symbols.push(E);
    }
  }

  /**
   * Vrátí textovou reprezentaci pásky s označením pozice hlavy
   * @returns Formátovaný řetězec reprezentující pásku
   */
  toString(): string {
    const tapeStr = this.symbols.join("|");
    const headIndicator = " ".repeat(this.head * 2) + "▼";
    return headIndicator + "\n" + tapeStr;
  }
}
