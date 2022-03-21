import {ViewEntity, ViewColumn, Connection} from "typeorm";
import { t_averyweight } from "./Averyweight";

@ViewEntity({
    expression: `
        SELECT COUNT(*) AS total FROM t_averyweight 
        WHERE (EXTRACT(month FROM t_averyweight.tgl_masuk) = EXTRACT(month FROM now()));
    `
})
export class v_counttikets {
    @ViewColumn()
    public total:number;
}
