import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class t_pks {
    @PrimaryColumn()
    public id: string;

    @Column({length:100, nullable:true})
    public nama_pks: string;

    @Column({nullable:true, type:"text"})
    public alamat: string;

    @Column({length:50, nullable:true})
    public notelp: string;

    @Column()
    @CreateDateColumn()
    public created_at: Date;

    @Column()
    @UpdateDateColumn()
    public updated_at: Date;
}