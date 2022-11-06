import { BaseHandler } from './BaseHandler'
import flow from '../../flow.json'
import { TranslationHandler } from './TranslationHandler'

export class MessageHandler extends BaseHandler {
  async handle (message: string): Promise<void> {
    message = await TranslationHandler.revert(message)
    await super.handle(message)

    switch (message) {
      case 'Get Started':
      case 'I\'m not feeling good':
        await this.openSession()
        await this.sendOptions('entry', 'What happened?', Object.keys(flow.entires))
        break
      case 'Cancel':
        await this.sendText('cancel', 'Diagnose canceled')
        await this.closeSession()
        break
      default:
        if (this.session != null) {
          // Enter the question flow.
          let subtree = flow.entires
          for (const received of this.session.receiveds) {
            subtree = subtree[received.text]
          }

          if (subtree['type'] === 'question') {
            await this.sendOptions('question', `Do you have ${subtree['feature']}?`, ['Yes', 'No', 'Cancel'])
          } else if (subtree['type'] === 'result') {
            let text = ''
            const probs = Object.entries(subtree['probability'])
            if (subtree['severity'] >= process.env.SEVERITY_THRESHOLD) {
              text += 'According to my data, your health is considered SEVERE!\n'
              text += 'You should see a doctor ASAP!!\n\n'

              if (probs[0][1] > 0.5) {
                text += 'You probably got '
                text += probs.filter(([_, prob]) => prob > 0.5)
                  .map(([disease, _]) => disease).join(', ')
                if (probs[probs.length - 1][1] <= 0.5) {
                  text += ' and low chance that got '
                  text += probs.filter(([_, prob]) => prob <= 0.5)
                    .map(([disease, _]) => disease).join(', ')
                }
              } else {
                text += 'You probably got one of the following: '
                text += probs.map(([disease, _]) => disease).join(', ')
              }
              text += '.\n'
            } else {
              text += '\nAccording to my data, your health is considered Healthy.\n'
              text += 'You should be fine.\n\n'

              if (probs[0][1] > 0.5) {
                text += 'But you probably got '
                text += probs.filter(([_, prob]) => prob > 0.5)
                  .map(([disease, _]) => disease).join(', ')
                if (probs[probs.length - 1][1] <= 0.5) {
                  text += ' and very low chance that got '
                  text += probs.filter(([_, prob]) => prob <= 0.5)
                    .map(([disease, _]) => disease).join(', ')
                }
              } else {
                text += 'But if you\'re sick, you probably got '
                text += probs.map(([disease, _]) => disease).join(', ')
              }
              text += '.\n\nNotice: You should NOT rely on me and must see a doctor if you feel sick.'
            }
            await this.sendText('result', text)
            await this.closeSession()
          }
        }
    }
  }
}
