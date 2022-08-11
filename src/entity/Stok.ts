import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class t_stok {
    @PrimaryGeneratedColumn('increment')
    public id: number;

    @Column({nullable:true, type:"date"})
    public tgl_transaksi: Date;

    @Column({length:50, nullable:true})
    public no_tiket: string;

    @Column({length:50, nullable:true})
    public jenis: string;

    @Column({length:100, nullable:true})
    public transaksi: string;

    @Column({length:100, nullable:true})
    public tonase: string;

    @Column({length:100, nullable:true})
    public harga: string;

    @Column({length:100, nullable:true})
    public jumlah: string;

    @Column({nullable:true})
    @CreateDateColumn()
    public created_at: Date;

    @Column({length:50, nullable:true})
    public status: string;
}