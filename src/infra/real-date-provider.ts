import type { DateProviderPort } from '@/application/ports/date-provider.port'

export class RealDateProvider implements DateProviderPort {
  getNow(): Date {
    return new Date()
  }
}
