import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class t_pajak {
    @PrimaryColumn()
    public tgl: Date;

    @Column({nullable:true})
    public nilai_pajak: number;
}