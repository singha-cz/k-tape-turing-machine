import { State } from "../factory/State";
import { Rule } from "../factory/Rule";
import { Machine } from "../factory/Machine";
import { E } from "../types";
import { useWildcardSymbols } from "../utils";

export function createSumMachine(input: string): Machine {
  const { generateWildcardRules } = useWildcardSymbols(["0", "1", "+", "#"]);
  const q0 = new State("q0", true); // počáteční stav
  const q1 = new State("q1");
  const q2 = new State("q2");
  const q3 = new State("q3");
  const q4 = new State("q4_0");
  const q5 = new State("qf", false, true); // koncový stav

  // Stavy
  const Q = [q0, q1, q2, q3, q4, q5];

  const rules: Rule[] = [
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

  return new Machine(Q, rules, input.split(""));
}
