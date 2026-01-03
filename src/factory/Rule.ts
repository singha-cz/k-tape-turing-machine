import { State } from "./State";
import { Operation } from "../types";

/**
 * Přechodové pravidlo pro 3-páskový Turingův stroj
 * Formát: (aktuální stav, čtené symboly) → (následující stav, zapisované symboly, operace)
 */
export class Rule {
  /** Aktuální stav, ve kterém se pravidlo aplikuje */
  currentState: State;

  /** Symboly čtené ze všech 3 pásek [páska1, páska2, páska3] */
  readSymbols: [string, string, string];

  /** Následující stav po aplikaci pravidla */
  nextState: State;

  /** Symboly zapisované na všechny 3 pásky [páska1, páska2, páska3] */
  writeSymbols: [string, string, string];

  /** Operace pohybu hlavy pro všechny 3 pásky [páska1, páska2, páska3] */
  operations: [Operation, Operation, Operation];

  /**
   * Vytvoří nové přechodové pravidlo pro 3-páskový Turingův stroj
   * @param currentState - Aktuální stav
   * @param readSymbols - Symboly čtené z pásek [páska1, páska2, páska3]
   * @param nextState - Následující stav
   * @param writeSymbols - Symboly zapisované na pásky [páska1, páska2, páska3]
   * @param operations - Operace pohybu hlav [páska1, páska2, páska3]
   */
  constructor(
    currentState: State,
    readSymbols: [string, string, string],
    nextState: State,
    writeSymbols: [string, string, string],
    operations: [Operation, Operation, Operation],
  ) {
    this.currentState = currentState;
    this.readSymbols = readSymbols;
    this.nextState = nextState;
    this.writeSymbols = writeSymbols;
    this.operations = operations;
  }

  /**
   * Zkontroluje, zda pravidlo odpovídá aktuální konfiguraci stroje
   * @param state - Aktuální stav stroje
   * @param symbols - Symboly čtené z pásek [páska1, páska2, páska3]
   * @returns true, pokud pravidlo lze aplikovat
   */
  matches(state: State, symbols: [string, string, string]): boolean {
    return (
      this.currentState.name === state.name &&
      this.readSymbols[0] === symbols[0] &&
      this.readSymbols[1] === symbols[1] &&
      this.readSymbols[2] === symbols[2]
    );
  }

  /** Vrátí textovou reprezentaci pravidla */
  toString(): string {
    const read = `[${this.readSymbols.join(", ")}]`;
    const write = `[${this.writeSymbols.join(", ")}]`;
    const ops = `[${this.operations.join(", ")}]`;

    return `(${this.currentState.name}, ${read}) → (${this.nextState.name}, ${write}, ${ops})`;
  }
}
