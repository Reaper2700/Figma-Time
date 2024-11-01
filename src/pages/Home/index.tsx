import { Play } from "phosphor-react";
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartcountdownButton, TaskInput } from "./styles";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function Home() {
    const { register, handleSubmit, watch } = useForm();

    function handleCreateNewCiclo(data: unknown){
        console.log(data);
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