import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm'
import { Received } from './Received'
import { Sent } from './Sent'
import { User } from './User'

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
    id: number

  @Column({ default: false })
    expired: boolean

  @ManyToOne(() => User, (user) => user.sessions)
    user: User

  @OneToMany(() => Sent, (sent) => sent.session)
    sents: Sent[]

  @OneToMany(() => Received, (received) => received.session)
    receiveds: Received[]

  @CreateDateColumn()
    created_at: Date
}
