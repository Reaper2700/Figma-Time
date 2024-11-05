import { Play } from "phosphor-react";
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartcountdownButton, TaskInput } from "./styles";
import { zodResolver } from "@hookform/resolvers/zod"
import zod, { string } from "zod"
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { differenceInSeconds, startOfDay } from "date-fns";

const newCycloFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number().min(5,"o ciclo precisa ser no mínimo 5 minutos").max(99,"o ciclo precisa ser no maximo 95 minutos")
})

// interface NewCycleFormData{
//     task:  string
//     minutesAmount: number
// }

type NewCycleFormData = zod.infer<typeof newCycloFormValidationSchema>

interface Cycle{
    id: string,
    task:  string,
    minutesAmount: number
    startDate: Date
}

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId]= useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycloFormValidationSchema),
        defaultValues:{
            task:'',
            minutesAmount:0,
        }
    });

    const activeCycle = cycles.find( cycles => cycles.id == activeCycleId)

    useEffect(() => {
        if(activeCycle){
            setInterval(() => {
                setAmountSecondsPassed(differenceInSeconds(new Date(), activeCycle.startDate),)
            }, 1000)
        }
    }, [activeCycle])

    function handleCreateNewCiclo(data: NewCycleFormData){
        const id = String(new Date().getTime())
        
        const newCyclo:Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        setCycles ((state) => [...state, newCyclo])
        setActiveCycleId(id)
        
        reset();
    }

    

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0
    
    const minutesAmount = Math.floor(currentSeconds / 60);
    const secondsAmount = currentSeconds % 60;

    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')


    const task = watch('task')
    const isSubmitDisabled = !task;

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCiclo)} action="">
                <FormContainer>
                    <label> Vou trabalhar em</label>
                    <TaskInput 
                    id="task" 
                    list="task-sugestions"
                    placeholder="Dê um nome para seu projeto"
                    {...register('task')}
                    />

                    <datalist id="task-sugestions">
                        <option value="Projeto 1"/>
                        <option value="Projeto 2"/>
                        <option value="Projeto 3"/>
                        <option value="Projeto 4"/>
                        <option value="Projeto 5"/>
                    </datalist>

                    <label htmlFor="">durante</label>
                    <MinutesAmountInput 
                    type="number" 
                    id="minutesAmount" 
                    placeholder="00" 
                    step={5}
                    min={5}
                    max={95}
                    {...register('minutesAmount', {valueAsNumber: true})}
                    />

                    <span>minutos.</span>
                </FormContainer>

                <CountdownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountdownContainer>

                <StartcountdownButton disabled={isSubmitDisabled} type="submit">
                    <Play size={24}/>
                    Começar 
                </StartcountdownButton  >
            </form>
        </HomeContainer>
    )
}