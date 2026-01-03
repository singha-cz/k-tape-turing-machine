import { log } from "console";
import { Rule } from "../factory/Rule";
import { State } from "../factory/State";
import { Operation } from "../types";
import { E } from "../types";

// Přechod
interface TransitionRule {
  fromState: string; // q_i
  readSymbols: string[]; // x_j
  toState: string; // q_k
  writeSymbols: string[]; // x_l
  moves: Operation[]; // y_m
}

// Konfigurace symbolů
const symbolMap: Record<string, number> = {
  [E]: 1, // x1, 0
  "1": 2, // x2, 00
  "0": 3, // x3, 000
  "+": 4, // x4, 0000
};

// Konfigurace pohybů
const moveMap: Record<Operation, number> = {
  S: 1, // y1, 0
  L: 2, // y2, 00
  R: 3, // y3, 000
};

/**
 * Funkce zakóduje Turingův stroj do binárního řetězce
 * @param states Seznam názvů stavů TS
 * @param rules Seznam pravidel přechodové funkce
 */
export default function encodeTuringMachine(states?: string[], rules?: TransitionRule[]) {
  if (!states || !rules) return [];

  // Generování řetězce nul (0^n)
  const getZeros = (n: number): string => "0".repeat(n);

  // Funkce pro získání kódu symbolu s kontrolou existence
  const getSymbolCode = (sym: string): string => {
    const code = symbolMap[sym];
    if (!code) throw new Error(`Neznámý symbol: '${sym}'`);
    return getZeros(code);
  };

  // Funkce pro získání kódu pohybu
  const getMoveCode = (move: Operation): string => {
    const code = moveMap[move];
    if (!code) throw new Error(`Neznámý pohyb: '${move}'`);
    return getZeros(code);
  };

  // Zakódování přechodů
  return rules.map((rule, index) => {
    const tapesCount = rule.readSymbols.length;

    if (rule.writeSymbols.length !== tapesCount || rule.moves.length !== tapesCount) {
      throw new Error(
        `Chyba v přechodu č. ${index}: Nesedí počet pásek (read/write/move musí mít stejnou délku).`,
      );
    }

    // Indexy stavů
    const i = states.indexOf(rule.fromState) + 1;
    const k = states.indexOf(rule.toState) + 1;

    if (i === 0 || k === 0) {
      throw new Error(`Neznámý stav: '${rule.fromState}' nebo '${rule.toState}'`);
    }

    // Sestavení sekvence bloků
    // Pořadí: Stav -> [Čtené symboly...] -> Nový stav -> [Zapisované symboly...] -> [Pohyby...]
    const parts: string[] = [
      getZeros(i), // q_i
      ...rule.readSymbols.map(getSymbolCode), // x_j (pro každou pásku)
      getZeros(k), // q_k
      ...rule.writeSymbols.map(getSymbolCode), // x_l (pro každou pásku)
      ...rule.moves.map(getMoveCode), // y_m (pro každou pásku)
    ];

    // Spojíme všechny části pomocí jedničky '1'
    return parts;
  });
}

export const useWildcardSymbols = (symbols: string[]) => {
  function generateWildcardRules(
    q_from: State,
    q_to: State,
    input: [string, string, string],
    output: [string, string, string],
    moves: [Operation, Operation, Operation],
  ): Rule[] {
    return symbols.map((symbol) => {
      const inputSymbols = input.map((s) => (s === "*" ? symbol : s)) as [
        string,
        string,
        string,
      ];
      const outputSymbols = output.map((s) => (s === "*" ? symbol : s)) as [
        string,
        string,
        string,
      ];
      return new Rule(q_from, inputSymbols, q_to, outputSymbols, moves);
    });
  }
  return { generateWildcardRules };
};
