import type { IdProviderPort } from '@/application/ports/id-provider.port'

export class DummyIdProvider implements IdProviderPort {
  getId(): string {
    return ''
  }
}
