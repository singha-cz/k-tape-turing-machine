import { Machine } from "../factory/Machine";
import { State } from "../factory/State";
import { getRulesIncrement } from "./rules";

export function createIncrementMachine(input: string): Machine {
  const q0 = new State("q0", true); // počáteční stav
  const q1 = new State("q1");
  const q2_final = new State("q2", false, true); // koncový stav

  // Stavy TS
  const Q = [q0, q1, q2_final];

  return new Machine(Q, getRulesIncrement(Q), input.split(""));
}
