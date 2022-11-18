import * as dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { AppDataSource } from './data-source'
import { User } from './entity/User'
import { MessageHandler } from './handler/MessageHandler'
import path from 'path'
dotenv.config()

// create express app
const app = express()
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '/public')))

AppDataSource.initialize().then(async () => {
  app.get('/', (req: Request, res: Response) => {
    res.redirect('/index.html')
  })

  app.get('/webhook', async (req: Request, res: Response) => {
    // Your verify token. Should be a random string.
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN

    // Parse the query params
    const mode: string = req.query['hub.mode']
    const token: string = req.query['hub.verify_token']
    const challenge: string = req.query['hub.challenge']

    // Checks if a token and mode is in the query string of the request
    if ((mode !== undefined) && (token !== undefined)) {
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED')
        res.status(200).send(challenge)
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403)
      }
    }
  })

  app.post('/webhook', async (req: Request, res: Response) => {
    const body = req.body

    // Checks if this is an event from a page subscription
    if (body.object === 'page') {
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(async (entry) => {
        // Gets the body of the webhook event
        const webhookEvent = entry.messaging[0]
        console.log(webhookEvent)

        // Get the sender PSID
        const senderPsid = webhookEvent.sender.id
        console.log('Sender PSID: ', senderPsid)
        const user = await AppDataSource.getRepository(User).save({ psid: senderPsid })

        // Pass the event to the appropriate handler function
        const handler = new MessageHandler(user)
        if (webhookEvent.message !== undefined) {
          await handler.handle(webhookEvent.message.text)
        } else {
          await handler.handle(webhookEvent.postback.payload)
        }
      })

      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED')
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404)
    }
  })
}).catch(error => console.log(error))

module.exports = app
