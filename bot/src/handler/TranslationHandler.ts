import axios from 'axios'
import translatte from 'translatte'
import { AppDataSource } from '../data-source'
import { Translation } from '../entity/Translation'
import { User } from '../entity/User'

export class TranslationHandler {

  private static async requestLocale (user: User): Promise<string> {
    // The page access token we have generated in your app settings
    const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN

    // Send the HTTP request to the Messenger Platform
    const res = await axios.get(`https://graph.facebook.com/${user.psid}?fields=locale&access_token=${PAGE_ACCESS_TOKEN}`)

    // Use default if can not get locale.
    if( res == undefined ) {
      return 'default'
    }

    return res.data.locale
  }

  private static cleanLocaleString(locale: string): string {
    locale = locale.replace('_', '-')
    if( locale.slice(0, 2) != 'zh' ) {
      locale = locale.slice(0, 2)
    }
    return locale
  }

  static async translate (text: string, locale: string | User): Promise<string> {
    if (typeof locale != 'string') {
      locale = await this.requestLocale(locale)
    }

    const repository = AppDataSource.getRepository(Translation)

    if (locale === 'default') return text

    locale = this.cleanLocaleString(locale)
    let translation = await repository.findOneBy({
       original: text,
      locale
    })

    if (!translation) {
      const res = await translatte(text, { from: 'en', to: locale })
      translation = await repository.save({
        original: text,
        native: res.text,
        locale
      })
    }

    return translation.native
  }

  static async revert (text: string): Promise<string> {
    const repository = AppDataSource.getRepository(Translation)
    const translation = await repository.findOneBy({ native: text })
    if( translation == null ) return text
    else return translation.original
  }
}
