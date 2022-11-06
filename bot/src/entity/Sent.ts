import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm'
import { Session } from './Session'
import { User } from './User'

@Entity()
export class Sent {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    type: string

  @Column()
    text: string

  @ManyToOne(() => User, (user) => user.sents)
    user: User

  @ManyToOne(() => Session, (session) => session.sents)
    session: Session

  @CreateDateColumn()
    created_at: Date
}
