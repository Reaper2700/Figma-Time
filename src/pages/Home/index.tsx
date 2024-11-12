import { HandPalm, Play } from "phosphor-react";
import { zodResolver } from "@hookform/resolvers/zod";
import zod from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { useContext } from "react";
import { NewCycleForm } from "./componentes/newCycleForm";
import { Countdown } from "./componentes/countdown";
import { HomeContainer, StartCountDownButton, StopCountDownButton } from "./styles";
import { CyclesContext } from "../../context/CyclesContext";


const newCycloFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.
        number().
        min(5, "O ciclo precisa ser no mínimo 5 minutos").
        max(95, "O ciclo precisa ser no máximo 95 minutos")
});


type NewCycleFormData = zod.infer<typeof newCycloFormValidationSchema>;

export function Home() {
    const { activeCycle, CreateNewCycle, InterruptCurrentCycle } = useContext(CyclesContext)

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycloFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    });

    const { handleSubmit, watch } = newCycleForm;

    const task = watch('task');
    const isSubmitDisabled = !task;

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(CreateNewCycle)} action="">
                <FormProvider {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>
                <Countdown />

                {activeCycle ? (
                    <StopCountDownButton onClick={InterruptCurrentCycle} type="button">
                        <HandPalm size={24} />
                        Interromper
                    </StopCountDownButton>
                ) : (
                    <StartCountDownButton disabled={isSubmitDisabled} type="submit">
                        <Play size={24} />
                        Começar
                    </StartCountDownButton>
                )}
            </form>
        </HomeContainer>
    );
}
