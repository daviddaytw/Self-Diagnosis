import axios from 'axios'
import { AppDataSource } from '../data-source'
import { Received } from '../entity/Received'
import { Sent } from '../entity/Sent'
import { Session } from '../entity/Session'
import { User } from '../entity/User'
import { TranslationHandler } from './TranslationHandler'

export class BaseHandler {
  protected user: User
  protected session: Session | null

  constructor (user: User) {
    this.user = user
  }

  private async setSession (): Promise<void> {
    this.session = await AppDataSource.getRepository(Session).findOne({
      where: {
        user: {
          psid: this.user.psid
        },
        expired: false
      },
      relations: {
        sents: true,
        receiveds: true
      },
      order: {
        id: 'DESC',
        sents: {
          id: 'ASC'
        },
        receiveds: {
          id: 'ASC'
        }
      }
    })
  }

  protected async openSession (): Promise<void> {
    await this.closeSession()

    this.session = await AppDataSource.getRepository(Session).save({
      user: this.user
    })
  }

  protected async closeSession (): Promise<void> {
    // Close all sessions.
    await AppDataSource.getRepository(Session).update({
      user: this.user,
      expired: false
    }, {
      expired: true
    })
  }

  protected async handle (text: string): Promise<void> {
    await this.setSession()

    await AppDataSource.getRepository(Received).save({
      text,
      user: this.user,
      session: this.session
    })

    // Set the session again with the added received.
    await this.setSession()
  }

  private async send (type: string, payload): Promise<void> {
    // The page access token we have generated in your app settings
    const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN ?? ''

    // Send the HTTP request to the Messenger Platform
    console.log('Sending payload: ', payload)
    axios.post(`https://graph.facebook.com/v2.6/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, payload)
      .then((res) => {
        console.log('Message sent!')
      }).catch((err) => {
        console.error('Unable to send message:', err)
      })

    await AppDataSource.getRepository(Sent).save({
      type,
      text: JSON.stringify(payload.message),
      user: this.user,
      session: this.session
    })
  }

  protected async sendText (type: string, response: string): Promise<void> {
    await this.send(type, {
      recipient: {
        id: this.user.psid
      },
      message: {
        text: await TranslationHandler.translate(response, this.user)
      }
    })
  }

  protected async sendOptions (type: string, title: string, options: string[]): Promise<void> {
    await this.send(type, {
      recipient: {
        id: this.user.psid
      },
      messaging_type: 'RESPONSE',
      message: {
        text: await TranslationHandler.translate(title, this.user),
        quick_replies: await Promise.all(
          options.map(async (text) => ({
            content_type: 'text',
            title: await TranslationHandler.translate(text, this.user),
            payload: await TranslationHandler.translate(text, this.user)
          }))
        )
      }
    })
  }

}
