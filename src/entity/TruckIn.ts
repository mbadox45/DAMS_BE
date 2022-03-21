import {ViewEntity, ViewColumn, Connection} from "typeorm";
import { t_averyweight } from "./Averyweight";
import { t_barang } from "./Barang";
import { t_contract } from "./Contract";
import { t_kendaraan } from "./Kendaraan";

@ViewEntity({
    expression: (connection:Connection) => connection.createQueryBuilder()
        .select("aa.no_tiket", "no_tiket")
        .addSelect("cc.contract_no", "contract_no")
        .addSelect("b.nama_barang", "nama_barang")
        .addSelect("kk.no_kendaraan", "no_kendaraan")
        .addSelect("aa.status_truck", "status_truck")
        .addSelect("aa.status", "status")
        .addSelect("aa.user_delete", "user_delete")
        .from(t_averyweight,"aa")
        .innerJoin(t_contract,"cc","cc.id_contract = aa.id_contract")
        .innerJoin(t_barang,"b","b.kode_barang = cc.kode_barang")
        .innerJoin(t_kendaraan,"kk","kk.id_kendaraan = aa.id_kendaraan")
})
export class v_truckin {
    @ViewColumn()
    public no_tiket:string;

    @ViewColumn()
    public contract_no:string;

    @ViewColumn()
    public nama_barang:string;

    @ViewColumn()
    public no_kendaraan:string;

    @ViewColumn()
    public status_truck:number;

    @ViewColumn()
    public status:string;

    @ViewColumn()
    public user_delete:string;
}