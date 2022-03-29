import {ViewEntity, ViewColumn, Connection} from "typeorm";
import { t_averyweight } from "./Averyweight";
@ViewEntity({
    expression: "SELECT COALESCE(MAX(no_tiket),'0') AS ticket_max FROM t_averyweight;"
})
export class v_tiketmax {
    @ViewColumn()
    public ticket_max:string;
}