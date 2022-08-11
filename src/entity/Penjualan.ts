import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class t_penjualan {
    @PrimaryColumn()
    public no_tiket: string;

    @Column({length:100, nullable:true})
    public id_pks: string;

    @Column({nullable:true})
    public id_kendaraan: number;

    @Column({nullable:true, type:"date"})
    public tgl_transaksi: Date;

    @Column({length:100, nullable:true})
    public harga: string;

    @Column({length:100, nullable:true})
    public ongkos_motor: string;

    @Column({length:100, nullable:true})
    public ongkos_bongkar: string;

    // Timbangan Gudang
    @Column({length:100, nullable:true})
    public bruto: string;

    @Column({length:100, nullable:true})
    public tarra: string;

    @Column({length:100, nullable:true})
    public netto: string;
    // =================================

    // Timbangan PKS
    @Column({length:100, nullable:true})
    public bruto_pks: string;

    @Column({length:100, nullable:true})
    public tarra_pks: string;

    @Column({length:100, nullable:true})
    public netto_pks: string;
    // =================================

    @Column({length:100, nullable:true})
    public kenaikan_tonase: string;

    @Column({length:100, nullable:true})
    public buah_pulang: string;

    // Pajak
    @Column({length:100, nullable:true})
    public nilai_pajak: string;
    // =================================

    @Column({length:100, nullable:true})
    public status: string;

    @Column({length:100, nullable:true})
    public jenis_buah: string;

    @Column({length:100, nullable:true})
    public usr_timbang1: string;

    @Column({length:100, nullable:true})
    public usr_timbang2: string;

    @Column({length:100, nullable:true})
    public usr_timbang3: string;

    @Column({length:100, nullable:true})
    public usr_kasir: string;

    @Column({length:100, nullable:true})
    public jml_penjualan: string;

    @Column({length:100, nullable:true})
    public jml_pembayaran: string;

    @Column({nullable:true, type:"date"})
    public tgl_pelunasan: Date;

    @Column()
    @CreateDateColumn()
    public created_at: Date;

    @Column()
    @UpdateDateColumn()
    public updated_at: Date;
}