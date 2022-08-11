import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class t_transaksi {
    @PrimaryColumn()
    public id: string;

    @Column({length:100, nullable:true})
    public jenis_transaksi: string;
    
    @Column({length:100, nullable:true})
    public jenis_kas: string;

    @Column()
    @CreateDateColumn()
    public createdAt: Date;

    @Column()
    @UpdateDateColumn()
    public updatedAt: Date;
}