import { CountdownContainer, Separator } from "./styles";
import { minutes, seconds } from "../../index"

export function Countdown(minutes:string, seconds:string) {
    return (
    <CountdownContainer>
        <span>{minutes[0]}</span>
        <span>{minutes[1]}</span>
        <Separator>:</Separator>
        <span>{seconds[0]}</span>
        <span>{seconds[1]}</span>
    </CountdownContainer>
    )
}