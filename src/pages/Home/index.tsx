import { Play } from "phosphor-react";
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartcountdownButton, TaskInput } from "./styles";
import { zodResolver } from "@hookform/resolvers/zod"
import zod from "zod"
import { useForm } from "react-hook-form";
import { useState } from "react";


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
}

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId]= useState<string | null>(null)


    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycloFormValidationSchema),
        defaultValues:{
            task:'',
            minutesAmount:0,
        }
    });

    function handleCreateNewCiclo(data: NewCycleFormData){
        const newCyclo:Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount
        }

        setCycles ((state) => [...state, newCyclo])
        
        reset();
    }

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
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>
                </CountdownContainer>

                <StartcountdownButton disabled={isSubmitDisabled} type="submit">
                    <Play size={24}/>
                    Começar 
                </StartcountdownButton  >
            </form>
        </HomeContainer>
    )
}