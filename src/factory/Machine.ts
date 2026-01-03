import { State } from "./State";
import { Tape } from "./Tape";
import { Rule } from "./Rule";
import { E } from "../types";

/**
 * Historie jednoho kroku simulace
 */
export interface StepHistory {
  stepNumber: number;
  currentState: string;
  tapes: string[][];
  heads: number[];
  appliedRule?: string;
}

/**
 * Data aktuálního kroku simulace pro callback
 */
export interface StepData {
  stepNumber: number;
  currentState: string;
  tapes: string[][];
  heads: number[];
  appliedRule?: string;
  isEnd: boolean;
}

/**
 * 3-páskový deterministický Turingův stroj
 */
export class Machine {
  /** Pole tří pásek [páska1, páska2, páska3] */
  tapes: [Tape, Tape, Tape];

  /** Pole všech přechodových pravidel */
  rules: Rule[];

  /** Aktuální stav stroje */
  currentState: State;

  /** Pole všech stavů stroje */
  states: State[];

  /** Počítadlo kroků */
  private stepCount: number;

  /** Původní obsah vstupní pásky pro reset */
  private initialInputTape: string[];

  /**
   * Vytvoří nový 3-páskový Turingův stroj
   * @param states - Pole všech stavů stroje
   * @param rules - Pole přechodových pravidel
   * @param inputTape - Inicializační obsah vstupní pásky (páska 1)
   */
  constructor(states: State[], rules: Rule[], inputTape: string[] = [E]) {
    this.states = states;
    this.rules = rules;
    this.stepCount = 0;
    this.initialInputTape = [...inputTape];

    // Najít počáteční stav
    const startState = states.find((s) => s.start);
    if (!startState) {
      throw new Error(
        "Žádný počáteční stav nenalezen! Musí existovat stav s start=true",
      );
    }
    this.currentState = startState;

    // Inicializovat pásky
    // Páska 1: vstupní s poskytnutými daty
    const tape1 = new Tape(inputTape);

    // Najít první neprázdný symbol na vstupní pásce
    const firstNonBlankIndex = inputTape.findIndex((s) => s !== E);
    if (firstNonBlankIndex !== -1) {
      tape1.head = firstNonBlankIndex;
    }

    // Pásky 2-3
    const tape2 = new Tape([E]);
    const tape3 = new Tape([E]);

    this.tapes = [tape1, tape2, tape3];

    // Validovat pravidla
    this.validateRules();

    // Zaznamenat počáteční stav
    // this._recordStep();
  }

  /**
   * Resetuje stroj do počátečního stavu
   */
  reset(): void {
    // Najít počáteční stav
    const startState = this.states.find((s) => s.start);
    if (!startState) {
      throw new Error(
        "Žádný počáteční stav nenalezen! Musí existovat stav s start=true",
      );
    }
    this.currentState = startState;

    // Resetovat pásku 1 s původními daty
    const tape1 = new Tape([...this.initialInputTape]);
    const firstNonBlankIndex = this.initialInputTape.findIndex((s) => s !== E);
    if (firstNonBlankIndex !== -1) {
      tape1.head = firstNonBlankIndex;
    }

    // Resetovat pásky 2-3 (prázdné)
    const tape2 = new Tape([E]);
    const tape3 = new Tape([E]);

    this.tapes = [tape1, tape2, tape3];

    this.stepCount = 0;
  }

  /**
   * Validuje, že pravidla jsou deterministická
   * @throws Error pokud existuje více pravidel pro stejnou konfiguraci
   */
  validateRules(): void {
    const ruleMap = new Map<string, Rule>();

    for (const rule of this.rules) {
      const key = `${rule.currentState.name}:[${rule.readSymbols.join(",")}]`;

      if (ruleMap.has(key)) {
        const existingRule = ruleMap.get(key)!;
        throw new Error(
          `Nedeterministická pravidla! Existuje více pravidel pro konfiguraci:\n` +
            `  ${existingRule.toString()}\n` +
            `  ${rule.toString()}`,
        );
      }

      ruleMap.set(key, rule);
    }
  }

  /**
   * Provede jeden krok simulace
   * @returns true pokud byl proveden krok, false pokud je stroj v koncovém stavu nebo nelze pokračovat
   */
  step(): boolean {
    // Zkontrolovat, zda jsme v koncovém stavu
    if (this.currentState.end) {
      return false;
    }

    // Přečíst symboly ze všech pásek
    const readSymbols: [string, string, string] = [
      this.tapes[0].read(),
      this.tapes[1].read(),
      this.tapes[2].read(),
    ];

    // Najít aplikovatelné pravidlo
    const applicableRule = this.rules.find((rule) =>
      rule.matches(this.currentState, readSymbols),
    );

    if (!applicableRule) {
      console.warn(
        `Žádné pravidlo pro konfiguraci: (${
          this.currentState.name
        }, [${readSymbols.join(", ")}])`,
      );
      return false;
    }

    // Aplikovat pravidlo
    // 1. Zapsat symboly na všechny pásky
    this.tapes[0].write(applicableRule.writeSymbols[0]);
    this.tapes[1].write(applicableRule.writeSymbols[1]);
    this.tapes[2].write(applicableRule.writeSymbols[2]);

    // 2. Posunout hlavy
    this.tapes[0].move(applicableRule.operations[0]);
    this.tapes[1].move(applicableRule.operations[1]);
    this.tapes[2].move(applicableRule.operations[2]);

    // 3. Změnit stav
    this.currentState = applicableRule.nextState;

    // 4. Zaznamenat krok
    // this._recordStep(applicableRule);

    return true;
  }

  /**
   * Spustí simulaci do koncového stavu nebo do dosažení maximálního počtu kroků
   * @param maxSteps - Maximální počet kroků (výchozí: 10000)
   * @param onStep - Callback funkce volaná po každém kroku
   * @param delay - Pauza mezi kroky v ms (výchozí: 0)
   * @returns true pokud dosáhl koncového stavu, false pokud překročil limit
   */
  async run(
    onStep?: (data: StepData) => void | Promise<void>,
    delay: number = 0,
    maxSteps: number = 10000,
  ): Promise<boolean> {
    let steps = 0;

    while (!this.currentState.end && steps < maxSteps) {
      const success = this.step();
      if (!success) {
        console.warn(
          `Žádné pravidlo nenalezeno ve stavu ${this.currentState.name}`,
        );
        return false;
      }

      steps++;

      // Zavolat callback po každém kroku
      if (onStep) {
        await onStep({
          stepNumber: steps,
          currentState: this.currentState.name,
          tapes: [
            [...this.tapes[0].symbols],
            [...this.tapes[1].symbols],
            [...this.tapes[2].symbols],
          ],
          heads: [this.tapes[0].head, this.tapes[1].head, this.tapes[2].head],
          isEnd: this.currentState.end,
          appliedRule: this.rules
            .find((rule) =>
              rule.matches(this.currentState, [
                this.tapes[0].read(),
                this.tapes[1].read(),
                this.tapes[2].read(),
              ]),
            )
            ?.toString(),
        });

        // Přidat pauzu mezi kroky
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    if (steps >= maxSteps) {
      console.warn(`Simulace překročila limit ${maxSteps} kroků!`);
      return false;
    }

    return this.currentState.end;
  }

  /** Vytiskne aktuální stav všech pásek */
  printState(): void {
    console.log(
      `\n=== Krok ${this.stepCount}: Stav ${this.currentState.toString()} ===`,
    );

    for (let i = 0; i < 3; i++) {
      const tapeOutput = this.tapes[i].toString();
      const [headLine, tapeLine] = tapeOutput.split("\n");
      console.log(`    ${headLine}`);
      console.log(`T${i + 1}: ${tapeLine}`);
    }
  }

  /** Vrátí obsah výstupní pásky (páska 1) jako pole symbolů */
  getOutput(): string[] {
    return [...this.tapes[0].symbols];
  }
}
