import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class t_ongkos {
    @PrimaryColumn()
    public id: string;

    @Column({length:100, nullable:true})
    public id_pks: string;

    @Column({length:100, nullable:true})
    public id_kendaraan: string;

    @Column({length:100, nullable:true})
    public jenis_transaksi: string;

    @Column({length:100, nullable:true})
    public jenis_upah: string;

    @Column({length:100, nullable:true})
    public nominal: string;

    @Column()
    @CreateDateColumn()
    public created_at: Date;

    @Column()
    @UpdateDateColumn()
    public updated_at: Date;
}