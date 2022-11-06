import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Received } from './entity/Received'
import { Sent } from './entity/Sent'
import { Session } from './entity/Session'
import { Translation } from './entity/Translation'
import { User } from './entity/User'

export const AppDataSource = new DataSource({
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [User, Session, Received, Sent, Translation],
  migrations: [],
  subscribers: []
})
