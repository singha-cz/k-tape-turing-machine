/** Stav Turingova stroje */
export class State {
  /** Identifikátor stavu */
  name: string;

  /** Je to počáteční stav? */
  start: boolean;

  /** Je to koncový stav? */
  end: boolean;

  /**
   * Vytvoří nový stav Turingova stroje
   * @param name - Identifikátor stavu (např. "q0", "q1", "qaccept")
   * @param start - Je to počáteční stav? (výchozí: false)
   * @param end - Je to koncový stav? (výchozí: false)
   */
  constructor(name: string, start: boolean = false, end: boolean = false) {
    this.name = name;
    this.start = start;
    this.end = end;
  }

  /** Vrátí textovou reprezentaci stavu */
  toString(): string {
    const flags: string[] = [];
    if (this.start) flags.push("start");
    if (this.end) flags.push("end");

    return flags.length > 0 ? `${this.name} (${flags.join(", ")})` : this.name;
  }
}
