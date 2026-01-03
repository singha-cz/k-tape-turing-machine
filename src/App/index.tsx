import { useEffect, useState } from "react";
import { createDecrementMachine } from "../demos/demo-decrement";
import { createIncrementMachine } from "../demos/demo-increment";
import { createProductMachine } from "../demos/demo-product";
import { createSumMachine } from "../demos/demo-sum";
import { Machine, StepData } from "../factory/Machine";
import encodeTuringMachine from "../utils";
import MachineEncoding from "../utils/MachineEncoding";
import classes from "./App.module.scss";

type Simulation = {
  id: string;
  machine: (input: string) => Machine;
  title: string;
  input?: string;
  inputDecimal?: string;
  output?: string;
};

const simulations: Simulation[] = [
  {
    id: "demo-increment",
    machine: createIncrementMachine,
    title: "Inkrementace binárního čísla",
    input: "#10111#",
    inputDecimal: "23",
    output: "#11000# (24)",
  },
  {
    id: "demo-decrement",
    machine: createDecrementMachine,
    title: "Dekrementace binárního čísla",
    input: "#1101110#",
    inputDecimal: "110",
    output: "#1101101# (109)",
  },
  {
    id: "demo-sum",
    machine: createSumMachine,
    title: "Součet binárních čísel",
    input: "#111+10+110#",
    // input: "##11#101#110##",
    inputDecimal: "5 + 2 + 6",
    output: "1101 (13)",
  },
  {
    id: "demo-product",
    machine: createProductMachine,
    title: "Součin binárních čísel",
    input: "##101#10#110##",
    inputDecimal: "5 × 2 × 6",
    output: "111100 (60)",
  },
];

const App = () => {
  const [simulation, setSimulation] = useState<Simulation["id"]>(simulations[0].id);
  const [currentStep, setCurrentStep] = useState<StepData | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [machineInstance, setMachineInstance] = useState<Machine | null>(null);
  const [stepCounter, setStepCounter] = useState(0);

  const currentSimulation = simulations.find((sim) => sim.id === simulation);
  const { states = [], rules = [] } = machineInstance || {};

  const encodedRules = encodeTuringMachine(
    states.map((s) => s.name) ?? [],
    rules.map((rule) => ({
      fromState: rule.currentState.name,
      readSymbols: rule.readSymbols,
      toState: rule.nextState.name,
      writeSymbols: rule.writeSymbols,
      moves: rule.operations,
    })),
  );

  // Inicializace stroje při změněn simulace
  useEffect(() => {
    if (!currentSimulation) return;

    const machine = currentSimulation.machine(currentSimulation.input || "");
    setMachineInstance(machine);
    setStepCounter(0);
    setIsFinished(false);
    setIsRunning(false);

    // Nastavení počátečního kroku
    setCurrentStep({
      stepNumber: 0,
      currentState: machine.currentState.name,
      tapes: [
        [...machine.tapes[0].symbols],
        [...machine.tapes[1].symbols],
        [...machine.tapes[2].symbols],
      ],
      heads: [machine.tapes[0].head, machine.tapes[1].head, machine.tapes[2].head],
      isEnd: machine.currentState.end,
    });
  }, [simulation, currentSimulation]);

  const handleRun = async () => {
    if (!machineInstance) return;

    setIsRunning(true);
    setIsFinished(false);
    setStepCounter(0);

    machineInstance.reset();

    await machineInstance.run(async (stepData) => {
      setCurrentStep(stepData);
    }, 500);

    setIsRunning(false);
    setIsFinished(true);
  };

  const handleStep = () => {
    if (!machineInstance) return;

    // Pokud je simulace dokončena, resetuj stroj
    if (isFinished) {
      machineInstance.reset();
      setIsFinished(false);
      setStepCounter(0);
    }

    // Provést jeden krok
    const success = machineInstance.step();
    const newStepCount = stepCounter + 1;
    setStepCounter(newStepCount);

    // Aktualizovat stav UI
    setCurrentStep({
      stepNumber: newStepCount,
      currentState: machineInstance.currentState.name,
      tapes: [
        [...machineInstance.tapes[0].symbols],
        [...machineInstance.tapes[1].symbols],
        [...machineInstance.tapes[2].symbols],
      ],
      heads: [
        machineInstance.tapes[0].head,
        machineInstance.tapes[1].head,
        machineInstance.tapes[2].head,
      ],
      isEnd: machineInstance.currentState.end,
    });

    // Pokud je stroj v koncovém stavu, označ jako dokončeno
    if (machineInstance.currentState.end || !success) {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    if (!machineInstance) return;
    machineInstance.reset();
    setIsFinished(false);
    setStepCounter(0);
    setCurrentStep({
      stepNumber: 0,
      currentState: machineInstance.currentState.name,
      tapes: [
        [...machineInstance.tapes[0].symbols],
        [...machineInstance.tapes[1].symbols],
        [...machineInstance.tapes[2].symbols],
      ],
      heads: [
        machineInstance.tapes[0].head,
        machineInstance.tapes[1].head,
        machineInstance.tapes[2].head,
      ],
      isEnd: machineInstance.currentState.end,
    });
  };

  const {
    stepNumber = 0,
    currentState,
    isEnd,
    heads = [],
    tapes = [],
    appliedRule,
  } = currentStep || {};

  const { input = "", output = "", inputDecimal = "" } = currentSimulation || {};

  return (
    <div className={classes.app}>
      <div className={classes.header}>
        <h2>3-páskový DTM</h2>
        <div className={classes.controls}>
          <select
            id="demo-select"
            defaultValue={currentSimulation?.id}
            onChange={(e) => setSimulation(e.target.value)}
          >
            {simulations.map((sim) => (
              <option key={sim.id} value={sim.id}>
                {sim.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={classes.machineInfo}>
        <div className={classes.infoGrid}>
          <div className={classes.infoItem}>
            <div className={classes.label}>Vstup</div>
            <div className={classes.value}>
              {input} ({inputDecimal})
            </div>
          </div>
          <div className={classes.infoItem}>
            <div className={classes.label}>Očekávaný výstup</div>
            <div className={classes.value}>{output}</div>
          </div>
          <div className={classes.infoItem}>
            <div className={classes.label}>Počet stavů</div>
            <div className={classes.value}>{machineInstance?.states.length ?? 0}</div>
          </div>
          <div className={classes.infoItem}>
            <div className={classes.label}>Počet pravidel</div>
            <div className={classes.value}>{machineInstance?.rules.length ?? 0}</div>
          </div>
          <div className={classes.infoItem}>
            <details>
              <summary className={classes.label}>Kód stroje</summary>
              <div className={classes.value}>
                <MachineEncoding encodedRules={encodedRules} />
              </div>
            </details>
          </div>
        </div>
      </div>

      <div className={classes.controls}>
        <button
          onClick={handleRun}
          disabled={isRunning}
          className={classes.runButton}
          title="Spustit simulaci"
        >
          {isRunning ? "…" : "▷"}
        </button>
        <button onClick={handleStep} disabled={isRunning || isEnd}>
          Další krok
        </button>
        {(isEnd || stepCounter > 0) && (
          <button onClick={handleReset} disabled={isRunning}>
            Reset
          </button>
        )}
      </div>

      <div className={classes.execution}>
        <div className={classes.stepInfo}>
          <div>
            <strong>Krok:</strong> {stepNumber}
          </div>
          <div>
            <strong>Stav:</strong> {currentState}
          </div>
          {isEnd && <div className={classes.finished}>✓ Hotovo</div>}
        </div>

        <div className={classes.tapes}>
          {tapes.map((tape, tapeIndex) => (
            <div key={tapeIndex} className={classes.tape}>
              <div className={classes.tapeLabel}>Páska {tapeIndex + 1}</div>
              <div className={classes.tapeContent}>
                {tape.slice(0, 50).map((symbol, symbolIndex) => (
                  <div
                    key={symbolIndex}
                    className={`${classes.cell} ${
                      symbolIndex === heads[tapeIndex] ? classes.head : ""
                    }`}
                  >
                    {symbol}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isFinished && !isRunning && (
        <div className={classes.result}>
          <strong>Simulace ukončena.</strong>
        </div>
      )}
    </div>
  );
};

export default App;
