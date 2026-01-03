# Simulátor k-páskového Turingova stroje

Webová aplikace pro simulaci deterministického k-páskového Turingova stroje s vizualizací jednotlivých kroků výpočtu a podporou kódování stroje.

## Popis

Aplikace poskytuje interaktivní simulátor k-páskového Turingova stroje implementovaný v TypeScriptu s využitím React frameworku. Umožňuje definovat přechodové funkce, stavy a abecedu, spustit simulaci a sledovat průběh výpočtu krok po kroku.

## Hlavní funkce

- **Deterministický k-páskový Turingův stroj** - podpora pro více pásek současně
- **Vizualizace kroků** - zobrazení stavu pásky a pozice hlavy v každém kroku
- **Kódování stroje** - automatické zakódování definovaného Turingova stroje
- **Demonstrační příklady** - předpřipravené stroje pro běžné operace
- **Interaktivní rozhraní** - možnost krokování a sledování celé simulace

## Demonstrační příklady

Aplikace obsahuje následující ukázkové Turingovy stroje:

### 1. Inkrementace binárního čísla

- **Vstup:** `#10111#` (23 v desítkové soustavě)
- **Výstup:** `#11000#` (24)
- Zvyšuje binární číslo o jedničku

### 2. Dekrementace binárního čísla

- **Vstup:** `#1101110#` (110)
- **Výstup:** `#1101101#` (109)
- Snižuje binární číslo o jedničku

### 3. Součet binárních čísel

- **Vstup:** `#111+10+110#` (7 + 2 + 6)
- **Výstup:** `1111` (15)
- Sčítá více binárních čísel oddělených operátorem `+`

### 4. Součin binárních čísel

- **Vstup:** Více binárních čísel
- **Výstup:** Jejich součin
- Násobí binární čísla pomocí primitivně rekurzivních funkcí

## Architektura

Aplikace je strukturována do následujících modulů:

### Factory (Jádro simulátoru)

- **Machine.ts** - hlavní třída Turingova stroje
- **State.ts** - reprezentace stavů stroje
- **Tape.ts** - implementace pásky
- **Rule.ts** - přechodové funkce

### Demos

- Předpřipravené ukázkové stroje pro různé operace
- Demonstrace práce s binárními čísly

### Utils

- **MachineEncoding.tsx** - kódování Turingova stroje do standardní podoby
- Pomocné funkce pro práci se strojem

## Technologie

- **TypeScript** - typově bezpečný JavaScript
- **React** - UI framework
- **Vite** - build tool a dev server
- **SASS** - CSS preprocessor

## Spuštění projektu

```bash
# Instalace závislostí
npm install

# Spuštění dev serveru
npm run dev

# Build pro produkci
npm run build

# Náhled produkční verze
npm run preview
```

## Použití

1. Vyberte demonstrační příklad ze seznamu
2. Spusťte simulaci tlačítkem "Start"
3. Sledujte průběh výpočtu krok po kroku
4. Prohlédněte si zakódovanou podobu stroje

## Zdroje

- Učební materiály předmětu XTILO
  -turingmachine.io – Interaktivní simulátor Turingova stroje (vizualizace a ověřování jednoduchých konfigurací): https://turingmachine.io/
- AI - ChatGPT, Gemini
