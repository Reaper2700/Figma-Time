import { HandPalm, Play } from "phosphor-react";
import { zodResolver } from "@hookform/resolvers/zod"
import zod, { string } from "zod"
import { useForm } from "react-hook-form";
import { createContext, useEffect, useState } from "react";
import { differenceInSeconds, min, startOfDay } from "date-fns";
import { NewCycleForm } from "./componentes/newCycleForm";
import { Countdown } from "./componentes/countdown";

import { HomeContainer, StartCountDownButton, StopCountDownButton } from "./styles";


interface Cycle {
    id: string,
    task: string,
    minutesAmount: number
    startDate: Date
    interruptDate?: Date
    finishedDate?: Date
}

interface CyclesContextType {
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    markCurrentCycleAsFinished: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

    const activeCycle = cycles.find(cycles => cycles.id == activeCycleId)

    function markCurrentCycleAsFinished() {
        setCycles((state) => state.map((cycle) => {
            if (cycle.id == activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
            } else {
                return cycle;
            }
        })
        )

    }

    function handleCreateNewCiclo(data: NewCycleFormData) {
        const id = String(new Date().getTime())

        const newCyclo: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        setCycles((state) => [...state, newCyclo])
        setActiveCycleId(id)
        setAmountSecondsPassed(0)

        reset();
    }

    function handleInterruptCycle() {
        setCycles((state) => state.map((cycle) => {
            if (cycle.id == activeCycleId) {
                return { ...cycle, interruptDate: new Date() }
            } else {
                return cycle;
            }
        })
        )
        setActiveCycleId(null)
    }

    

    const task = watch('task')
    const isSubmitDisabled = !task;

    console.log(cycles)
    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCiclo)} action="">
                <CyclesContext.Provider value={{activeCycle, activeCycleId, markCurrentCycleAsFinished}}>
                    <NewCycleForm />
                    <Countdown />
                </CyclesContext.Provider>
                {activeCycle ? (
                    <StopCountDownButton onClick={handleInterruptCycle} type="button">
                        <HandPalm size={24} />
                        Interromper
                    </StopCountDownButton>
                ) : (<StartCountDownButton disabled={isSubmitDisabled} type="submit">
                    <Play size={24} />
                    Começar
                </StartCountDownButton>)}
            </form>
        </HomeContainer>
    )
}