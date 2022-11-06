import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm'
import { Session } from './Session'
import { User } from './User'

@Entity()
export class Received {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    text: string

  @ManyToOne(() => User, (user) => user.receiveds)
    user: User

  @ManyToOne(() => Session, (session) => session.receiveds)
    session: Session

  @CreateDateColumn()
    created_at: Date
}
