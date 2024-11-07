import * as zod from 'zod'
import { useForm } from 'react-hook-form';

import styles, { FormContainer, MinutesAmountInput, TaskInput } from "./styles"
import { zodResolver } from '@hookform/resolvers/zod';


const newCycloFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number().min(5, "o ciclo precisa ser no mínimo 5 minutos").max(99, "o ciclo precisa ser no maximo 95 minutos")
})

type NewCycleFormData = zod.infer<typeof newCycloFormValidationSchema>

export function NewCycleForm() {
    

    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycloFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    });

    return (<FormContainer>
        <label> Vou trabalhar em</label>
        <TaskInput
            id="task"
            list="task-sugestions"
            placeholder="Dê um nome para seu projeto"
            disabled={!!activeCycle}
            {...register('task')}
        />

        <datalist id="task-sugestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
            <option value="Projeto 4" />
            <option value="Projeto 5" />
        </datalist>

        <label htmlFor="">durante</label>
        <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={5}
            max={95}
            disabled={!!activeCycle}
            {...register('minutesAmount', { valueAsNumber: true })}
        />

        <span>minutos.</span>
    </FormContainer>
    )
}