import {ViewEntity, ViewColumn, Connection} from "typeorm";
import { t_angkutan } from "./Angkutan";
import { t_kendaraan } from "./Kendaraan";

@ViewEntity({
    expression: (connection:Connection) => connection.createQueryBuilder()
        .select("k.id_kendaraan", "id_kendaraan")
        .addSelect("k.no_kendaraan", "no_kendaraan")
        .addSelect("k.tarra", "tarra")
        .addSelect("a.nama_angkutan", "nama_angkutan")
        .from(t_kendaraan,"k")
        .innerJoin(t_angkutan,"a","a.kode_angkutan = k.kode_angkutan")
})
export class v_kendaraan {
    @ViewColumn()
    public id_kendaraan:string;

    @ViewColumn()
    public no_kendaraan:string;

    @ViewColumn()
    public tarra:string;

    @ViewColumn()
    public nama_angkutan:string;
}