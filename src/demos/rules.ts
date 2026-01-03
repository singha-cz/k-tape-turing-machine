import { State } from "../factory/State";
import { Rule } from "../factory/Rule";
import { E } from "../types";

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

// Přechodová pravidla pro monus binárního čísla na první pásce.
// Monus (zkrácené odečítání): x ∸ y = max(0, x - y)
// Vstup: #x∸y# kde x a y jsou binární čísla
// Výstup: #(x-y)# pokud x >= y, jinak #0#
export function getRulesMonus(states: State[]): Rule[] {
  // Stavy TS
  const [q0, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10_final] = states;

  return [
    // q0: Najdi konec vstupní pásky (posuň se doprava přes všechno)
    new Rule(q0, ["1", E, E], q0, ["1", E, E], ["R", "S", "S"]),
    new Rule(q0, ["0", E, E], q0, ["0", E, E], ["R", "S", "S"]),
    new Rule(q0, ["∸", E, E], q0, ["∸", E, E], ["R", "S", "S"]),

    // Když najdu konečný #, vrať se doleva na LSB druhého čísla
    new Rule(q0, [E, E, E], q1, [E, E, E], ["L", "S", "S"]),

    // q1: Kontrola - je druhé číslo nula? (vrací se doleva přes druhé číslo)
    // Pokud najdeme ∸, znamená to že druhé číslo bylo samé nuly → vymaž ∸ a druhé číslo
    new Rule(q1, ["∸", E, E], q8, [E, E, E], ["R", "S", "S"]),

    // Pokud je bit = 0, pokračuj doleva (možná je celé druhé číslo nula)
    new Rule(q1, ["0", E, E], q1, ["0", E, E], ["L", "S", "S"]),

    // Pokud je bit = 1, druhé číslo není nula → musíme dekrementovat oba
    // Posuň se doprava, abychom našli LSB druhého čísla pro dekrementaci
    new Rule(q1, ["1", E, E], q2, ["1", E, E], ["R", "S", "S"]),

    // Speciální případ: pokud najdeme # jako první znak (prázdné druhé číslo), hotovo
    new Rule(q1, [E, E, E], q10_final, [E, E, E], ["S", "S", "S"]),

    // q2: Posuň se na konec druhého čísla (LSB)
    new Rule(q2, ["0", E, E], q2, ["0", E, E], ["R", "S", "S"]),
    new Rule(q2, ["1", E, E], q2, ["1", E, E], ["R", "S", "S"]),

    // Našli jsme konec, vrať se doleva na LSB a začni dekrementovat
    new Rule(q2, [E, E, E], q3, [E, E, E], ["L", "S", "S"]),

    // q3: Dekrementuj druhé číslo (binární dekrementace zprava doleva)
    // Pokud je bit = 0, změň na 1 a pokračuj doleva (půjčka)
    new Rule(q3, ["0", E, E], q3, ["1", E, E], ["L", "S", "S"]),

    // Pokud je bit = 1, změň na 0 → dekrementace dokončena, teď dekrementuj první číslo
    new Rule(q3, ["1", E, E], q4, ["0", E, E], ["L", "S", "S"]),

    // Pokud najdeme ∸ při půjčce (druhé číslo bylo 00...0 a stalo se 11...1 po dekrementaci)
    // To znamená underflow, druhé číslo bylo už nula → vymaž ∸ a druhé číslo
    new Rule(q3, ["∸", E, E], q8, [E, E, E], ["R", "S", "S"]),

    // q4: Najdi ∸ a pak první číslo
    new Rule(q4, ["0", E, E], q4, ["0", E, E], ["L", "S", "S"]),
    new Rule(q4, ["1", E, E], q4, ["1", E, E], ["L", "S", "S"]),

    // Našli jsme ∸, posuň se doleva k prvnímu číslu
    new Rule(q4, ["∸", E, E], q5, ["∸", E, E], ["L", "S", "S"]),

    // q5: Najdi začátek prvního čísla (MSB) a pak jdi doprava na LSB
    new Rule(q5, [E, E, E], q5, [E, E, E], ["L", "S", "S"]),

    // Našli jsme MSB prvního čísla, teď jdi doprava na konec (LSB)
    new Rule(q5, ["0", E, E], q5, ["0", E, E], ["R", "S", "S"]),
    new Rule(q5, ["1", E, E], q5, ["1", E, E], ["R", "S", "S"]),

    // Když najdeme ∸, znamená to, že jsme prošli celé první číslo, vrať se doleva na LSB
    new Rule(q5, ["∸", E, E], q6, ["∸", E, E], ["L", "S", "S"]),

    // q6: Dekrementuj první číslo (binární dekrementace zprava doleva)
    // Pokud je bit = 0, změň na 1 a pokračuj doleva (půjčka)
    new Rule(q6, ["0", E, E], q6, ["1", E, E], ["L", "S", "S"]),

    // Pokud je bit = 1, změň na 0 → dekrementace dokončena
    new Rule(q6, ["1", E, E], q7, ["0", E, E], ["R", "S", "S"]),

    // Pokud najdeme # při půjčce, znamená to že první číslo bylo menší než druhé
    // V takovém případě výsledek je 0, ale pokračujeme v dekrementaci
    new Rule(q6, [E, E, E], q7, [E, E, E], ["R", "S", "S"]),

    // Pokud najdeme ∸ při půjčce, znamená to že jsme na začátku prvního čísla
    // Dekrementace je dokončena, pokračuj na další iteraci
    new Rule(q6, ["∸", E, E], q0, ["∸", E, E], ["R", "S", "S"]),

    // q7: Vrať se doleva k ∸ pro další iteraci
    new Rule(q7, ["0", E, E], q7, ["0", E, E], ["L", "S", "S"]),
    new Rule(q7, ["1", E, E], q7, ["1", E, E], ["L", "S", "S"]),
    new Rule(q7, [E, E, E], q7, [E, E, E], ["L", "S", "S"]),

    // Našli jsme ∸, pokračuj doprava na konec druhého čísla a kontroluj, zda je nula
    new Rule(q7, ["∸", E, E], q0, ["∸", E, E], ["R", "S", "S"]),

    // q8: Vymazali jsme ∸, teď maž druhé číslo (jdi doprava a maž vše)
    new Rule(q8, ["0", E, E], q9, [E, E, E], ["R", "S", "S"]),
    new Rule(q8, ["1", E, E], q9, [E, E, E], ["R", "S", "S"]),
    new Rule(q8, [E, E, E], q10_final, [E, E, E], ["S", "S", "S"]),

    // q9: Maž všechny znaky druhého čísla
    new Rule(q9, ["0", E, E], q9, [E, E, E], ["R", "S", "S"]),
    new Rule(q9, ["1", E, E], q9, [E, E, E], ["R", "S", "S"]),
    // Když najdeme koncový #, hotovo
    new Rule(q9, [E, E, E], q10_final, [E, E, E], ["S", "S", "S"]),
  ];
}
