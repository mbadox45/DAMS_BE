import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class t_truksecurity {
    @PrimaryGeneratedColumn('increment')
    public id: number;

    @Column({length:15, nullable:true})
    public no_tiket: string;

    @Column({nullable:true})
    public no_locis: number;

    @Column({nullable:true})
    @CreateDateColumn()
    public waktu_masuktruk: Date;

    @Column({nullable:true})
    public waktu_keluartruk: Date;

    @Column({length:50, nullable:true})
    public petugas_checkin: string;

    @Column({length:50, nullable:true})
    public petugas_checkout: string;

    @Column({nullable:true})
    public no_urut: number;
}