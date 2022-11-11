import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class t_panjar_piutang {
    @PrimaryColumn()
    public id_panjar: string;

    @Column({nullable:true, type:"date"})
    public tgl_transaksi: Date;

    @Column({length:100, nullable:true})
    public jenis_kas: string;

    @Column({length:100, nullable:true})
    public jenis_transaksi: string;

    @Column({nullable:true})
    public jumlah: number;

    @Column({length:100, nullable:true})
    public id_agen: string;

    @Column({nullable:true, type:"text"})
    public keterangan: string;

    @Column()
    @CreateDateColumn()
    public created_at: Date;

    @Column()
    @UpdateDateColumn()
    public updated_at: Date;
}