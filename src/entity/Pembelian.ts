import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class t_pembelian {
    @PrimaryColumn()
    public no_tiket: string;

    @Column({length:100, nullable:true})
    public id_agen: string;

    @Column({nullable:true})
    public id_kendaraan: number;

    @Column({nullable:true, type:"date"})
    public tgl_transaksi: Date;

    @Column({length:100, nullable:true})
    public harga: string;

    // Timbangan Gudang
    @Column({length:100, nullable:true})
    public bruto: string;

    @Column({length:100, nullable:true})
    public tarra: string;

    @Column({length:100, nullable:true})
    public netto: string;

    @Column({length:100, nullable:true})
    public nilai_potongan: string;

    @Column({length:50, nullable:true})
    public pot: string;

    @Column({length:100, nullable:true})
    public pot_kg: string;

    @Column({length:100, nullable:true})
    public status: string;

    @Column({length:100, nullable:true})
    public jenis_buah: string;

    @Column({length:100, nullable:true})
    public usr_timbang1: string;

    @Column({length:100, nullable:true})
    public usr_timbang2: string;

    @Column({length:100, nullable:true})
    public usr_kasir: string;

    @Column({length:100, nullable:true})
    public jml_pembelian: string;

    @Column({nullable:true, type:"date"})
    public tgl_pelunasan: Date;

    @Column()
    @CreateDateColumn()
    public created_at: Date;

    @Column()
    @UpdateDateColumn()
    public updated_at: Date;
}