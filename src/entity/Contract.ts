import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class t_contract {

    @PrimaryColumn({length:36})
    public id_contract: string;

    @Column({length:50, nullable: true})
    public contract_no: string;

    @Column({length:50, nullable: true})
    public pengirim: string;

    @Column({length:50, nullable: true})
    public penerima: string;

    @Column({length:100, nullable: true})
    public from_to: string;

    @Column({length:50, nullable: true})
    public kode_barang: string;

    @Column({length:50, nullable: true})
    public contract_date: string;

    @Column({nullable: true})
    public order_quantity: number;

    @Column({length:255, nullable: true})
    public note: string;

    @Column({length:50, nullable: true})
    public no_aju: string;
}