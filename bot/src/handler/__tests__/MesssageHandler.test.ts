import axios from 'axios'
import { AppDataSource } from '../../data-source'
import { User } from '../../entity/User'
import { MessageHandler } from '../MessageHandler'
import flow from '../../../flow.json'

jest.mock('axios')

test('Diagnose flow', async () => {
  (axios.post as jest.Mock).mockResolvedValue({})

  await AppDataSource.initialize()

  const user = await AppDataSource.getRepository(User).save({
    psid: '101010'
  })

  const sendTextFunction = jest.spyOn(MessageHandler.prototype as any, 'sendText')
  const sendOptionsFunction = jest.spyOn(MessageHandler.prototype as any, 'sendOptions')
  const closeSessionFunction = jest.spyOn(MessageHandler.prototype as any, 'closeSession')

  await new MessageHandler(user).handle('I\'m not feeling good')
  expect(sendOptionsFunction).toHaveBeenCalledWith('entry', 'What happened?', Object.keys(flow.entires))

  let subtree = flow.entires[Object.keys(flow.entires)[0]]
  await new MessageHandler(user).handle(Object.keys(flow.entires)[0])

  while (subtree.type === 'question') {
    expect(sendOptionsFunction).toHaveBeenCalledWith('question', `Do you have ${subtree.feature}?`, ['Yes', 'No', 'Cancel'])
    await new MessageHandler(user).handle('Yes')
    subtree = subtree.Yes
  }
  expect(sendTextFunction).toHaveBeenCalled()
  expect(closeSessionFunction).toHaveBeenCalled()

  await new MessageHandler(user).handle('I\'m not feeling good')
  expect(sendOptionsFunction).toHaveBeenCalledWith('entry', 'What happened?', Object.keys(flow.entires))

  await AppDataSource.destroy()
})

test('Cancel diagnose', async () => {
  (axios.post as jest.Mock).mockResolvedValue({})

  await AppDataSource.initialize()

  const user = await AppDataSource.getRepository(User).save({
    psid: '101010'
  })

  const sendTextFunction = jest.spyOn(MessageHandler.prototype as any, 'sendText')
  const sendOptionsFunction = jest.spyOn(MessageHandler.prototype as any, 'sendOptions')
  const closeSessionFunction = jest.spyOn(MessageHandler.prototype as any, 'closeSession')

  await new MessageHandler(user).handle('I\'m not feeling good')
  expect(sendOptionsFunction).toHaveBeenCalledWith('entry', 'What happened?', Object.keys(flow.entires))

  await new MessageHandler(user).handle('Cancel')
  expect(sendTextFunction).toHaveBeenCalled()
  expect(closeSessionFunction).toHaveBeenCalled()

  await AppDataSource.destroy()
})
