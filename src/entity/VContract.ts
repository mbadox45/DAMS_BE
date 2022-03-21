import {ViewEntity, ViewColumn, Connection} from "typeorm";
import { t_averyweight } from "./Averyweight";
import { t_barang } from "./Barang";
import { t_contract } from "./Contract";
import { t_kendaraan } from "./Kendaraan";

@ViewEntity({
    expression: "SELECT t_contract.id_contract, t_contract.contract_no, t_contract.kode_barang, t_contract.contract_date, t_contract.order_quantity, (t_contract.order_quantity - COALESCE(( SELECT sum(t_averyweight.timbang_selisih) AS expr1 FROM t_averyweight WHERE ((t_averyweight.id_contract)::text = (t_contract.id_contract)::text) GROUP BY t_averyweight.id_contract), (0)::bigint)) AS timbang_selisih, t_barang.nama_barang, t_contract.penerima, t_contract.from_to, t_contract.pengirim, t_contract.note, t_contract.no_aju FROM (t_contract JOIN t_barang ON (((t_contract.kode_barang)::text = (t_barang.kode_barang)::text)))"
})

export class v_contract {
    @ViewColumn()
    public id_contract:string;

    @ViewColumn()
    public contract_no:string;

    @ViewColumn()
    public kode_barang:string;

    @ViewColumn()
    public contract_date:string;

    @ViewColumn()
    public order_quantity:number;

    @ViewColumn()
    public timbang_selisih:number;

    @ViewColumn()
    public nama_barang:string;

    @ViewColumn()
    public penerima:string;

    @ViewColumn()
    public pengirim:string;

    @ViewColumn()
    public from_to:string;

    @ViewColumn()
    public note:string;

    @ViewColumn()
    public no_aju:string;
}