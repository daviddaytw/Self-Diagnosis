import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Translation {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    original: string

    @Column()
    native: string

    @Column()
    locale: string
}
