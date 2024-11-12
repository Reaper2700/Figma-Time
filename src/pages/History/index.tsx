import { useContext } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { HistoryContainer, HistoryList, Status } from "./styles";
import { CyclesContext } from "../../context/CyclesContext";


export function History() {
    const { cycles } = useContext(CyclesContext);
    console.log("Cycles in History component:", cycles);

    return (
        <HistoryContainer>
            <h1>Meu histórico</h1>

            <HistoryList>
                <table>
                    <thead>
                        <tr>
                            <th>Tarefa</th>
                            <th>Duração</th>
                            <th>Início</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cycles?.map((cycle) => {
                            return (
                                <tr key={cycle.id}>
                                    <td>{cycle.task}</td>
                                    <td>{cycle.minutesAmount} minutos</td>
                                    <td>
                                        {formatDistanceToNow(cycle.startDate,{
                                            addSuffix: true,
                                            locale: ptBR,
                                        })}
                                    </td>
                                    <td>
                                        {cycle.finishedDate && (
                                            <Status statusColor="Green">Concluído</Status>
                                        )}
                                        {cycle.interruptDate && (
                                            <Status statusColor="Red">Interrompido</Status>
                                        )}
                                        {!cycle.interruptDate && !cycle.finishedDate && (
                                            <Status statusColor="yellow">Em andamento</Status>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </HistoryList>
        </HistoryContainer>
    );
}
