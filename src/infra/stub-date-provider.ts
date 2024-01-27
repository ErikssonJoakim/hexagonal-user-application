import type { DateProviderPort } from '@/application/ports/date-provider.port'

export class StubDateProvider implements DateProviderPort {
  now?: Date = undefined

  getNow(): Date {
    if (this.now === undefined) {
      throw new Error('Stub now date not set')
    }
    return this.now
  }
}
