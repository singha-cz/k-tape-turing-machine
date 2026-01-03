import { Machine } from "../factory/Machine";
import { State } from "../factory/State";
import { getRulesSum } from "./rules";

export function createSumMachine(input: string): Machine {
  const q0 = new State("q0", true); // počáteční stav
  const q1 = new State("q1");
  const q2 = new State("q2");
  const q3 = new State("q3");
  const q4 = new State("q4");
  const q5 = new State("q_final", false, true); // koncový stav

  // Stavy
  const Q = [q0, q1, q2, q3, q4, q5];

  return new Machine(Q, getRulesSum(Q), input.split(""));
}
