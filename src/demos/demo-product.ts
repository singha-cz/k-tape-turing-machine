import { State } from "../factory/State";
import { Rule } from "../factory/Rule";
import { Machine } from "../factory/Machine";
import { E } from "../types";

// ============================================================================
// SOUČIN BINÁRNÍCH ČÍSEL - 3-PÁSKOVÝ TURINGŮV STROJ
// ============================================================================
// Algoritmus: Násobení 2 nebo 3 čísel pomocí opakovaného sčítání
//
// Pro 2 čísla (A × B):
//   Páska 1: Vstup A#B - zachováno
//   Páska 2: Výsledek A × B
//   Páska 3: Čítač (kopie B)
//   Příklad: 101#10 (5×2) → páska 2: 1010 (10)
//
// Pro 3 čísla (A × B × C = (A × B) × C):
//   FÁZE 1: Spočítat A × B → páska 2
//   FÁZE 2: Spočítat (A × B) × C → páska 2
//   Páska 1: Vstup A#B#C - zachováno
//   Páska 2: Finální výsledek A × B × C
//   Páska 3: Čítač (nejdřív B, pak C)
//   Příklad: 101#10#11 (5×2×3) → páska 2: 11110 (30)
// ============================================================================

export function createProductMachine(input: string): Machine {
  // Vytvoření stavů
  const q0 = new State("q0", true, false); // Přeskočit # na začátku
  const q1 = new State("q1", false, false); // Najít první číslo A
  const q2 = new State("q2", false, false); // Najít separátor
  const q3 = new State("q3", false, false); // Zkopírovat B na pásku 3 jako čítač
  const q4 = new State("q4", false, false); // Vrátit se na začátek čítače
  const q5 = new State("q5", false, false); // Kontrola čítače - je nenulový?
  const q6 = new State("q6", false, false); // Dekrementovat čítač (najít poslední 1)
  const q7 = new State("q7", false, false); // Změnit 1→0, pokračovat doleva
  const q8 = new State("q8", false, false); // Najít začátek čísla pro sčítání
  const q9 = new State("q9", false, false); // Najít konec čísla a akumulátoru
  const q10 = new State("q10", false, false); // Sčítat zprava bez carry
  const q11 = new State("q11", false, false); // Sčítat zprava s carry
  const q12 = new State("q12", false, false); // Dokončit sčítání, vrátit se
  const q13 = new State("q13", false, false); // Kontrola třetího čísla C
  const q14 = new State("q14", false, false); // Příprava pro fázi 2: najít C
  const q15 = new State("q15", false, false); // Zkopírovat C na pásku 3
  const q16 = new State("q16", false, false); // Vymazat pásku 3, příprava pro fázi 2
  const qAccept = new State("qAccept", false, true); // Koncový stav

  const states = [
    q0,
    q1,
    q2,
    q3,
    q4,
    q5,
    q6,
    q7,
    q8,
    q9,
    q10,
    q11,
    q12,
    q13,
    q14,
    q15,
    q16,
    qAccept,
  ];

  const rules: Rule[] = [
    // === FÁZE 1: Inicializace - najít a zkopírovat B na pásku 3 ===

    // q0: Přeskočit úvodní #
    new Rule(q0, [E, E, E], q0, [E, E, E], ["R", "S", "S"]),
    new Rule(q0, ["0", E, E], q1, ["0", E, E], ["R", "S", "S"]),
    new Rule(q0, ["1", E, E], q1, ["1", E, E], ["R", "S", "S"]),

    // q1: Projít A, najít separátor
    new Rule(q1, ["0", E, E], q1, ["0", E, E], ["R", "S", "S"]),
    new Rule(q1, ["1", E, E], q1, ["1", E, E], ["R", "S", "S"]),
    new Rule(q1, [E, E, E], q2, [E, E, E], ["R", "S", "S"]),

    // q2: Přeskočit další # a najít B
    new Rule(q2, [E, E, E], q2, [E, E, E], ["R", "S", "S"]),
    new Rule(q2, ["0", E, E], q3, ["0", E, E], ["R", "S", "S"]),
    new Rule(q2, ["1", E, E], q3, ["1", E, E], ["R", "S", "S"]),

    // q3: Zkopírovat B na pásku 3
    new Rule(q3, ["0", E, E], q3, ["0", E, "0"], ["R", "S", "R"]),
    new Rule(q3, ["1", E, E], q3, ["1", E, "1"], ["R", "S", "R"]),
    new Rule(q3, [E, E, E], q4, [E, E, E], ["S", "S", "L"]),

    // === FÁZE 2: Smyčka násobení ===

    // q4: Vrátit se na začátek čítače na pásce 3
    new Rule(q4, [E, E, "0"], q4, [E, E, "0"], ["S", "S", "L"]),
    new Rule(q4, [E, E, "1"], q4, [E, E, "1"], ["S", "S", "L"]),
    new Rule(q4, [E, E, E], q5, [E, E, E], ["S", "S", "R"]),

    // q5: Kontrola čítače - je nenulový?
    new Rule(q5, [E, E, "0"], q5, [E, E, "0"], ["S", "S", "R"]),
    new Rule(q5, [E, E, "1"], q6, [E, E, "1"], ["S", "S", "R"]),
    // Čítač je 0 - fáze 1 dokončena, zkontrolovat existenci C
    new Rule(q5, [E, E, E], q13, [E, E, E], ["L", "S", "S"]),

    // q6: Najít poslední bit čítače (nejpravější pozice)
    new Rule(q6, [E, E, "0"], q6, [E, E, "0"], ["S", "S", "R"]),
    new Rule(q6, [E, E, "1"], q6, [E, E, "1"], ["S", "S", "R"]),
    new Rule(q6, [E, E, E], q7, [E, E, E], ["S", "S", "L"]),

    // q7: Dekrementovat čítač (najít první 1 zprava a změnit na 0, všechny 0 vpravo změnit na 1)
    new Rule(q7, [E, E, "0"], q7, [E, E, "1"], ["S", "S", "L"]),
    new Rule(q7, [E, E, "1"], q8, [E, E, "0"], ["L", "S", "S"]),

    // q8: Vrátit se na začátek pro sčítání
    // Jít doleva, dokud páska 1 je neprázdná nebo páska 2 je neprázdná
    new Rule(q8, ["0", E, E], q8, ["0", E, E], ["L", "L", "S"]),
    new Rule(q8, ["1", E, E], q8, ["1", E, E], ["L", "L", "S"]),
    new Rule(q8, ["0", "0", E], q8, ["0", "0", E], ["L", "L", "S"]),
    new Rule(q8, ["0", "1", E], q8, ["0", "1", E], ["L", "L", "S"]),
    new Rule(q8, ["1", "0", E], q8, ["1", "0", E], ["L", "L", "S"]),
    new Rule(q8, ["1", "1", E], q8, ["1", "1", E], ["L", "L", "S"]),
    // Páska 1 blank, ale páska 2 má data - pokračovat
    new Rule(q8, [E, "0", E], q8, [E, "0", E], ["L", "L", "S"]),
    new Rule(q8, [E, "1", E], q8, [E, "1", E], ["L", "L", "S"]),
    // Obě pásky blank - jsme na začátku, jít doprava
    new Rule(q8, [E, E, E], q9, [E, E, E], ["R", "R", "S"]),

    // q9: Najít konec A a akumulátoru, připravit sčítání
    // Najít A a přejít ho, akumulátor se vytváří souběžně
    new Rule(q9, ["0", E, E], q9, ["0", E, E], ["R", "R", "S"]),
    new Rule(q9, ["1", E, E], q9, ["1", E, E], ["R", "R", "S"]),
    new Rule(q9, ["0", "0", E], q9, ["0", "0", E], ["R", "R", "S"]),
    new Rule(q9, ["0", "1", E], q9, ["0", "1", E], ["R", "R", "S"]),
    new Rule(q9, ["1", "0", E], q9, ["1", "0", E], ["R", "R", "S"]),
    new Rule(q9, ["1", "1", E], q9, ["1", "1", E], ["R", "R", "S"]),
    // Páska 1 má separátor, ale páska 2 má ještě data - pokračovat
    new Rule(q9, [E, "0", E], q9, [E, "0", E], ["R", "R", "S"]),
    new Rule(q9, [E, "1", E], q9, [E, "1", E], ["R", "R", "S"]),
    // Obě pásky blank - našli jsme konec, vrátit se a začít sčítat
    new Rule(q9, [E, E, E], q10, [E, E, E], ["L", "L", "S"]),

    // === FÁZE 3: Sčítání A + akumulátor ===

    // q10: Sčítat bez carry
    new Rule(q10, ["0", "0", E], q10, ["0", "0", E], ["L", "L", "S"]),
    new Rule(q10, ["0", "1", E], q10, ["0", "1", E], ["L", "L", "S"]),
    new Rule(q10, ["1", "0", E], q10, ["1", "1", E], ["L", "L", "S"]),
    new Rule(q10, ["1", "1", E], q11, ["1", "0", E], ["L", "L", "S"]),
    new Rule(q10, ["0", E, E], q10, ["0", "0", E], ["L", "L", "S"]),
    new Rule(q10, ["1", E, E], q10, ["1", "1", E], ["L", "L", "S"]),
    new Rule(q10, [E, "0", E], q10, [E, "0", E], ["L", "L", "S"]),
    new Rule(q10, [E, "1", E], q10, [E, "1", E], ["L", "L", "S"]),
    new Rule(q10, [E, E, E], q12, [E, E, E], ["S", "S", "S"]),

    // q11: Sčítat s carry
    new Rule(q11, ["0", "0", E], q10, ["0", "1", E], ["L", "L", "S"]),
    new Rule(q11, ["0", "1", E], q11, ["0", "0", E], ["L", "L", "S"]),
    new Rule(q11, ["1", "0", E], q11, ["1", "0", E], ["L", "L", "S"]),
    new Rule(q11, ["1", "1", E], q11, ["1", "1", E], ["L", "L", "S"]),
    new Rule(q11, ["0", E, E], q10, ["0", "1", E], ["L", "L", "S"]),
    new Rule(q11, ["1", E, E], q11, ["1", "0", E], ["L", "L", "S"]),
    new Rule(q11, [E, "0", E], q10, [E, "1", E], ["L", "L", "S"]),
    new Rule(q11, [E, "1", E], q11, [E, "0", E], ["L", "L", "S"]),
    new Rule(q11, [E, E, E], q12, [E, "1", E], ["S", "S", "S"]),

    // q12: Dokončit iteraci, vrátit se na kontrolu čítače
    new Rule(q12, [E, E, E], q4, [E, E, E], ["S", "S", "L"]),

    // === FÁZE 2: Kontrola a zpracování třetího čísla C ===

    // q13: Kontrola, zda existuje třetí číslo C (voláno z q5 když čítač je 0)
    // Vrátit hlavu pásky 1 na začátek
    new Rule(q13, ["0", E, E], q13, ["0", E, E], ["L", "S", "S"]),
    new Rule(q13, ["1", E, E], q13, ["1", E, E], ["L", "S", "S"]),
    new Rule(q13, [E, "0", E], q13, [E, "0", E], ["L", "L", "S"]),
    new Rule(q13, [E, "1", E], q13, [E, "1", E], ["L", "L", "S"]),
    new Rule(q13, [E, E, E], q14, [E, E, E], ["R", "S", "S"]),

    // q14: Najít druhý separátor (#) a třetí číslo C
    // Přejít A (páska 3 je blank = ještě jsme nepřešli první #)
    new Rule(q14, ["0", E, E], q14, ["0", E, E], ["R", "S", "S"]),
    new Rule(q14, ["1", E, E], q14, ["1", E, E], ["R", "S", "S"]),
    // První separátor - zapsat marker na pásku 3
    new Rule(q14, [E, E, E], q14, [E, E, "X"], ["R", "S", "S"]),
    // Přeskočit B (na pásce 2 je výsledek A×B)
    new Rule(q14, ["0", "0", "X"], q14, ["0", "0", "X"], ["R", "S", "S"]),
    new Rule(q14, ["0", "1", "X"], q14, ["0", "1", "X"], ["R", "S", "S"]),
    new Rule(q14, ["1", "0", "X"], q14, ["1", "0", "X"], ["R", "S", "S"]),
    new Rule(q14, ["1", "1", "X"], q14, ["1", "1", "X"], ["R", "S", "S"]),
    // Druhý separátor (páska 2 ještě má konec B, páska 3 má marker)
    new Rule(q14, [E, "0", "X"], q14, [E, "0", "X"], ["R", "S", "S"]),
    new Rule(q14, [E, "1", "X"], q14, [E, "1", "X"], ["R", "S", "S"]),
    // Našli jsme C (páska 3 má marker X = už jsme za A)
    new Rule(q14, ["0", E, "X"], q15, ["0", E, "X"], ["R", "S", "S"]),
    new Rule(q14, ["1", E, "X"], q15, ["1", E, "X"], ["R", "S", "S"]),
    // Nenašli jsme C - konec (jen 2 čísla)
    new Rule(q14, [E, E, "X"], qAccept, [E, E, "X"], ["S", "S", "S"]),

    // q15: Zkopírovat C na pásku 3, vymazat starou hodnotu
    new Rule(q15, ["0", E, E], q15, ["0", E, "0"], ["R", "S", "R"]),
    new Rule(q15, ["1", E, E], q15, ["1", E, "1"], ["R", "S", "R"]),
    new Rule(q15, [E, E, E], q16, [E, E, E], ["S", "S", "L"]),

    // q16: Vymazat pásku 2 a připravit na násobení (A×B) × C
    // Místo vymazání použijeme pásku 2 jako základ pro násobení
    // Vrátit se na začátek pásky 3 a spustit násobení
    new Rule(q16, [E, E, "0"], q16, [E, E, "0"], ["S", "S", "L"]),
    new Rule(q16, [E, E, "1"], q16, [E, E, "1"], ["S", "S", "L"]),
    new Rule(q16, [E, E, E], q4, [E, E, E], ["S", "S", "R"]),
  ];

  // Příprava vstupní pásky
  const inputTape = input.split("");

  return new Machine(states, rules, inputTape);
}
