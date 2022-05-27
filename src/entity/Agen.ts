import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class t_agen {
    @PrimaryColumn({length:50})
    public id_agen: string;

    @Column({length:100, nullable:true})
    public nama_agen: string;

    @Column({nullable:true, type:"text"})
    public alamat: string;

    @Column({length:50, nullable:true})
    public notelp: string;

    @Column({length:100, nullable:true})
    public img: string;
}