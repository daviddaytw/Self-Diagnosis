import { Entity, PrimaryColumn, CreateDateColumn, OneToMany } from 'typeorm'
import { Received } from './Received'
import { Sent } from './Sent'
import { Session } from './Session'

@Entity()
export class User {
  @PrimaryColumn()
    psid: string

  @OneToMany(() => Session, (session) => session.user)
    sessions: Session[]

  @OneToMany(() => Sent, (sent) => sent.user)
    sents: Sent[]

  @OneToMany(() => Received, (received) => received.user)
    receiveds: Received[]

  @CreateDateColumn()
    created_at: Date
}
