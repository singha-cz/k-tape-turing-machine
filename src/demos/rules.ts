import { State } from "../factory/State";
import { Rule } from "../factory/Rule";
import { E } from "../types";
import { useWildcardSymbols } from "../utils";

// Přechodová pravidla pro inkrementaci binárního čísla na první pásce.
export function getRulesIncrement(states: State[]): Rule[] {
  // Stavy TS
  const [q0, q1, q2_final] = states;

  return [
    new Rule(q0, ["1", E, E], q0, ["1", E, E], ["R", "S", "S"]),
    new Rule(q0, ["0", E, E], q0, ["0", E, E], ["R", "S", "S"]),

    // Když najdu prázdný symbol, jsem na konci pásky. Posunu hlavu doleva.
    new Rule(q0, [E, E, E], q1, [E, E, E], ["L", "S", "S"]),

    // Když najdu 1, zapíšu 0 a posunu hlavu doleva.
    new Rule(q1, ["1", E, E], q1, ["0", E, E], ["L", "S", "S"]),

    // Když najdu 0, zapíšu 1 a ukončím program.
    new Rule(q1, ["0", E, E], q2_final, ["1", E, E], ["S", "S", "S"]),
  ];
}

// Přechodová pravidla pro dekrementaci binárního čísla na první pásce.
export function getRulesDecrement(states: State[]): Rule[] {
  // Stavy TS
  const [q0, q1, q2_final] = states;

  return [
    // Když najdu 1 nebo 0, pokračuju dále vpravo až na LSB.
    new Rule(q0, ["1", E, E], q0, ["1", E, E], ["R", "S", "S"]),
    new Rule(q0, ["0", E, E], q0, ["0", E, E], ["R", "S", "S"]),

    // Když najdu prázdný symbol, jsem na konci pásky. Posunu hlavu doleva.
    new Rule(q0, [E, E, E], q1, [E, E, E], ["L", "S", "S"]),

    // Když najdu 0, zapíšu 1 a posunu hlavu doleva.
    new Rule(q1, ["0", E, E], q1, ["1", E, E], ["L", "S", "S"]),

    // Když najdu 1, zapíšu 0 a ukončím program.
    new Rule(q1, ["1", E, E], q2_final, ["0", E, E], ["S", "S", "S"]),
  ];
}

// Přechodová pravidla pro sčítání n-tice binárních čísel.
export function getRulesSum(states: State[]): Rule[] {
  // Stavy TS
  const [q0, q1, q2, q3, q4, q5] = states;
  const { generateWildcardRules } = useWildcardSymbols(["0", "1", "+", "#"]);

  return [
    // Přesun hlavy na konec T1
    ...generateWildcardRules(q0, q0, ["0", "*", E], ["0", "*", E], ["R", "S", "S"]),
    ...generateWildcardRules(q0, q0, ["1", "*", E], ["1", "*", E], ["R", "S", "S"]),
    ...generateWildcardRules(q0, q0, ["+", "*", E], ["+", "*", E], ["R", "S", "S"]),

    // Jsme na konci T1, přesuneme hlavu o jednu pozici doleva. Na T1 odteď postupujeme pouze vlevo.
    ...generateWildcardRules(q0, q1, ["#", "*", E], ["#", "*", E], ["L", "S", "S"]),

    // Kopírování čísla z T1 na T2 až do +
    new Rule(q1, ["1", E, E], q1, ["1", "1", E], ["L", "L", "S"]),
    new Rule(q1, ["0", E, E], q1, ["0", "0", E], ["L", "L", "S"]),
    new Rule(q1, ["+", E, E], q2, ["+", E, E], ["S", "R", "S"]),

    // Přsesun hlavy na konec T2
    new Rule(q2, ["+", "0", E], q2, ["+", "0", E], ["S", "R", "S"]),
    new Rule(q2, ["+", "1", E], q2, ["+", "1", E], ["S", "R", "S"]),
    new Rule(q2, ["+", E, E], q3, ["+", E, E], ["L", "L", "S"]),

    // Sčítání s přenosem (q4)
    new Rule(q3, ["1", "1", E], q4, ["1", "0", E], ["L", "L", "S"]),
    new Rule(q3, ["0", "1", E], q3, ["0", "1", E], ["L", "L", "S"]),
    new Rule(q3, ["1", "0", E], q3, ["1", "1", E], ["L", "L", "S"]),
    new Rule(q3, ["0", "0", E], q3, ["0", "0", E], ["L", "L", "S"]),

    new Rule(q3, [E, "1", E], q5, [E, "1", E], ["S", "S", "S"]),
    new Rule(q3, [E, "0", E], q5, [E, "1", E], ["S", "S", "S"]),

    new Rule(q4, ["+", "1", E], q4, ["+", "0", E], ["S", "L", "S"]),
    new Rule(q4, ["+", E, E], q2, ["+", "1", E], ["S", "R", "S"]),
  ];
}

export function getRulesProduct(states: State[]): Rule[] {
  const [q0, q1] = states;

  return [
    new Rule(q0, ["1", E, E], q1, ["1", E, E], ["S", "S", "S"]),
    new Rule(q0, ["0", E, E], q1, ["1", E, E], ["S", "S", "S"]),
  ];
}
