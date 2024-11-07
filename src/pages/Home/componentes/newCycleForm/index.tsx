import styles, { FormContainer, MinutesAmountInput, TaskInput } from "./styles"

export function NewCycleForm() {
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