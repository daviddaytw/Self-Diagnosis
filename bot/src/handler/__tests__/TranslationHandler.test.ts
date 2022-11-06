import { AppDataSource } from '../../data-source'
import { TranslationHandler } from '../TranslationHandler'

test('Translation reverse', async () => {
    await AppDataSource.initialize()
    
    let original = "I'm not feeling good"
    let native = await TranslationHandler.translate(original, 'zh_TW')
    expect(await TranslationHandler.revert(native)).toBe(original)

    await AppDataSource.destroy()
})
