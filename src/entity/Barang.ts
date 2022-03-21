import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class t_barang {
    @PrimaryColumn({length:50})
    public kode_barang: string;

    @Column({length:150, nullable:true})
    public nama_barang: string;
}