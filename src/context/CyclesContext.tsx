import { differenceInSeconds } from "date-fns";
import { createContext, ReactNode, useEffect, useReducer, useState } from "react";
import { json } from "react-router-dom";

interface CreateCycleData {
    task: string;
    minutesAmount: number;
}

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptDate?: Date;
    finishedDate?: Date;
}

interface CyclesContextType {
    cycles: Cycle[];
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    markCurrentCycleAsFinished: () => void;
    amountSecondsPassed: number;
    setSecondsPassed: (seconds: number) => void;
    CreateNewCycle: (data: CreateCycleData) => void;
    InterruptCurrentCycle: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

interface CyclesContextProviderProps {
    children: ReactNode;
}

interface CyclesState {
    cycles: Cycle[];
    activeCycleId: string | null;
}

type CycleAction =
    | { type: 'ADD_NEW_CYCLE'; payload: { newCycle: Cycle; newCycleId: string } }
    | { type: 'INTERRUPT_CURRENT_CYCLE' }
    | { type: 'MARK_CURRENT_CYCLE_AS_FINISHED'; payload: { activeCycleId: string | null } };

function cyclesReducer(state: CyclesState, action: CycleAction): CyclesState {
    switch (action.type) {
        case 'ADD_NEW_CYCLE':
            return {
                ...state,
                cycles: [...state.cycles, action.payload.newCycle],
                activeCycleId: action.payload.newCycleId,
            };
        case 'INTERRUPT_CURRENT_CYCLE':
            return {
                ...state,
                cycles: state.cycles.map((cycle) =>
                    cycle.id === state.activeCycleId ? { ...cycle, interruptDate: new Date() } : cycle
                ),
                activeCycleId: null,
            };
        case 'MARK_CURRENT_CYCLE_AS_FINISHED':
            return {
                ...state,
                cycles: state.cycles.map((cycle) =>
                    cycle.id === state.activeCycleId ? { ...cycle, finishedDate: new Date() } : cycle
                ),
                activeCycleId: null,
            };
        default:
            return state;
    }
}

export function CyclesContextProvider({ children, }: CyclesContextProviderProps): JSX.Element {
    const [cyclesState, dispatch] = useReducer(cyclesReducer, {
        cycles: [],
        activeCycleId: null,
    }, (initialState) => {
        const storageStateJSON = localStorage.getItem('@ignite-time:cycles-state-1.0.0');

        if(storageStateJSON){
            return JSON.parse(storageStateJSON)
        }

        return initialState
    });

    const { cycles, activeCycleId } = cyclesState;
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
        if(activeCycle){
            return differenceInSeconds(
                new Date(), 
                new Date(activeCycle.startDate),
            )
        }

        return  0
    });

    useEffect(() => {
        const stateJSON = JSON.stringify(cyclesState)

        localStorage.setItem('@ignite-time:cycles-state-1.0.0', stateJSON)
    }, [cyclesState])

    


    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds);
    }

    function markCurrentCycleAsFinished() {
        dispatch({
            type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
            payload: {
                activeCycleId,
            },
        });
    }

    function CreateNewCycle(data: CreateCycleData) {
        const id = String(new Date().getTime());

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        };

        dispatch({
            type: 'ADD_NEW_CYCLE',
            payload: {
                newCycle,
                newCycleId: id,
            },
        });

        setAmountSecondsPassed(0);
    }

    function InterruptCurrentCycle() {
        dispatch({
            type: 'INTERRUPT_CURRENT_CYCLE',
        });
    }

    return (
        <CyclesContext.Provider
            value={{
                cycles,
                activeCycle,
                activeCycleId,
                markCurrentCycleAsFinished,
                amountSecondsPassed,
                setSecondsPassed,
                CreateNewCycle,
                InterruptCurrentCycle,
            }}
        >
            {children}
        </CyclesContext.Provider>
    );
}
