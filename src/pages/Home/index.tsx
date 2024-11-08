import { HandPalm, Play } from "phosphor-react";
import { zodResolver } from "@hookform/resolvers/zod"
import zod from "zod"
import { FormProvider, useForm } from "react-hook-form";
import { createContext, useState } from "react";
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
    amountSecondsPassed: number
    setSecondsPassed: (seconds: number) => void
}

export const CyclesContext = createContext({} as CyclesContextType)

const newCycloFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number().min(5, "o ciclo precisa ser no mínimo 5 minutos").max(99, "o ciclo precisa ser no maximo 95 minutos")
})

type NewCycleFormData = zod.infer<typeof newCycloFormValidationSchema>

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycloFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    });

    const { handleSubmit, watch, reset } = newCycleForm


    const activeCycle = cycles.find(cycles => cycles.id == activeCycleId)

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

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
                <CyclesContext.Provider value={{
                    activeCycle,
                    activeCycleId,
                    markCurrentCycleAsFinished,
                    amountSecondsPassed,
                    setSecondsPassed
                }}>
                    <FormProvider {...newCycleForm}>
                        <NewCycleForm />
                    </FormProvider>
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