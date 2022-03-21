import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class t_jenis {
    @PrimaryGeneratedColumn('increment')
    public id: number;

    @Column({length:15, nullable:true})
    public no_tiket: string;

    @Column({length:50, nullable:true})
    public user_id: string;

    @Column({nullable:true})
    @CreateDateColumn()
    public created_at: Date;

    @Column({length:50, nullable:true})
    public status: string;

    @Column({length:255, nullable:true})
    public keterangan: string;
}