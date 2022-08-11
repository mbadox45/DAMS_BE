import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class t_master_transaksi {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({length:100, nullable:true})
    public nama_transaksi: string;
    
    @Column()
    @CreateDateColumn()
    public createdAt: Date;

    @Column()
    @UpdateDateColumn()
    public updatedAt: Date;
}