import { HandPalm, Play } from "phosphor-react";
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCountDownButton, StartcountdownButton, StopCountDownButton, TaskInput } from "./styles";
import { zodResolver } from "@hookform/resolvers/zod"
import zod, { string } from "zod"
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { differenceInSeconds, min, startOfDay } from "date-fns";
import { NewCycleForm } from "./newCycleForm";
import { Countdown } from "./countdown";

const newCycloFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number().min(5, "o ciclo precisa ser no mínimo 5 minutos").max(99, "o ciclo precisa ser no maximo 95 minutos")
})

// interface NewCycleFormData{
//     task:  string
//     minutesAmount: number
// }

type NewCycleFormData = zod.infer<typeof newCycloFormValidationSchema>

interface Cycle {
    id: string,
    task: string,
    minutesAmount: number
    startDate: Date
    interruptDate?: Date
    finishedDate?: Date
}

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycloFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    });

    const activeCycle = cycles.find(cycles => cycles.id == activeCycleId)

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

    useEffect(() => {
        let interval: number

        if (activeCycle) {
            interval = setInterval(() => {
                const secondsDifference = differenceInSeconds(new Date(), activeCycle.startDate);

                if (secondsDifference >= totalSeconds) {
                    setCycles((state) => state.map((cycle) => {
                        if (cycle.id == activeCycleId) {
                            return { ...cycle, finishedDate: new Date() }
                        } else {
                            return cycle;
                        }
                    })
                    )
                    setAmountSecondsPassed(totalSeconds)
                    clearInterval(interval)
                } else {
                    setAmountSecondsPassed(secondsDifference)
                }
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }

    }, [activeCycle, totalSeconds, activeCycleId])

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

    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

    const minutesAmount = Math.floor(currentSeconds / 60);
    const secondsAmount = currentSeconds % 60;

    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')

    useEffect(() => {
        if (activeCycle) {
            document.title = `${minutes}:${seconds}`
        }
    }, [minutes, seconds, activeCycle])

    const task = watch('task')
    const isSubmitDisabled = !task;

    console.log(cycles)
    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCiclo)} action="">

                <NewCycleForm/>
                <Countdown/>

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