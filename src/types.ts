/**
 * Operace pohybu hlavy na pásce Turingova stroje
 * R - Right (doprava)
 * L - Left (doleva)
 * S - Stay (zůstat na místě)
 */
export type Operation = "R" | "L" | "S";

/** Prázdný symbol na pásce */
export const E = "#";

/** Abeceda používaná na pásce */
export const G = ["0", "1", E];
