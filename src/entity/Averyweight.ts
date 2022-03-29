import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class t_averyweight {
    @PrimaryColumn({length:15})
    public no_tiket: string;

    @Column({length:36})
    public id_kendaraan: string;

    @Column({length:50})
    public kode_barang: string;

    @Column({length:20})
    public nama_supir: string;

    @Column({length:255})
    public from_to: string;

    @Column({length:100, nullable:true})
    public quantity: string;

    @Column({length:36, nullable:true})
    public id_contract: string;

    @Column({length:255})
    public delivery_note: string;

    @Column({length:255})
    public delivery_order: string;

    @Column({length:10})
    public kode_angkutan: string;

    @Column({nullable:true})
    public timbang_1: number;

    @Column({nullable:true})
    public timbang_2: number;

    @Column({nullable:true})
    public timbang_selisih: number;

    @Column({length:10, nullable:true})
    public tarra_kendaraan: string;
    
    @Column({length:10, nullable:true})
    public tarra_sekarang: string;

    @Column({nullable:true})
    public tarra_rendah: number;

    @Column({nullable:true})
    public tarra_tinggi: number;

    @Column({length:50, nullable:true})
    public user_id: string;

    @Column({length:50, nullable:true})
    public user_id2: string;

    @Column({type:"date",nullable:true})
    public tgl_masuk: Date;

    @Column({length:50, nullable:true})
    public waktu_masuk: string;

    @Column({type:"date",nullable:true})
    public tgl_keluar: Date;

    @Column({length:50, nullable:true})
    public waktu_keluar: string;

    @Column({length:50, nullable:true})
    public waktu_edit: string;

    @Column({length:50, nullable:true})
    public user_edit: string;

    @Column({length:2, nullable:true})
    public status: string;

    @Column({length:50, nullable:true})
    public waktu_delete: string;

    @Column({length:50, nullable:true})
    public user_delete: string;

    @Column({length:20, nullable:true})
    public tgl_keluar_from: string;

    @Column({length:20, nullable:true})
    public tgl_masuk_truk: string;

    @Column({length:20, nullable:true})
    public tgl_keluar_truk: string;

    @Column({length:20, nullable:true})
    public lot_number: string;

    @Column({length:10, nullable:true})
    public qty_box: string;

    @Column({length:50, nullable:true})
    public nama_kendaraan: string;

    @Column({length:100, nullable:true})
    public asal_pks: string;

    @Column({length:10, nullable:true})
    public no_suratjalan: string;

    @Column({length:10, nullable:true})
    public bruto_from: string;

    @Column({length:10, nullable:true})
    public tarra_from: string;

    @Column({length:10, nullable:true})
    public netto_from: string;

    @Column({length:10, nullable:true})
    public selisih_netto: string;

    @Column({length:100, nullable:true})
    public selisih_netto_persen: string;

    @Column({length:10, nullable:true})
    public ffa_from: string;

    @Column({length:10, nullable:true})
    public m_i_from: string;

    @Column({length:10, nullable:true})
    public imp_from: string;

    @Column({length:10, nullable:true})
    public iv_from: string;

    @Column({length:10, nullable:true})
    public mpt_degree_from: string;

    @Column({length:100, nullable:true})
    public color_from: string;

    @Column({length:10, nullable:true})
    public ffa: string;

    @Column({length:10, nullable:true})
    public m_i: string;

    @Column({length:10, nullable:true})
    public imp: string;

    @Column({length:10, nullable:true})
    public iv: string;

    @Column({length:10, nullable:true})
    public mpt_degree: string;

    @Column({length:100, nullable:true})
    public color: string;

    @Column({length:10, nullable:true})
    public no_segel1: string;

    @Column({length:10, nullable:true})
    public no_segel2: string;

    @Column({length:10, nullable:true})
    public no_segel3: string;

    @Column({length:50, nullable:true})
    public no_aju: string;

    @Column({length:12, nullable:true})
    public no_container: string;

    @Column({type:"timestamp",nullable:true})
    public created_at: Date;

    @Column({nullable:true})
    public status_truck: number;
}