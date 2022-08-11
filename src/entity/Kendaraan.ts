import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class t_kendaraan {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({length:100, nullable:true})
    public no_kendaraan: string;
    
}