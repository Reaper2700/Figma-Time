import { HistoryContainer, HistoryList, Status } from "./styles";

export function History() {
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
                        <tr>
                            <td>Tarefa</td>
                            <td>Duração</td>
                            <td>há 2 meses</td>
                            <td>
                                <Status statusColor="Red">Concluido</Status>
                            </td>
                        </tr>
                        <tr>
                            <td>Tarefa</td>
                            <td>Duração</td>
                            <td>há 2 meses</td>
                            <td>
                                <Status statusColor="Green">Concluido</Status>
                            </td>
                        </tr>
                        <tr>
                            <td>Tarefa</td>
                            <td>Duração</td>
                            <td>há 2 meses</td>
                            <td>
                                <Status statusColor="Green">Concluido</Status>
                            </td>
                        </tr>
                        <tr>
                            <td>Tarefa</td>
                            <td>Duração</td>
                            <td>há 2 meses</td>
                            <td>
                                <Status statusColor="Green">Concluido</Status>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </HistoryList>
        </HistoryContainer>
    )
}