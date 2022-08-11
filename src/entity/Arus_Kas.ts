import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class t_arus_kas {
    @PrimaryColumn()
    public id: string;

    @Column({nullable:true, type:"date"})
    public tgl_transaksi: Date;

    @Column({length:50, nullable:true})
    public no_tiket: string;

    @Column({length:100, nullable:true})
    public jenis_transaksi: string;

    @Column({length:100, nullable:true})
    public jenis_kas: string;

    @Column({length:100, nullable:true})
    public status: string;

    @Column({length:100, nullable:true})
    public agen: string;

    @Column({length:200, nullable:true})
    public jumlah: string;

    @Column({length:200, nullable:true})
    public status_transaksi: string;

    @Column({length:200, nullable:true})
    public nominal: string;

    @Column({nullable:true, type:"text"})
    public keterangan: string;

    @Column()
    @CreateDateColumn()
    public created_at: Date;

    @Column()
    @UpdateDateColumn()
    public updated_at: Date;
}