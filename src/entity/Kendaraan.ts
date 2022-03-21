import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class t_kendaraan {
    @PrimaryColumn({length:36})
    public id_kendaraan: string;

    @Column({length:20, nullable:true})
    public no_kendaraan: string;
    
    @Column({length:10, nullable:true})
    public kode_angkutan: string;
    
    @Column({nullable:true})
    public tarra: number;
}