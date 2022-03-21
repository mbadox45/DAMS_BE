import {ViewEntity, ViewColumn, Connection} from "typeorm";
import { t_averyweight } from "./Averyweight";
@ViewEntity({
    expression: 'SELECT MAX(no_tiket) AS ticket_max FROM t_averyweight;'
})
export class v_tiketmax {
    @ViewColumn()
    public ticket_max:string;
}