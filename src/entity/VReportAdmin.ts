import {ViewEntity, ViewColumn, Connection} from "typeorm";

@ViewEntity({
    expression: 'SELECT t_truksecurity.id, t_truksecurity.no_urut, t_averyweight.no_tiket, t_truksecurity.waktu_masuktruk, t_truksecurity.waktu_keluartruk, t_kendaraan.no_kendaraan, t_averyweight.from_to, t_averyweight.delivery_order, t_contract.contract_no, t_truksecurity.no_locis, t_averyweight.timbang_1, t_averyweight.timbang_2, t_averyweight.timbang_selisih, t_averyweight.netto_from, t_averyweight.nama_supir, t_truksecurity.petugas_checkin, t_truksecurity.petugas_checkout, t_barang.nama_barang, t_averyweight.selisih_netto FROM ((((t_averyweight JOIN t_barang ON (((t_averyweight.kode_barang)::text = (t_barang.kode_barang)::text))) JOIN t_contract ON ((((t_averyweight.id_contract)::text = (t_contract.id_contract)::text) AND ((t_barang.kode_barang)::text = (t_contract.kode_barang)::text)))) JOIN t_kendaraan ON (((t_averyweight.id_kendaraan)::text = (t_kendaraan.id_kendaraan)::text))) JOIN t_truksecurity ON (((t_averyweight.no_tiket)::text = (t_truksecurity.no_tiket)::text)));'
})
export class v_reportsecurity {
    @ViewColumn()
    public id:number;

    @ViewColumn()
    public no_urut:number;

    @ViewColumn()
    public no_tiket:string;

    @ViewColumn()
    public waktu_masuktruk:Date;

    @ViewColumn()
    public waktu_keluartruk:Date;

    @ViewColumn()
    public no_kendaraan:string;

    @ViewColumn()
    public from_to:string;

    @ViewColumn()
    public delivery_order:string;

    @ViewColumn()
    public contract_no:string;

    @ViewColumn()
    public no_locis:number;

    @ViewColumn()
    public timbang_1:number;

    @ViewColumn()
    public timbang_2:number;

    @ViewColumn()
    public timbang_selisih:number;

    @ViewColumn()
    public netto_from:string;

    @ViewColumn()
    public nama_supir:string;

    @ViewColumn()
    public petugas_checkin:string;

    @ViewColumn()
    public petugas_checkout:string;

    @ViewColumn()
    public nama_barang:string;

    @ViewColumn()
    public selisih_netto:string;
}