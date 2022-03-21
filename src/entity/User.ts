import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class t_akun {
    @PrimaryGeneratedColumn('increment')
    public id: number;

    @Column({nullable: true})
    public name: string;

    @Column({nullable: true})
    public jabatan: string;

    @Column({nullable: true})
    public username: string;

    @Column({nullable: true})
    public password: string;

    @Column({nullable: true})
    public email: string;

    @Column({nullable: true})
    public roles: string;

    @Column({nullable: true})
    public active: boolean;

    @Column()
    @CreateDateColumn()
    public createdAt: Date;

    @Column()
    @UpdateDateColumn()
    public updatedAt: Date;

}