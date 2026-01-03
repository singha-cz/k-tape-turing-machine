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
- Princip:
  1. Přesuneme hlavu na konec pásky vpravo.
  2. Postupujeme zprava doleva. Najdeme-li 0, změníme na 1 a ukončíme program.
  3. Najdeme-li 1, změníme na 0 a postupujeme dále vlevo.

### 2. Dekrementace binárního čísla

- **Vstup:** `#1101110#` (110)
- **Výstup:** `#1101101#` (109)
- Snižuje binární číslo o jedničku
- Princip:
  1. Přesuneme hlavu na konec pásky vpravo.
  2. Postupujeme zprava doleva. Najdeme-li 0, změníme na 1 a postupujeme dále vlevo.
  3. Najdeme-li 1, změníme na 0 a ukončíme program.

### 3. Součet n-tice binárních čísel

- **Vstup:** `#111+10+110#` (7 + 2 + 6)
- **Výstup:** `1111` (15)
- Sčítá více binárních čísel oddělených operátorem `+`.
- Princip:
  1. Přesuneme hlavu na konec T1 a postupnně procházíme pásku směrem zprava doleva.
  2. První nalezené číslo pouze překopírujeme na T2.
  3. Přesuneme hlavu T1 na následující číslo, které sečteme s hodnotou na T2.
  4. Po dokončení součtu přesuneme hlavu T2 na konec pásky.
  5. Pokračujeme krokem 3 do té doby, než se dostaneme na začátek T1.
  6. Výsledek je na T2.

### 4. Součin n-tice binárních čísel

- **Vstup:** N-tice binárních čísel
- **Výstup:** TODO
- Násobí binární čísla

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

1. Přejděte na https://singha-cz.github.io/k-tape-turing-machine/
2. Vyberte demonstrační příklad ze seznamu
3. Spusťte simulaci tlačítkem "▷" nebo krokujte pomocí tlačítka Další krok.
4. Sledujte průběh výpočtu krok po kroku
5. Prohlédněte si zakódovanou podobu stroje

## Zdroje

- Učební materiály předmětu XTILO
- turingmachine.io – https://turingmachine.io/
- AI - OpenAI ChatGPT, Google Gemini
