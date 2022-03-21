import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class t_angkutan {
    @PrimaryColumn({length:10})
    public kode_angkutan: string;

    @Column({length:50, nullable:true})
    public nama_angkutan: string;
}