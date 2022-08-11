import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class t_harga {
    @PrimaryColumn()
    public id: string;

    @Column({nullable:true, type:"date"})
    public tgl: Date;

    @Column({nullable:true})
    public harga: number;

    @Column({nullable:true, length:100})
    public jenis_transaksi: string;

    @Column({nullable:true, length:100})
    public id_pks: string;

    @Column({nullable:true, length:100})
    public jenis_buah: string;

    @Column()
    @CreateDateColumn()
    public created_at: Date;

    @Column()
    @UpdateDateColumn()
    public updated_at: Date;
}