import * as dotenv from 'dotenv'
dotenv.config()
import axios from 'axios'
import { AppDataSource } from './data-source'
import { TranslationHandler } from './handler/TranslationHandler'

const SUPPORTED_LOCALES = ['default', 'zh_TW']

function updateProfile (payload): void {
  // The page access token we have generated in your app settings
  const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN

  // Send the HTTP request to the Messenger Platform
  console.log('Sending payload: ', payload)

  axios.post(`https://graph.facebook.com/v2.6/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`, payload)
    .then(() => {
      console.log('Message sent!')
    }).catch((err) => {
      console.error('Unable to send message:', err)
    })
}

AppDataSource.initialize().then(async () => {
  // Setup the Get Started Button.
  updateProfile({
    get_started: {
      payload: 'Get Started'
    }
  })

  // Setup the Greeting Message
  updateProfile({
    greeting: await Promise.all(
      SUPPORTED_LOCALES.map(async (locale) => ({
        locale,
        text: await TranslationHandler.translate('Hello {{user_full_name}}, ready to start a self-diagnose?', locale)
      }))
    )
  })

  // Setup the persistent menu.
  updateProfile({
    persistent_menu: await Promise.all(
      SUPPORTED_LOCALES.map(async (locale) => ({
        locale,
        composer_input_disabled: true,
        call_to_actions: [
          {
            title: await TranslationHandler.translate("I'm not feeling good", locale),
            type: 'postback',
            payload: await TranslationHandler.translate("I'm not feeling good", locale)
          },
        ]
      }))
    )
  })
}).catch((err) => {
  console.error('Unable to setup profile:', err)
})
