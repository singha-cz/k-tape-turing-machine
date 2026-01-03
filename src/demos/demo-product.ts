import { Machine } from "../factory/Machine";
import { State } from "../factory/State";
import { getRulesProduct } from "./rules";

export function createProductMachine(input: string): Machine {
  // Vytvoření stavů
  const q0 = new State("q0", true, false); // Přeskočit # na začátku
  const q1 = new State("q_final", false, true); // Konec

  // Stavy
  const Q = [q0, q1];

  return new Machine(Q, getRulesProduct(Q), input.split(""));
}
